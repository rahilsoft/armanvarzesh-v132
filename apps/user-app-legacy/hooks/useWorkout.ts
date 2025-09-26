
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_WORKOUTS } from "@graphql/queries/workout.queries";
import { CREATE_WORKOUT } from "@graphql/mutations/workout.mutations";

export function useWorkout(userId: number) {
  const { data, loading } = useQuery(GET_WORKOUTS, { variables: { userId } });
  const [createWorkout] = useMutation(CREATE_WORKOUT);

  return {
    workouts: data?.userWorkouts || [],
    loading,
    createWorkout: (input) => createWorkout({ variables: { userId, input } })
  };
}
