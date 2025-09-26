
import { gql } from "@apollo/client";

export const CREATE_NUTRITION_PLAN = gql`
  mutation CreateNutritionPlan($input: NutritionPlanInput!) {
    createNutritionPlan(input: $input) { id }
  }
`;
