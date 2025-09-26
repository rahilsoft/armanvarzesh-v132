
import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) { id }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $input: UserInput!) {
    updateUser(id: $id, input: $input) { id }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;
