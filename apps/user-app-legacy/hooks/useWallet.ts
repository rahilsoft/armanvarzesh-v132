
import { useQuery } from "@apollo/client";
import { GET_WALLET } from "@graphql/queries/wallet.queries";

export function useWallet(userId: number) {
  const { data, loading } = useQuery(GET_WALLET, { variables: { userId } });
  return {
    wallet: data?.wallet,
    loading
  };
}
