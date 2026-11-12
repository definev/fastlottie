#!/usr/bin/env python3
"""Compare software rendering memory in isolated macOS processes."""
import argparse
from contextlib import nullcontext
import ctypes
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import hashlib
import itertools
import json
import os
from pathlib import Path
import plistlib
import queue
import shutil
import statistics
import subprocess
import sys
import tempfile
import threading
import time

ROOT = Path(__file__).resolve().parents[1]
PREFIX = "FASTLOTTIE_RAM "
PHASES = ("loaded", "bound", "first_frame", "warm", "released")
ENGINES = ("fastlottie", "rlottie", "thorvg", "rlottie-pool", "thorvg-4w")
DEFAULT_ENGINES = ENGINES[:3]


@dataclass(frozen=True)
class Case:
    fixture: str
    size: int
    instances: int = 1
    frames: int = 60
    cycles: int = 1


CASES = {
    "icon": Case("icon", 256),
    "morph": Case("morph", 256),
    "tween": Case("thorvg_tween", 512, frames=150),
    "many-shapes-24": Case("many_shapes", 256, instances=24),
    "tween-24": Case("thorvg_tween", 512, instances=24, frames=150),
    "morph-churn": Case("morph", 256, instances=16, cycles=10),
}


class RusageV4(ctypes.Structure):
    """rusage_info_v4 from the macOS SDK's sys/resource.h."""
    _fields_ = [("uuid", ctypes.c_uint8 * 16)] + [
        (name, ctypes.c_uint64)
        for name in """
        user_time system_time pkg_idle_wkups interrupt_wkups pageins wired_size
        resident_size phys_footprint proc_start_abstime proc_exit_abstime
        child_user_time child_system_time child_pkg_idle_wkups
        child_interrupt_wkups child_pageins child_elapsed_abstime
        diskio_bytesread diskio_byteswritten cpu_time_qos_default
        cpu_time_qos_maintenance cpu_time_qos_background cpu_time_qos_utility
        cpu_time_qos_legacy cpu_time_qos_user_initiated cpu_time_qos_user_interactive
        billed_system_time serviced_system_time logical_writes
        lifetime_max_phys_footprint instructions cycles billed_energy
        serviced_energy interval_max_phys_footprint runnable_time
        """.split()
    ]


def mac_sampler():
    lib = ctypes.CDLL("/usr/lib/libproc.dylib", use_errno=True)
    sample = lib.proc_pid_rusage
    sample.argtypes = (ctypes.c_int, ctypes.c_int, ctypes.c_void_p)
    sample.restype = ctypes.c_int

    def read(pid):
        usage = RusageV4()
        if sample(pid, 4, ctypes.byref(usage)) != 0:
            err = ctypes.get_errno()
            raise OSError(err, f"proc_pid_rusage({pid}): {os.strerror(err)}")
        return {
            "footprint_bytes": usage.phys_footprint,
            "rss_bytes": usage.resident_size,
            "peak_footprint_bytes": usage.lifetime_max_phys_footprint,
        }

    return read


def command(args, cwd=ROOT):
    return subprocess.check_output(args, cwd=cwd, text=True).strip()


def run_build(args, log, cwd=ROOT):
    with log.open("ab") as output:
        subprocess.run([str(arg) for arg in args], cwd=cwd, stdout=output,
                       stderr=subprocess.STDOUT, check=True)


def app_executable(app):
    if app.is_file():
        return app.resolve()
    with (app / "Contents/Info.plist").open("rb") as info:
        executable = plistlib.load(info)["CFBundleExecutable"]
    return (app / "Contents/MacOS" / executable).resolve()


def build_flutter(work, log):
    package = work / "flutter"
    example = package / "example"
    example.mkdir(parents=True, exist_ok=True)
    for directory in ("lib", "native", "hook"):
        shutil.copytree(ROOT / directory, package / directory, dirs_exist_ok=True)
    for name in ("pubspec.yaml", "pubspec.lock"):
        if (ROOT / name).is_file():
            shutil.copy2(ROOT / name, package)
        shutil.copy2(ROOT / "example" / name, example)
    shutil.copytree(ROOT / "example/assets", example / "assets", dirs_exist_ok=True)
    shutil.copytree(
        ROOT / "example/macos", example / "macos", dirs_exist_ok=True,
        ignore=shutil.ignore_patterns("ephemeral", "xcuserdata", "FlutterGeneratedPluginSwiftPackage"),
    )
    target = "lib/memory_benchmark.dart"
    (example / "lib").mkdir(exist_ok=True)
    shutil.copy2(ROOT / "example" / target, example / target)
    run_build(["flutter", "build", "macos", "--release", "--target", target], log, example)
    apps = sorted((example / "build/macos/Build/Products/Release").glob("*.app"))
    if len(apps) != 1:
        raise ValueError(f"Expected one Flutter app in {example}, got {apps}")
    return app_executable(apps[0])


