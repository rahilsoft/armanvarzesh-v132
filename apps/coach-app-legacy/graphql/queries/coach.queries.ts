
import { gql } from "@apollo/client";

export const COACH_PROFILE = gql\`
  query CoachProfile {
    meCoach {
      id
      name
      email
      avatar
    }
  }
\`;
