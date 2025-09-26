
#!/usr/bin/env bash
# Requires: adb; device connected. Measures delta over duration while app in foreground.
PKG="${1:-com.arman.userapp}"
DUR="${2:-600}" # seconds
adb shell dumpsys batterystats --reset
adb shell am start -n "$PKG/.MainActivity" || true
echo "Collecting for $DUR seconds..."
sleep "$DUR"
adb shell am force-stop "$PKG" || true
adb shell dumpsys batterystats --charged > /sdcard/bench.txt
adb pull /sdcard/bench.txt ./battery-bench-${PKG}.txt
echo "Saved battery report to ./battery-bench-${PKG}.txt"
