
// Kotlin stub bridge (placeholder).
// In production, connect Google Fit Recording/History APIs and handle OAuth.
package com.arman.userapp

import com.facebook.react.bridge.*

class GoogleFitBridge(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String = "GoogleFitBridge"

  @ReactMethod
  fun getToday(promise: Promise) {
    val map = Arguments.createMap()
    map.putInt("steps", 4200)
    map.putInt("heartRateAvg", 72)
    map.putInt("calories", 350)
    map.putInt("waterMl", 500)
    promise.resolve(map)
  }

  @ReactMethod
  fun addWater(ml: Int, promise: Promise) { promise.resolve(true) }
}
