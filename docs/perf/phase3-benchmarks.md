
# Phase 3 Benchmarks (Methodology & Targets)

## GPS Sample Loss
- Target: <1% sample loss at 1 Hz under background constraints.
- Method: Capture NMEA/GPX stream for 30 min walk; compare expected vs persisted points.

## Battery Impact (Run 30 min)
- Android 10+, iOS 16+; screen off, background tracking.
- Target drain: <= 6-8% for 30 min run on mainstream devices.

## Ingestion Lag
- From route POST to summary availability: < 2 s p50 (intra-cluster).
