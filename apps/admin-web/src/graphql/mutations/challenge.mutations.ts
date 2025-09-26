
import { gql } from "@apollo/client";

export const CREATE_CHALLENGE = gql`
  mutation CreateChallenge($input: ChallengeInput!) {
    createChallenge(input: $input) { id }
  }
`;
