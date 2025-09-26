
import { useQuery, useMutation } from "@apollo/client";
import { GET_REWARDS } from "@graphql/queries/reward.queries";
import { CREATE_REWARD } from "@graphql/mutations/reward.mutations";

export function useReward() {
  const { data, loading } = useQuery(GET_REWARDS);
  const [createReward] = useMutation(CREATE_REWARD);

  return {
    rewards: data?.rewards || [],
    loading,
    createReward: (input) => createReward({ variables: { input } })
  };
}
