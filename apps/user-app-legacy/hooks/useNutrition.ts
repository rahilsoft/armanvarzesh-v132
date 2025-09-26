
import { useQuery, useMutation } from "@apollo/client";
import { GET_MEALS } from "@graphql/queries/nutrition.queries";
import { CREATE_MEAL } from "@graphql/mutations/nutrition.mutations";

export function useNutrition(userId: number) {
  const { data, loading } = useQuery(GET_MEALS, { variables: { userId } });
  const [createMeal] = useMutation(CREATE_MEAL);

  return {
    meals: data?.userMeals || [],
    loading,
    createMeal: (input) => createMeal({ variables: { userId, input } })
  };
}
