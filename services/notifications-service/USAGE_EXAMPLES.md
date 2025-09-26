# Usage Examples

## Booking confirmation email with ICS
```http
POST /notifications/schedule
Authorization: Bearer <user>
Content-Type: application/json

{
  "templateKey":"booking.confirm",
  "data":{
    "userName":"حسین",
    "coachName":"Arman",
    "localDate":"1404/06/10",
    "localTime":"10:30",
    "ics":{
      "title":"جلسه تمرین با Arman",
      "startUTC":"2025-09-01T10:00:00Z",
      "endUTC":"2025-09-01T10:30:00Z",
      "location":"Amsterdam Gym"
    }
  },
  "sendAt":"2025-09-01T08:00:00Z",
  "channels":["email"],
  "locale":"fa",
  "tz":"Europe/Amsterdam"
}
```

## Reminder (quiet hours respected)
```http
POST /notifications/schedule
{
  "templateKey":"booking.reminder",
  "data":{"userName":"حسین","minutesLeft":60},
  "sendAt":"2025-09-01T22:30:00Z",
  "channels":["push","email"],
  "locale":"fa",
  "tz":"Europe/Amsterdam"
}
# sendAt is shifted to 07:00 local next day
```
