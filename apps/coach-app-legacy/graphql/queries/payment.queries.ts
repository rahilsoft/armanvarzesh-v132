
import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql\`
  query CoachPayments {
    payments {
      id
      amount
      status
      createdAt
    }
  }
\`;
