
import { gql } from "@apollo/client";

export const GET_WALLET = gql\`
  query Wallet($userId: Int!) {
    wallet(userId: $userId) {
      id
      balance
    }
  }
\`;
