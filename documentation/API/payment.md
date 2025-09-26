
# Payment API Documentation

## Make Payment

- **Endpoint:** /payment/make
- **Method:** POST
- **Request Body:**
  - userId: string
  - amount: number
  - method: string
- **Response:**
  - success: boolean
  - transactionId: string
