
import { gql } from "@apollo/client";

// Fetch all workouts across all users. Use sparingly in admin dashboards.
export const GET_WORKOUTS = gql`
  query GetWorkouts {
    workouts {
      id
      title
      duration
      sets
      reps
      weight
      rpe
      notes
      mediaUrl
      userId
    }
  }
`;

export const GET_WORKOUT = gql`
  query GetWorkout($id: Int!) {
    workout(id: $id) {
      id
      title
      duration
      sets
      reps
      weight
      rpe
      notes
      mediaUrl
      userId
    }
  }
`;

// Fetch workouts for a specific user.
export const GET_USER_WORKOUTS = gql`
  query GetUserWorkouts($userId: Int!) {
    userWorkouts(userId: $userId) {
      id
      title
      duration
      sets
      reps
      weight
      rpe
      notes
      mediaUrl
      userId
    }
  }
`;
