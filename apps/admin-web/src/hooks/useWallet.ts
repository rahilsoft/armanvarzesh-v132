
import { useQuery, useMutation } from "@apollo/client";
import { GET_WALLETS } from "@graphql/queries/wallet.queries";
import { UPDATE_WALLET } from "@graphql/mutations/wallet.mutations";

export function useWallet() {
  const { data, loading } = useQuery(GET_WALLETS);
  const [updateWallet] = useMutation(UPDATE_WALLET);

  return {
    wallets: data?.wallets || [],
    loading,
    updateWallet: (id, input) => updateWallet({ variables: { id, input } })
  };
}
