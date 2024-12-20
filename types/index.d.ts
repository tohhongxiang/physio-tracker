export type Workout = {
	id: number;
	name: string;
	description: string;
	exercises: Exercise[];
};

export type Exercise = {
	id: number;
	name: string;
	description: string;
	sets: number;
	reps: number;
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
