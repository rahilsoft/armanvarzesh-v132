
#!/usr/bin/env bash
# Requires: Xcode tools; uses xctrace to record Energy template.
DUR="${1:-600}" # seconds
OUT="ios-energy-trace.trace"
xcrun xctrace record --template 'Energy Log' --time-limit $DUR --output $OUT
echo "Saved energy trace to $OUT"
