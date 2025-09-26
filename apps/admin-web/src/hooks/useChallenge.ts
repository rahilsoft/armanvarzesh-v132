
import { useQuery, useMutation } from "@apollo/client";
import { GET_CHALLENGES } from "@graphql/queries/challenge.queries";
import { CREATE_CHALLENGE } from "@graphql/mutations/challenge.mutations";

export function useChallenge() {
  const { data, loading } = useQuery(GET_CHALLENGES);
  const [createChallenge] = useMutation(CREATE_CHALLENGE);

  return {
    challenges: data?.challenges || [],
    loading,
    createChallenge: (input) => createChallenge({ variables: { input } })
  };
}
