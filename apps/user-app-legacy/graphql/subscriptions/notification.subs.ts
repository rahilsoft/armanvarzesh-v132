import { gql } from "@apollo/client";

export const NOTIFICATION_RECEIVED = gql`
  subscription NotificationReceived($userId: Int!) {
    notificationReceived(userId: $userId) {
      id
      text
      read
      createdAt
      userId
    }
  }
`;
