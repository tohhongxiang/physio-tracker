import { InferSelectModel } from "drizzle-orm";

import { pinnedWorkouts, workoutLogs } from "~/db/schema";

export type Workout = {
	id: number;
	name: string;
	description: string;
	exercises: Exercise[];
};

export type WorkoutFilters = {
	search: string;
	sortBy: "name" | "dateCreated" | "";
	limit: number;
};

export type Exercise = {
	id: number;
	name: string;
	description: string;
	sets: number;
	reps: number;
	weight: number;
	weightUnit: "kg" | "lbs" | "%BW";
	durationPerRepSeconds: number;
	restBetweenRepsSeconds: number;
	restBetweenSetsSeconds: number;
};

export type CreateExercise = Omit<Exercise, "id">;
export type CreateWorkout = Prettify<
	Omit<Workout, "id" | "exercises"> & { exercises: CreateExercise[] }
>;

export type WorkoutLog = {
	id: number;
	completedAt: Date;
	workout: Workout;
};

export type ExportDataOptions = {
	workouts: boolean;
	logs: boolean;
	pinned: boolean;
};

export type ExportData = {
	timestamp: string;
	device: {
		platform: "ios" | "android" | "windows" | "macos" | "web";
		version: string;
	};
	data: {
		workouts: Workout[];
		logs: InferSelectModel<typeof workoutLogs>[];
		pinned: InferSelectModel<typeof pinnedWorkouts>[];
	};
};
