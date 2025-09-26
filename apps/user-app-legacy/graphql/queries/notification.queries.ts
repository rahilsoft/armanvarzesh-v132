
import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql\`
  query Notifications($userId: Int!) {
    notifications(userId: $userId) {
      id
      text
      read
      createdAt
    }
  }
\`;
