import { gql } from "@apollo/client";
export const MESSAGE_RECEIVED = gql`
  subscription MessageReceived($userId: Int!) {
    messageReceived(userId: $userId) { id senderId receiverId content attachmentId createdAt }
  }
`;
