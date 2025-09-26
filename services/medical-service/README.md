# Medical Service (Tests & Appointments)

Catalog of tests, clinic/doctor booking, appointment flow with fasting warnings, and results webhook.

## Endpoints
- `GET  /medical/testsCatalog`
- `GET  /medical/nearbyFacilities?lat=&lng=&radius=`
- `GET  /medical/myAppointments`
- `POST /medical/bookAppointment` `{ facilityId, doctorId, tests[], slot }`
- `POST /medical/cancelAppointment` `{ id }`
- `POST /medical/reschedule` `{ id, newSlot }`
- `POST /medical/webhooks/results-ready` `{ appointmentId, summary }`

### Acceptance
- Slot conflict detection (capacity).
- Fasting flag computed if any selected test requires fasting.
- Return **ICS** text for calendar attachment on booking.

## Dev
```bash
pnpm -F @arman/medical-service prisma:generate
pnpm -F @arman/medical-service prisma:migrate
pnpm -F @arman/medical-service build && pnpm -F @arman/medical-service start
pnpm -F @arman/medical-service seed
```
