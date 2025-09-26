
import { useQuery } from "@apollo/client";
import { GET_LATEST_AI_PLAN } from "@graphql/queries/ai.queries";

export function useAiCoach(userId: number) {
  const { data, loading } = useQuery(GET_LATEST_AI_PLAN, { variables: { userId } });

  return {
    aiPlan: data?.latestAiPlan,
    loading
  };
}
