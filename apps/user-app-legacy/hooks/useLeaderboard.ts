
import { useQuery } from "@apollo/client";
import { GET_LEADERBOARD } from "@graphql/queries/leaderboard.queries";

export function useLeaderboard() {
  const { data, loading } = useQuery(GET_LEADERBOARD);

  return {
    leaderboard: data?.leaderboard || [],
    loading
  };
}
