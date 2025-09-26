
import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS = gql\`
  query CoachNotifications {
    notifications {
      id
      text
      read
      createdAt
    }
  }
\`;
