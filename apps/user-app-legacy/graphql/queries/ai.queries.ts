
import { gql } from "@apollo/client";

export const GET_LATEST_AI_PLAN = gql\`
  query LatestAiPlan($userId: Int!) {
    latestAiPlan(userId: $userId) {
      id
      plan
      createdAt
    }
  }
\`;
