
import { gql } from "@apollo/client";

export const USER_PROFILE = gql\`
  query UserProfile {
    me {
      id
      name
      email
      avatar
      wallet {
        balance
      }
    }
  }
\`;
