
import { gql } from "@apollo/client";

export const CREATE_COACH = gql`
  mutation CreateCoach($input: CoachInput!) {
    createCoach(input: $input) { id }
  }
`;
