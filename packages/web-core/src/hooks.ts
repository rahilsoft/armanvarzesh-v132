import { gql, useQuery, useMutation } from '@apollo/client';

export const Q_WORKOUTS = gql`query Workouts{ workouts{ id name } }`;
export const M_CREATE_WORKOUT = gql`mutation CreateWorkout($input:WorkoutInput!){ createWorkout(input:$input){ id name } }`;
// NOTE: Map these to your exact backend schema.

export function useWorkouts(){
  const q = useQuery(Q_WORKOUTS);
  return q;
}
