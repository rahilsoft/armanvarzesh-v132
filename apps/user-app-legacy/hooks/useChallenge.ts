
import { useQuery } from "@apollo/client";
import { GET_CHALLENGES } from "@graphql/queries/challenge.queries";

export function useChallenge() {
  const { data, loading } = useQuery(GET_CHALLENGES);

  return {
    challenges: data?.challenges || [],
    loading
  };
}
