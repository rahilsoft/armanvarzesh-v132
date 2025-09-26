
import { gql } from "@apollo/client";

export const GET_CHALLENGES = gql`
  query GetChallenges {
    challenges {
      id
      title
      participants
    }
  }
`;

export const GET_CHALLENGE = gql`
  query GetChallenge($id: Int!) {
    challenge(id: $id) {
      id
      title
      participants
    }
  }
`;
