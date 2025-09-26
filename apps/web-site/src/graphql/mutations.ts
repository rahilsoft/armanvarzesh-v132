import { gql } from '@apollo/client';

export const LOGIN_USER = gql\`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
\`;

export const REGISTER_USER = gql\`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      id
      name
      email
    }
  }
\`;