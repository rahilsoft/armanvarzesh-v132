import { gql } from "@apollo/client";
export const GET_CHAT = gql`
  query GetChat($userA:Int!, $userB:Int!) {
    getChat(userA:$userA, userB:$userB) {
      id senderId receiverId content attachmentId createdAt
    }
  }
`;
