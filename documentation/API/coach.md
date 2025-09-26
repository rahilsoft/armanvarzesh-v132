
# Coach API Documentation

## Get Coach List

- **Endpoint:** /coach/list
- **Method:** GET
- **Response:**
  - coaches: array of coach objects

## Assign Client

- **Endpoint:** /coach/assign-client
- **Method:** POST
- **Request Body:**
  - coachId: string
  - clientId: string
- **Response:**
  - success: boolean
