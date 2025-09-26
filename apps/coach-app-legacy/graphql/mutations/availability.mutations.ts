import { gql } from "@apollo/client";

export const CREATE_AVAILABILITY = gql`
  mutation CreateAvailability($input: CreateAvailabilityInput!) {
    createAvailability(input: $input) { id coachId start end recurrence }
  }
`;
