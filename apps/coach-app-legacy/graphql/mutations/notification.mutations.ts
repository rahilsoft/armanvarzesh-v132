
import { gql } from "@apollo/client";

export const SEND_NOTIFICATION = gql\`
  mutation SendNotification($input: NotificationInput!) {
    sendNotification(input: $input) {
      id
      text
    }
  }
\`;
