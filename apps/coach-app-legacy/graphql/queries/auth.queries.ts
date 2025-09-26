
import { gql } from "@apollo/client";

export const LOGIN_COACH = gql`
  mutation LoginCoach($email:String!,$password:String!){
    login(email:$email, password:$password){
      token
      coach { id email name role }
      refreshToken
      expiresAt
    }
  }
`;

export const REGISTER_COACH = gql`
  mutation RegisterCoach($input:RegisterInput!){
    register(input:$input){
      token
      coach { id email name role }
      refreshToken
      expiresAt
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation Refresh($refreshToken:String!){
    refresh(refreshToken:$refreshToken){
      token
      expiresAt
    }
  }
`;
