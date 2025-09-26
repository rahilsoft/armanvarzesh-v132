import { gql } from "@apollo/client";

export const COACH_AVAILABILITY = gql`
  query CoachAvailability($coachId: String!) {
    coachAvailability(coachId: $coachId) {
      id coachId start end recurrence createdAt
    }
  }
`;

export const COACH_RESERVATIONS = gql`
  query CoachReservations($coachId: String!) {
    coachReservations(coachId: $coachId) {
      id userId startsAt endsAt status createdAt
    }
  }
`;
