import { gql } from "@apollo/client";

export const USER_RESERVATIONS = gql`
  query UserReservations($userId: String!) {
    userReservations(userId: $userId) {
      id coachId startsAt endsAt status createdAt
    }
  }
`;
