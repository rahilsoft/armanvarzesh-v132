
import { gql } from "@apollo/client";

export const GET_NUTRITION_PLANS = gql`
  query GetNutritionPlans {
    nutritionPlans {
      id
      title
      calories
    }
  }
`;
