
import { gql } from "@apollo/client";

export const GET_REWARDS = gql`
  query GetRewards {
    rewards {
      id
      title
      xp
    }
  }
`;