def build_native(engine, work, log):
    thorvg = engine.startswith("thorvg")
    root = ROOT / ("thorvg-main" if thorvg else "rlottie-master")
    if not root.is_dir():
        raise ValueError(f"Missing source directory: {root}")
    if thorvg:
        libdir = root / "build/src"
        library, flag = "thorvg-1", "MEMORY_THORVG"
    else:
        libdir = work / f"build-{engine}"
        library, flag = "rlottie", "MEMORY_RLOTTIE"
        run_build([
            "cmake", "-S", root, "-B", libdir, "-G", "Ninja",
            "-DCMAKE_POLICY_VERSION_MINIMUM=3.5", "-DCMAKE_BUILD_TYPE=Release",
            "-DBUILD_SHARED_LIBS=ON", "-DLOTTIE_MODULE=OFF",
            f"-DLOTTIE_THREAD={'ON' if engine == 'rlottie-pool' else 'OFF'}",
        ], log)
        run_build(["cmake", "--build", libdir, "--parallel", "4"], log)
    dylib = libdir / f"lib{library}.dylib"
    if not dylib.is_file():
        raise ValueError(f"Missing release dylib: {dylib}")
    binary = work / f"ram-{engine}"
    run_build([
        "clang++", "-std=c++17", "-O3", "-DNDEBUG", f"-D{flag}",
        "-I", root / "inc", ROOT / "tool/memory_benchmark.cpp",
        "-L", libdir, f"-l{library}", f"-Wl,-rpath,{libdir}", "-o", binary,
    ], log)
    return binary, dylib


def run_probe(binary, engine, case, sample, settle, timeout, log):
    common = [str(case.instances), str(case.size), str(case.frames), str(case.cycles)]
    if engine == "fastlottie":
        args = [case.fixture, *common]
    else:
        args = [str(ROOT / f"example/assets/{case.fixture}.json"), *common,
                "4" if engine == "thorvg-4w" else "0"]
    expected = [
        ("baseline", 0),
        *((phase, cycle) for cycle in range(1, case.cycles + 1) for phase in PHASES),
        ("settled", case.cycles),
    ]
    # The stdout reader does not sample; it just gives the main thread a deadline.
    events = queue.Queue()
    with subprocess.Popen(
        [str(binary), *args], cwd=ROOT, stdin=subprocess.PIPE,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1,
    ) as proc:
        def read_output():
            with log.open("w") as stream:
                for line in proc.stdout:
                    stream.write(line)
                    if line.startswith(PREFIX):
                        events.put(line[len(PREFIX):])
            events.put(None)

        reader = threading.Thread(target=read_output, daemon=True)
        reader.start()
        results = []
        try:
            for phase, cycle in expected:
                line = events.get(timeout=timeout)
                if line is None:
                    raise ValueError(f"Process exited before {phase}/{cycle}")
                event = json.loads(line)
                if (event["phase"], event["cycle"]) != (phase, cycle):
                    raise ValueError(f"Expected {phase}/{cycle}, got {event}")
                if phase == "warm" and not 0 < event["visible_pixels"] <= case.size ** 2:
                    raise ValueError(f"Bad render probe: {event}")
                time.sleep(max(settle, 0.4) if phase == "settled" else settle)
                event.update(sample(proc.pid))
                results.append(event)
                proc.stdin.write("continue\n")
                proc.stdin.flush()
            if proc.wait(timeout=timeout) != 0:
                raise ValueError(f"Exit code {proc.returncode}")
        except (OSError, ValueError, queue.Empty, subprocess.TimeoutExpired) as error:
            raise RuntimeError(f"{engine}: {error or 'checkpoint timed out'}; see {log}") from error
        finally:
            if proc.poll() is None:
                proc.kill()
                proc.wait()
            reader.join()
    return results


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def summarize(runs):
    rows = []
    for (case, engine), grouped in itertools.groupby(
        sorted(runs, key=lambda r: (r["case"], r["engine"])),
        key=lambda r: (r["case"], r["engine"]),
    ):
        group = list(grouped)
        def value(run, phase, field="footprint_bytes", cycle=None):
            return next(p[field] for p in reversed(run["samples"])
                        if p["phase"] == phase and (cycle is None or p["cycle"] == cycle))
        def median(fn):
            return int(statistics.median(fn(run) for run in group))
        baseline = lambda r: value(r, "baseline")
        row = {
            "case": case, "engine": engine, "repeats": len(group),
            "baseline_bytes": median(baseline),
            "output_bytes": group[0]["output_bytes"],
            "loaded_delta_bytes": median(lambda r: value(r, "loaded", cycle=1) - baseline(r)),
            "bound_delta_bytes": median(lambda r: value(r, "bound", cycle=1) - baseline(r)),
            "warm_bytes": median(lambda r: value(r, "warm")),
            "warm_delta_bytes": median(lambda r: value(r, "warm") - baseline(r)),
            "peak_bytes": median(lambda r: value(r, "settled", "peak_footprint_bytes")),
            "settled_delta_bytes": median(lambda r: value(r, "settled") - baseline(r)),
            "release_drift_bytes": median(
                lambda r: value(r, "released") - value(r, "released", cycle=1)),
            "visible_pixels": median(lambda r: value(r, "warm", "visible_pixels")),
        }
        rows.append(row)
    return rows


