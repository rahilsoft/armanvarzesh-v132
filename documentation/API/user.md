
# User API Documentation

## Get User Profile

- **Endpoint:** /user/profile
- **Method:** GET
- **Response:**
  - id: string
  - email: string
  - name: string

## Update User Profile

- **Endpoint:** /user/profile
- **Method:** PUT
- **Request Body:**
  - name: string
  - avatar: file
- **Response:**
  - success: boolean
