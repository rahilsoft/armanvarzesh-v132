
import { gql } from "@apollo/client";

export const CREATE_WORKOUT = gql\`
  mutation CreateWorkout($userId: Int!, $input: CreateWorkoutInput!) {
    createWorkout(userId: $userId, input: $input) {
      id
      title
    }
  }
\`;

// Update an existing workout. Only provided fields will be changed.
export const UPDATE_WORKOUT = gql\`
  mutation UpdateWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    updateWorkout(id: $id, input: $input) {
      id
      title
    }
  }
\`;

// Delete a workout by its ID. Returns true if removed.
export const DELETE_WORKOUT = gql\`
  mutation DeleteWorkout($id: Int!) {
    deleteWorkout(id: $id)
  }
\`;

// Log actual performance data for a workout. Accepts an UpdateWorkoutInput containing
// sets, reps, weight, RPE, notes and mediaUrl.
export const LOG_ACTUAL_WORKOUT = gql\`
  mutation LogActualWorkout($id: Int!, $input: UpdateWorkoutInput!) {
    logActual(id: $id, input: $input) {
      id
      title
    }
  }
\`;
