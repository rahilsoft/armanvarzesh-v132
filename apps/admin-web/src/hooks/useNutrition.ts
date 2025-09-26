
import { useQuery, useMutation } from "@apollo/client";
import { GET_NUTRITION_PLANS } from "@graphql/queries/nutrition.queries";
import { CREATE_NUTRITION_PLAN } from "@graphql/mutations/nutrition.mutations";

export function useNutrition() {
  const { data, loading } = useQuery(GET_NUTRITION_PLANS);
  const [createNutritionPlan] = useMutation(CREATE_NUTRITION_PLAN);

  return {
    nutritionPlans: data?.nutritionPlans || [],
    loading,
    createNutritionPlan: (input) => createNutritionPlan({ variables: { input } })
  };
}
