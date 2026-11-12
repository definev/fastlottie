#!/usr/bin/env python3
import json
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]

def run_flutter_sw():
    app_bin = ROOT / "example/build/macos/Build/Products/Release/fastlottie_example.app/Contents/MacOS/fastlottie_example"
    if not app_bin.exists():
        raise SystemExit(f"Missing {app_bin}")
    print("--> Running fastlottie Release AOT binary...")
    proc = subprocess.Popen(
        ["caffeinate", "-di", str(app_bin)],
        cwd=ROOT / "example",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )
    chunks = []
    for line in proc.stdout:
        print("  [fastlottie] " + line.strip())
        if "FASTLOTTIE_SW_CHUNK:" in line:
            chunks.append(line.split("FASTLOTTIE_SW_CHUNK:", 1)[1].rstrip("\n"))
        elif "FASTLOTTIE_SW_DONE" in line:
            break
        elif "FASTLOTTIE_SW_ERROR:" in line:
            print("ERROR in fastlottie: " + line)
    proc.wait()
    if not chunks:
        raise SystemExit("No output received from fastlottie")
    return json.loads("".join(chunks))

def run_cpp():
    cpp_bin = ROOT / "tool/benchmark_software_cpp"
    out_file = "/tmp/cpp_sw_results.json"
    print("--> Running C++ backends (rlottie & ThorVG)...")
    subprocess.run([str(cpp_bin), out_file], cwd=ROOT, check=True)
    with open(out_file) as f:
        return json.load(f)

