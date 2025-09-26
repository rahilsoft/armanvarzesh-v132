
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_USER } from "@graphql/queries/user.queries";
import { CREATE_USER, UPDATE_USER, DELETE_USER } from "@graphql/mutations/user.mutations";

export function useUser() {
  const { data, loading } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  return {
    users: data?.users || [],
    loading,
    createUser: (input) => createUser({ variables: { input } }),
    updateUser: (id, input) => updateUser({ variables: { id, input } }),
    deleteUser: (id) => deleteUser({ variables: { id } })
  };
}
