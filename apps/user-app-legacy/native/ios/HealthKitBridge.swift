
// Swift stub bridge (placeholder).
// In a real app, link HealthKit, request permissions, and implement queries.
import Foundation
@objc(HealthKitBridge)
class HealthKitBridge: NSObject {
  @objc func getToday(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(["steps": 4200, "heartRateAvg": 72, "calories": 350, "waterMl": 500])
  }
  @objc func addWater(_ ml: NSNumber, resolver resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    resolve(true)
  }
  @objc static func requiresMainQueueSetup() -> Bool { return false }
}
