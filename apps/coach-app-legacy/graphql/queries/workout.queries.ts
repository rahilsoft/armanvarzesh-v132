
import { gql } from "@apollo/client";

export const GET_WORKOUTS_FOR_APPROVAL = gql\`
  query WorkoutsForApproval {
    workoutsForApproval {
      id
      title
      user {
        id
        name
      }
      status
      date
    }
  }
\`;
