
import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: NotificationInput!) {
    createNotification(input: $input) { id }
  }
`;
