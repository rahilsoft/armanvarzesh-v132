
import { useQuery, useMutation } from "@apollo/client";
import { GET_COACHES } from "@graphql/queries/coach.queries";
import { CREATE_COACH } from "@graphql/mutations/coach.mutations";

export function useCoach() {
  const { data, loading } = useQuery(GET_COACHES);
  const [createCoach] = useMutation(CREATE_COACH);

  return {
    coaches: data?.coaches || [],
    loading,
    createCoach: (input) => createCoach({ variables: { input } })
  };
}
