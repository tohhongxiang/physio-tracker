import { Workout, WorkoutFilters } from "~/types";

const workoutQueryKeys = {
	all: ["workouts"] as const,
	list: (filters: WorkoutFilters & { page: number }) =>
		[...workoutQueryKeys.all, filters] as const,
	detail: (id: Workout["id"]) => [...workoutQueryKeys.all, id] as const,
	today: () => [...workoutQueryKeys.all, "today"] as const
};

const workoutLogQueryKeys = {
	all: ["workout-logs"] as const,
	month: (year: number, month: number, withWorkoutData = false) =>
		[...workoutLogQueryKeys.all, year, month, withWorkoutData] as const
};

export { workoutQueryKeys, workoutLogQueryKeys };
