import { create } from 'zustand';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // Can be "10" or "8-12" or "AMRAP"
  weight?: number;
  restSeconds: number;
  notes?: string;
  videoUrl?: string;
  completed: boolean;
  completedSets: number;
}

export interface Workout {
  id: string;
  date: string;
  title: string;
  description?: string;
  exercises: Exercise[];
  duration?: number; // in minutes
  completed: boolean;
  completedAt?: string;
}

export interface WorkoutWeek {
  weekNumber: number;
  workouts: Workout[];
}

interface WorkoutState {
  currentWorkout: Workout | null;
  workouts: Workout[];
  weeks: WorkoutWeek[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentWorkout: (workout: Workout) => void;
  startWorkout: (workoutId: string) => void;
  completeExerciseSet: (exerciseId: string) => void;
  undoExerciseSet: (exerciseId: string) => void;
  completeWorkout: () => void;
  fetchWorkouts: () => Promise<void>;
  fetchWeekPlan: (weekNumber: number) => Promise<void>;
  updateExerciseWeight: (exerciseId: string, weight: number) => void;
  clearError: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentWorkout: null,
  workouts: [],
  weeks: [],
  isLoading: false,
  error: null,

  setCurrentWorkout: (workout) => {
    set({ currentWorkout: workout });
  },

  startWorkout: (workoutId) => {
    const { workouts } = get();
    const workout = workouts.find((w) => w.id === workoutId);

    if (workout) {
      // Reset completion status
      const resetWorkout = {
        ...workout,
        exercises: workout.exercises.map((ex) => ({
          ...ex,
          completed: false,
          completedSets: 0,
        })),
        completed: false,
      };

      set({ currentWorkout: resetWorkout });
    }
  },

  completeExerciseSet: (exerciseId) => {
    const { currentWorkout } = get();

    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        const newCompletedSets = exercise.completedSets + 1;
        const completed = newCompletedSets >= exercise.sets;

        return {
          ...exercise,
          completedSets: newCompletedSets,
          completed,
        };
      }
      return exercise;
    });

    set({
      currentWorkout: {
        ...currentWorkout,
        exercises: updatedExercises,
      },
    });
  },

  undoExerciseSet: (exerciseId) => {
    const { currentWorkout } = get();

    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map((exercise) => {
      if (exercise.id === exerciseId && exercise.completedSets > 0) {
        const newCompletedSets = exercise.completedSets - 1;

        return {
          ...exercise,
          completedSets: newCompletedSets,
          completed: false,
        };
      }
      return exercise;
    });

    set({
      currentWorkout: {
        ...currentWorkout,
        exercises: updatedExercises,
      },
    });
  },

  completeWorkout: () => {
    const { currentWorkout, workouts } = get();

    if (!currentWorkout) return;

    const completedWorkout = {
      ...currentWorkout,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    // Update in workouts list
    const updatedWorkouts = workouts.map((w) =>
      w.id === completedWorkout.id ? completedWorkout : w
    );

    set({
      currentWorkout: null,
      workouts: updatedWorkouts,
    });

    // TODO: Send to backend
  },

  fetchWorkouts: async () => {
    try {
      set({ isLoading: true, error: null });

      // TODO: Fetch from GraphQL API
      // const response = await apolloClient.query({ query: GET_WORKOUTS });

      // Mock data for now
      const mockWorkouts: Workout[] = [
        {
          id: '1',
          date: new Date().toISOString(),
          title: 'تمرین سینه و سه‌سر',
          exercises: [
            {
              id: 'e1',
              name: 'پرس سینه با هالتر',
              sets: 4,
              reps: '8-10',
              weight: 60,
              restSeconds: 90,
              completed: false,
              completedSets: 0,
            },
            {
              id: 'e2',
              name: 'پرس سینه شیب دار',
              sets: 3,
              reps: '10-12',
              weight: 40,
              restSeconds: 60,
              completed: false,
              completedSets: 0,
            },
          ],
          completed: false,
        },
      ];

      set({ workouts: mockWorkouts, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchWeekPlan: async (weekNumber) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: Fetch from GraphQL API

      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateExerciseWeight: (exerciseId, weight) => {
    const { currentWorkout } = get();

    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map((exercise) =>
      exercise.id === exerciseId ? { ...exercise, weight } : exercise
    );

    set({
      currentWorkout: {
        ...currentWorkout,
        exercises: updatedExercises,
      },
    });
  },

  clearError: () => set({ error: null }),
}));
