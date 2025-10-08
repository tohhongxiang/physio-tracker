import { Exercise, ExportDataOptions, Workout, WorkoutFilters } from "~/db/dto";

export const workoutQueryKeys = {
	all: ["workouts"] as const,
	list: (filters: WorkoutFilters & { page: number }) =>
		[...workoutQueryKeys.all, filters] as const,
	detail: (id: Workout["id"]) => [...workoutQueryKeys.all, id] as const,
	exercises: {
		all: (workoutId: Workout["id"]) =>
			[...workoutQueryKeys.detail(workoutId), "exercises"] as const,
		detail: (workoutId: Workout["id"], exerciseId: Exercise["id"]) =>
			[...workoutQueryKeys.exercises.all(workoutId), exerciseId] as const
	},
	today: () => [...workoutQueryKeys.all, "today"] as const,
	pinned: {
		all: () => [...workoutQueryKeys.all, "pinned"] as const,
		detail: (workoutId: Workout["id"]) =>
			[...workoutQueryKeys.pinned.all(), workoutId] as const
	}
};

export const workoutLogQueryKeys = {
	all: ["workout-logs"] as const,
	month: (year: number, month: number, withWorkoutData = false) =>
		[...workoutLogQueryKeys.all, year, month, withWorkoutData] as const
};

export const exportDataQueryKeys = {
	all: ["export-data"] as const,
	filtered: (filters: ExportDataOptions) =>
		[...exportDataQueryKeys.all, filters] as const
};
