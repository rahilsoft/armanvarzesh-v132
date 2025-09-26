import { gql } from "@apollo/client";

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: Int!) {
    markNotificationRead(id: $id) { id read text createdAt }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead($userId: Int!) {
    markAllNotificationsRead(userId: $userId)
  }
`;
