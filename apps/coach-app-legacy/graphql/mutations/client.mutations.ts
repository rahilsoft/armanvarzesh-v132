
import { gql } from "@apollo/client";

export const ADD_CLIENT = gql\`
  mutation AddClient($input: ClientInput!) {
    addClient(input: $input) {
      id
      name
    }
  }
\`;
