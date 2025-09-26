
import { gql } from "@apollo/client";

export const GET_COACHES = gql`
  query GetCoaches {
    coaches {
      id
      name
      email
    }
  }
`;

export const GET_COACH = gql`
  query GetCoach($id: Int!) {
    coach(id: $id) {
      id
      name
      email
    }
  }
`;
