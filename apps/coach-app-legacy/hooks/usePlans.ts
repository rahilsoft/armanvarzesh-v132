
import { useQuery, useMutation } from "@apollo/client";
import { GET_PLANS } from "@graphql/queries/plan.queries";
import { CREATE_PLAN } from "@graphql/mutations/plan.mutations";

export function usePlans() {
  const { data, loading } = useQuery(GET_PLANS);
  const [createPlan] = useMutation(CREATE_PLAN);

  return {
    plans: data?.coachPlans || [],
    loading,
    createPlan: (input) => createPlan({ variables: { input } })
  };
}
