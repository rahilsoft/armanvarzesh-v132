
import { gql } from "@apollo/client";

export const CREATE_REWARD = gql`
  mutation CreateReward($input: RewardInput!) {
    createReward(input: $input) { id }
  }
`;
