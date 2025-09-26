
import { useQuery, useMutation } from "@apollo/client";
import { GET_WORKOUTS_FOR_APPROVAL } from "@graphql/queries/workout.queries";
import { APPROVE_WORKOUT } from "@graphql/mutations/workout.mutations";

export function useWorkout() {
  const { data, loading } = useQuery(GET_WORKOUTS_FOR_APPROVAL);
  const [approveWorkout] = useMutation(APPROVE_WORKOUT);

  return {
    workouts: data?.workoutsForApproval || [],
    loading,
    approveWorkout: (id) => approveWorkout({ variables: { id } })
  };
}
