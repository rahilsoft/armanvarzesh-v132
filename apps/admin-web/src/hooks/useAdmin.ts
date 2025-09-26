
import { useQuery, useMutation } from "@apollo/client";
import { GET_ADMINS } from "@graphql/queries/admin.queries";
import { CREATE_ADMIN } from "@graphql/mutations/admin.mutations";

export function useAdmin() {
  const { data, loading } = useQuery(GET_ADMINS);
  const [createAdmin] = useMutation(CREATE_ADMIN);

  return {
    admins: data?.admins || [],
    loading,
    createAdmin: (input) => createAdmin({ variables: { input } })
  };
}
