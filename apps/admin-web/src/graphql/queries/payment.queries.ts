
import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      user
      amount
      status
    }
  }
`;

export const GET_PAYMENT = gql`
  query GetPayment($id: Int!) {
    payment(id: $id) {
      id
      user
      amount
      status
    }
  }
`;
