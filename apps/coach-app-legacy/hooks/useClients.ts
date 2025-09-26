
import { useQuery, useMutation } from "@apollo/client";
import { GET_CLIENTS } from "@graphql/queries/client.queries";
import { ADD_CLIENT } from "@graphql/mutations/client.mutations";

export function useClients() {
  const { data, loading } = useQuery(GET_CLIENTS);
  const [addClient] = useMutation(ADD_CLIENT);

  return {
    clients: data?.coachClients || [],
    loading,
    addClient: (input) => addClient({ variables: { input } })
  };
}
