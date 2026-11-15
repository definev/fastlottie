import Flutter
import UIKit
import os.signpost

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  private let benchmarkLog = OSLog(subsystem: "com.example.fastlottie.instruments", category: .pointsOfInterest)
  private var benchmarkIntervals: [String: OSSignpostID] = [:]
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
    let channel = FlutterMethodChannel(
      name: "fastlottie/instruments", binaryMessenger: engineBridge.applicationRegistrar.messenger())
    channel.setMethodCallHandler { [weak self] call, result in
      guard let self else {
        result(FlutterMethodNotImplemented)
        return
      }
      switch call.method {
      case "configuration":
        UIApplication.shared.isIdleTimerDisabled = true
        result([
          "mode": ProcessInfo.processInfo.environment["FL_INSTRUMENTS_MODE"] ?? "mini-strip",
          "dwell_seconds": Int(ProcessInfo.processInfo.environment["FL_INSTRUMENTS_DWELL"] ?? "20") ?? 20,
          "startup_seconds": Int(ProcessInfo.processInfo.environment["FL_INSTRUMENTS_STARTUP"] ?? "15") ?? 15,
        ])
      case "state":
        result([
          "thermal_state": ProcessInfo.processInfo.thermalState.rawValue,
          "uptime_seconds": ProcessInfo.processInfo.systemUptime,
          "brightness": UIScreen.main.brightness,
          "low_power_mode": ProcessInfo.processInfo.isLowPowerModeEnabled,
          "app_active": UIApplication.shared.applicationState == .active,
        ])
      case "finished":
        UIApplication.shared.isIdleTimerDisabled = false
        result(nil)
      case "begin", "end":
        guard let phase = call.arguments as? String else {
          result(FlutterError(code: "invalid_phase", message: "Expected scenario name", details: nil))
          return
        }
        if call.method == "begin" {
          let id = OSSignpostID(log: self.benchmarkLog)
          self.benchmarkIntervals[phase] = id
          os_signpost(.begin, log: self.benchmarkLog, name: "Chat Scenario", signpostID: id, "%{public}@", phase)
        } else if let id = self.benchmarkIntervals.removeValue(forKey: phase) {
          os_signpost(.end, log: self.benchmarkLog, name: "Chat Scenario", signpostID: id, "%{public}@", phase)
        }
        result(nil)
      default:
        result(FlutterMethodNotImplemented)
      }
    }
  }
}
