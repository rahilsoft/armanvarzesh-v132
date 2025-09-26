import { useState, useEffect } from 'react';
import apiClient from '../utils/api';

export function useWorkout(userId: string) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/users/${userId}/workouts`)
      .then(response => setWorkouts(response.data))
      .catch(() => setWorkouts([]))
      .finally(() => setLoading(false));
  }, [userId]);

  return { workouts, loading };
}