def run(args, work):
    log_dir = args.output.parent / f"{args.output.stem}-logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    work.mkdir(parents=True, exist_ok=True)
    bins, digests = {}, {}
    for engine in args.engine:
        log = log_dir / f"build-{engine}.log"
        print(f"Preparing {engine}...", flush=True)
        try:
            if engine == "fastlottie":
                bins[engine] = (app_executable(args.fastlottie_app) if args.fastlottie_app
                                else build_flutter(work, log))
            else:
                bins[engine], dylib = build_native(engine, work, log)
                digests[engine] = sha(dylib)
        except (OSError, ValueError, subprocess.CalledProcessError) as error:
            raise RuntimeError(f"Could not prepare {engine}: {error}; see {log}") from error
    sample = mac_sampler()
    runs = []
    for name in args.case:
        case = CASES[name]
        for repeat in range(1, args.repeats + 1):
            # Rotate order to avoid always running the same engine first.
            rotation = (repeat - 1) % len(args.engine)
            for engine in args.engine[rotation:] + args.engine[:rotation]:
                print(f"{name}: {engine} ({repeat}/{args.repeats})", flush=True)
                samples = run_probe(
                    bins[engine], engine, case, sample, args.settle_ms / 1000,
                    args.timeout, log_dir / f"{name}-{engine}-{repeat}.log",
                )
                runs.append({
                    "case": name, "engine": engine, "repeat": repeat,
                    "output_bytes": case.instances * case.size ** 2 * 4,
                    "samples": samples,
                })
    result = {
        "schema": 1,
        "metadata": {
            "time_utc": datetime.now(timezone.utc).isoformat(),
            "os": command(["sw_vers"]),
            "cpu": command(["sysctl", "-n", "machdep.cpu.brand_string"]),
            "arch": os.uname().machine,
            "flutter": command(["flutter", "--version"]) if "fastlottie" in args.engine else None,
            "git_head": command(["git", "rev-parse", "HEAD"]),
            "settle_ms": args.settle_ms,
            "fastlottie_prebuilt": bool(args.fastlottie_app),
            "native_dylib_sha256": digests,
            "thorvg_config": ((ROOT / "thorvg-main/build/config.h").read_text()
                              if any(e.startswith("thorvg") for e in args.engine) else None),
            "source_sha256": {
                str(path.relative_to(ROOT)): sha(path)
                for path in [
                    ROOT / "tool/run_memory_benchmark.py", ROOT / "tool/memory_benchmark.cpp",
                    ROOT / "example/lib/memory_benchmark.dart",
                    *sorted((ROOT / "lib").rglob("*.dart")),
                    *sorted((ROOT / "native").glob("*.c")),
                ]
            },
        },
        "cases": {
            name: {
                **asdict(CASES[name]),
                "fixture_sha256": sha(ROOT / f"example/assets/{CASES[name].fixture}.json"),
            } for name in args.case
        },
        "summary": summarize(runs),
        "runs": runs,
    }
    args.output.write_text(json.dumps(result, indent=2) + "\n")
    print(f"Wrote {args.output}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--case", action="append", choices=tuple(CASES))
    parser.add_argument("--engine", action="append", choices=ENGINES)
    parser.add_argument("--repeats", type=int, default=3)
    parser.add_argument("--settle-ms", type=int, default=80)
    parser.add_argument("--timeout", type=float, default=45, help="Seconds per checkpoint")
    parser.add_argument("--work-dir", type=Path, help="Reuse builds under this directory")
    parser.add_argument("--fastlottie-app", type=Path, help="Use a prebuilt release app or executable")
    args = parser.parse_args()
    if sys.platform != "darwin":
        parser.error("This sampler uses macOS proc_pid_rusage")
    if args.repeats < 1 or args.settle_ms < 0 or args.timeout <= 0:
        parser.error("Invalid repeat count, settle time or timeout")
    args.case = list(dict.fromkeys(args.case or CASES))
    args.engine = list(dict.fromkeys(args.engine or DEFAULT_ENGINES))
    args.output = args.output.resolve()
    context = (nullcontext(args.work_dir.resolve()) if args.work_dir
               else tempfile.TemporaryDirectory(prefix="fastlottie-memory-"))
    with context as work:
        run(args, Path(work))


if __name__ == "__main__":
    main()
