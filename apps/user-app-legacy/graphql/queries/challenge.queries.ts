
import { gql } from "@apollo/client";

export const GET_CHALLENGES = gql\`
  query Challenges {
    challenges {
      id
      name
      description
      duration
      createdAt
    }
  }
\`;
