import { gql } from "@apollo/client";
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) { id senderId receiverId content createdAt }
  }
`;
export const SEND_ATTACHMENT = gql`
  mutation SendAttachment($input: SendAttachmentInput!) {
    sendAttachment(input: $input) { id senderId receiverId attachmentId createdAt }
  }
`;
