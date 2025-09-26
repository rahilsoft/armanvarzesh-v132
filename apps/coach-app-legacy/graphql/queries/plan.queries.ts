
import { gql } from "@apollo/client";

export const GET_PLANS = gql\`
  query CoachPlans {
    coachPlans {
      id
      title
      sessions
      createdAt
    }
  }
\`;
