
# Notification API Documentation

## Get Notifications

- **Endpoint:** /notification/list
- **Method:** GET
- **Response:**
  - notifications: array of notification objects

## Mark Notification Read

- **Endpoint:** /notification/mark-read
- **Method:** POST
- **Request Body:**
  - notificationId: string
- **Response:**
  - success: boolean
