
import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql\`
  mutation CreatePayment($userId: Int!, $input: PaymentInput!) {
    createPayment(userId: $userId, input: $input)
  }
\`;
