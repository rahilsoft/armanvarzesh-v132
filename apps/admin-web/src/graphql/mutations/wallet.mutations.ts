
import { gql } from "@apollo/client";

export const UPDATE_WALLET = gql`
  mutation UpdateWallet($id: Int!, $input: WalletInput!) {
    updateWallet(id: $id, input: $input) { id }
  }
`;
