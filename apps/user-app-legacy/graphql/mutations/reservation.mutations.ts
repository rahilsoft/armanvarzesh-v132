import { gql } from "@apollo/client";

export const BOOK_RESERVATION = gql`
  mutation BookReservation($input: CreateReservationInput!) {
    bookReservation(input: $input) { id coachId slotId status startsAt endsAt }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($id: String!) {
    cancelReservation(id: $id)
  }
`;
