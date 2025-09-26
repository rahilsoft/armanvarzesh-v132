
import { gql } from "@apollo/client";

export const CREATE_PLAN = gql\`
  mutation CreatePlan($input: PlanInput!) {
    createPlan(input: $input) {
      id
      title
    }
  }
\`;
