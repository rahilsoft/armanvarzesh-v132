import { gql } from '@apollo/client';

export const GET_USER_PROFILE = gql\`
  query GetUserProfile($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      profilePicture
    }
  }
\`;

export const GET_WORKOUTS = gql\`
  query GetWorkouts($userId: ID!) {
    workouts(userId: $userId) {
      id
      title
      duration
      status
    }
  }
\`;