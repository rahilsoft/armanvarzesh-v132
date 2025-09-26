
import { gql } from "@apollo/client";

export const GET_WORKOUTS = gql\`
  query UserWorkouts($userId: Int!) {
    userWorkouts(userId: $userId) {
      id
      title
      duration
      date
      sets
      reps
      weight
      rpe
      notes
      mediaUrl
    }
  }
\`;

export const GET_WORKOUT_DETAIL = gql\`
  query Workout($id: Int!) {
    workout(id: $id) {
      id
      title
      duration
      date
      sets
      reps
      weight
      rpe
      notes
      mediaUrl
    }
  }
\`;
