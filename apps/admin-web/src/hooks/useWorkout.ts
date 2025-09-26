
import { useQuery, useMutation } from "@apollo/client";
import { GET_WORKOUTS } from "@graphql/queries/workout.queries";
import { CREATE_WORKOUT } from "@graphql/mutations/workout.mutations";

export function useWorkout() {
  const { data, loading } = useQuery(GET_WORKOUTS);
  const [createWorkout] = useMutation(CREATE_WORKOUT);

  return {
    workouts: data?.workouts || [],
    loading,
    createWorkout: (input) => createWorkout({ variables: { input } })
  };
}
