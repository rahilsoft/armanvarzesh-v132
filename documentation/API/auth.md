
# Auth API Documentation

## Register

- **Endpoint:** /auth/register
- **Method:** POST
- **Request Body:**
  - email: string
  - password: string
- **Response:**
  - token: JWT token

## Login

- **Endpoint:** /auth/login
- **Method:** POST
- **Request Body:**
  - email: string
  - password: string
- **Response:**
  - token: JWT token
