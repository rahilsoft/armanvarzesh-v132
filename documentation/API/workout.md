
# Workout API Documentation

## Create Workout

- **Endpoint:** /workout/create
- **Method:** POST
- **Request Body:**
  - title: string
  - duration: number
- **Response:**
  - workoutId: string

## Get Workout List

- **Endpoint:** /workout/list
- **Method:** GET
- **Response:**
  - workouts: array of workout objects
