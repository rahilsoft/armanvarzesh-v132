
import { gql } from "@apollo/client";

export const GET_ADMINS = gql`
  query GetAdmins {
    admins {
      id
      name
      email
    }
  }
`;