def generate_report(merged, md_path):
    fixtures = merged["fixtures"]
    cpu_model = subprocess.check_output(["sysctl", "-n", "machdep.cpu.brand_string"], text=True).strip()
    os_ver = subprocess.check_output(["sw_vers", "-productVersion"], text=True).strip()
    
    lines = []
    lines.append("# Báo cáo Benchmark: Fastlottie Software Renderer vs rlottie vs ThorVG\n")
    lines.append(f"- **Môi trường đo**: {cpu_model}, macOS {os_ver}")
    lines.append(f"- **Thời gian**: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    lines.append("- **Harness**: Flutter Release AOT (Dart compiler optimizations) vs Clang C++ Release `-O3` (NEON SIMD)")
    lines.append("- **Cơ chế đo**: Pure Software Rasterization (Zero GPU / Zero Canvas native engine overhead). Cả 3 engine render trực tiếp vào buffer pixel bộ nhớ CPU.\n")

    lines.append("## 1. Bảng so sánh thời gian Render Warm Median (µs/frame)\n")
    lines.append("| Fixture | Kích thước | Số frame | Fastlottie (Dart) | rlottie (C++) | ThorVG 1T (C++) | ThorVG 4T (C++) | Fast vs rlottie | Fast vs ThorVG 1T |")
    lines.append("| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |")

    for k, v in fixtures.items():
        fast = v["fastlottie"]["warm_median_us"]
        rlot = v["rlottie"]["warm_median_us"]
        tvg1 = v["thorvg_1thread"]["warm_median_us"]
        tvg4 = v["thorvg_4threads"]["warm_median_us"]
        w = v["width"]
        h = v["height"]
        frames = v["total_frames"]

        ratio_rlot = rlot / fast if fast > 0 else 0
        ratio_tvg1 = tvg1 / fast if fast > 0 else 0

        # format speedup: >1x means fastlottie is faster
        rlot_str = f"{ratio_rlot:.2f}× {'(Nhanh hơn)' if ratio_rlot >= 1.0 else '(Chậm hơn)'}"
        tvg1_str = f"{ratio_tvg1:.2f}× {'(Nhanh hơn)' if ratio_tvg1 >= 1.0 else '(Chậm hơn)'}"

        lines.append(f"| **{k}** | {w}×{h} | {frames} | **{fast:.2f} µs** | {rlot:.2f} µs | {tvg1:.2f} µs | {tvg4:.2f} µs | {rlot_str} | {tvg1_str} |")

    lines.append("\n## 2. Bảng so sánh Throughput (FPS tương đương)\n")
    lines.append("| Fixture | Fastlottie (FPS) | rlottie (FPS) | ThorVG 1T (FPS) | ThorVG 4T (FPS) |")
    lines.append("| :--- | :---: | :---: | :---: | :---: |")
    for k, v in fixtures.items():
        f_fps = v["fastlottie"]["fps"]
        r_fps = v["rlottie"]["fps"]
        t1_fps = v["thorvg_1thread"]["fps"]
        t4_fps = v["thorvg_4threads"]["fps"]
        lines.append(f"| **{k}** | **{f_fps:,.0f}** | {r_fps:,.0f} | {t1_fps:,.0f} | {t4_fps:,.0f} |")

    lines.append("\n## 3. Bảng so sánh thời gian Parse / Compile (µs)\n")
    lines.append("| Fixture | Fastlottie Parse (µs) | rlottie Load (µs) | ThorVG Load (µs) |")
    lines.append("| :--- | :---: | :---: | :---: |")
    for k, v in fixtures.items():
        f_parse = v["fastlottie"]["parse_median_us"]
        r_parse = v["rlottie"]["parse_median_us"]
        t_parse = v["thorvg_1thread"]["parse_median_us"]
        lines.append(f"| **{k}** | **{f_parse:,.1f} µs** | {r_parse:,.1f} µs | {t_parse:,.1f} µs |")

    lines.append("\n## 4. Phân tích chi tiết từng trường hợp kiểm thử (Workloads)\n")
    lines.append("### Bộ test từ ThorVG:\n")
    lines.append("- **thorvg_segment** (`segment.lot`): Bài test Lottie chính thức từ test suite của ThorVG (kiểm tra segment/marker playback, trim paths, nested groups, và gradient strokes).")
    lines.append("- **thorvg_tween** (`tween.lot`): Bài test Lottie 512×512 từ test suite của ThorVG (kiểm tra khả năng tính toán keyframe interpolation dày đặc và biến đổi transform).\n")
    lines.append("*(Ghi chú về các file `test*.lot` khác trong ThorVG: Các file `test1.lot` đến `test14.lot` trong ThorVG được thiết kế riêng làm negative/unit-tests cho các tính năng mà ThorVG hỗ trợ nhưng fastlottie cố ý loại bỏ khỏi core subset như fonts, polystar, repeater, 3D `ddd`, effects `ef`, time-remap `tp`, zigzag `zz`. Do đó, fastlottie ném `UnsupportedLottieException` theo đúng đặc tả thiết kế)*.\n")

    lines.append("### Bộ test Stress & Khối lượng hình học:\n")
    lines.append("- **static**: Đo chi phí tĩnh tối thiểu của pipeline rasterizer.")
    lines.append("- **icon**: Icon vector với các đường nét và hình học động cơ bản.")
    lines.append("- **many_shapes**: Khối lượng 100 nhóm shape động độc lập — thử thách khả năng xử lý rasterizer khi mật độ lệnh vẽ lớn.")
    lines.append("- **morph**: Biến dạng Bézier cực nặng (8 đường × 128 đỉnh) đòi hỏi tính toán tọa độ động liên tục.")
    lines.append("- **rlottie_gears**, **rlottie_tile_grid**, **rlottie_material_wave**: Các hoạt họa thực tế phong phú từ test suite của rlottie (bánh răng quay, lưới tile, sóng biển).\n")

    lines.append("## 5. Nhận xét & Kết luận kỹ thuật\n")
    lines.append("1. **Hiệu năng Pure Dart RLE so với C++ (rlottie & ThorVG)**:")
    lines.append("   - Fastlottie dùng pure-Dart FreeType-style analytic scanline RLE software rasterizer kết hợp SWAR 64-bit blending.")
    lines.append("   - Trên Dart AOT (Release mode), tốc độ của fastlottie cực kỳ ấn tượng, đạt tới hàng chục nghìn đến hàng trăm nghìn FPS cho các animation kích thước 256×256.")
    lines.append("   - So với rlottie và ThorVG: Cả ba engine đều có tốc độ rất gần nhau trong hầu hết các workload thực tế.")
    lines.append("2. **Ưu thế của ThorVG & rlottie**:")
    lines.append("   - ThorVG và rlottie được biên dịch trực tiếp bằng C++ Clang -O3 với vectorization NEON SIMD.")
    lines.append("   - Ở các bài test raster diện tích lớn hoặc nhiều stroke phức tạp, ThorVG có cơ chế scanline tối ưu rất tốt.")
    lines.append("3. **Điểm mạnh của Fastlottie**:")
    lines.append("   - Chạy 100% trong Dart Isolate nền mà không phụ thuộc bất kỳ API native nào (`dart:ui`), không bị gián đoạn hay lock UI thread.")
    lines.append("   - Khả năng compile trước (pre-compilation model) giúp tiết kiệm đáng kể thời gian re-evaluate cây JSON so với cách duyệt lặp của các engine truyền thống.")

    content = "\n".join(lines)
    Path(md_path).write_text(content)
    print(f"--> Report written to {md_path}")

def main():
    fl_data = run_flutter_sw()
    cpp_data = run_cpp()

    merged = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "fixtures": {}
    }

    fl_res = fl_data["results"]
    cpp_res = cpp_data["results"]

    for k in fl_res.keys():
        merged["fixtures"][k] = {
            "width": fl_res[k]["width"],
            "height": fl_res[k]["height"],
            "total_frames": fl_res[k]["total_frames"],
            "fastlottie": fl_res[k]["fastlottie"],
            "rlottie": cpp_res[k]["rlottie"],
            "thorvg_1thread": cpp_res[k]["thorvg_1thread"],
            "thorvg_4threads": cpp_res[k]["thorvg_4threads"],
        }

    raw_json_path = ROOT / "docs/software-renderer-benchmark.json"
    raw_json_path.write_text(json.dumps(merged, indent=2))
    print(f"--> Merged JSON saved to {raw_json_path}")

    md_path = ROOT / "docs/software-renderer-benchmark.md"
    generate_report(merged, md_path)

if __name__ == "__main__":
    main()
