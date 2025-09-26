# Domain Boundaries (Bounded Contexts)
- IAM/Auth — Users, roles, tokens
- Profile & Coach — CoachProfile, certificates, levels
- Programming — Workout Plan/Session/Versioning
- Reservation/Scheduling — Slot/Booking/Attendance
- Payments & Billing — Order/Invoice/Refund/Reconciliation
- Media — Asset/Variant/Policy + pre-signed URL
- Notification — Templates, channels, preferences
- Wearables Ingest — HealthKit/GoogleFit/Garmin
- Analytics — Read models (Postgres/MV) + logs (MongoDB)
- AI/Recommendation — Feature store, serving, feedback

Rule: Each context owns its schema; cross-context via API/events only.
