
import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment($input: PaymentInput!) {
    createPayment(input: $input) { id }
  }
`;
