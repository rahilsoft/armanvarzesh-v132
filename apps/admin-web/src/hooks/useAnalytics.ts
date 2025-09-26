
import { useQuery, useMutation } from "@apollo/client";
import { GET_ANALYTICS } from "@graphql/queries/analytics.queries";
import { UPDATE_ANALYTICS } from "@graphql/mutations/analytics.mutations";

export function useAnalytics() {
  const { data, loading } = useQuery(GET_ANALYTICS);
  const [updateAnalytics] = useMutation(UPDATE_ANALYTICS);

  return {
    analytics: data?.analytics || {},
    loading,
    updateAnalytics: (input) => updateAnalytics({ variables: { input } })
  };
}
