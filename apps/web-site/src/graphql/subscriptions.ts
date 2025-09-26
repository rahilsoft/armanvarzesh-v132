import { gql } from '@apollo/client';

export const NOTIFICATION_RECEIVED = gql\`
  subscription NotificationReceived($userId: ID!) {
    notificationReceived(userId: $userId) {
      id
      message
      read
      createdAt
    }
  }
\`;