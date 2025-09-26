
import { gql } from "@apollo/client";

export const APPROVE_WORKOUT = gql\`
  mutation ApproveWorkout($id: Int!) {
    approveWorkout(id: $id) {
      id
      status
    }
  }
\`;
