import { gql } from "@apollo/client";

// Create a new workout for a specific user. Accepts the user ID and a
// CreateWorkoutInput containing planned metrics (title, duration, sets, reps, weight)
// and optional fields (date, rpe, notes, mediaUrl). Returns the newly created workout ID.
export const CREATE_WORKOUT = gql`
  mutation CreateWorkout($userId: Int!, $input: CreateWorkoutInput!) {
    createWorkout(userId: $userId, input: $input) {
      id
    }
  }
`;

// Update an existing workout by its ID. Only provided fields in the
// input will be changed. Returns the updated workout ID.
export const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    updateWorkout(id: $id, input: $input) {
      id
    }
  }
`;

// Delete a workout by its ID. Returns true if removed.
export const DELETE_WORKOUT = gql`
  mutation DeleteWorkout($id: Int!) {
    deleteWorkout(id: $id)
  }
`;

// Log the actual performance data for a workout. Accepts the workout ID
// and an UpdateWorkoutInput containing metrics like sets, reps, weight, RPE,
// notes and mediaUrl. Returns the updated workout ID.
export const LOG_ACTUAL_WORKOUT = gql`
  mutation LogActualWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    logActual(id: $id, input: $input) {
      id
    }
  }
`;