
import { gql } from "@apollo/client";

export const LOGIN_COACH = gql\`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      coach {
        id
        email
      }
    }
  }
\`;
