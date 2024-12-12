export type Workout = {
	id: string;
	name: string;
	description: string;
	exercises: Exercise[];
};

export type Exercise = {
	id: string;
	name: string;
	description: string;
	sets: number;
	repsPerSet: number;
	durationPerRepSeconds: number;
	restBetweenRepsSeconds: number;
	restBetweenSetsSeconds: number;
};

export type CreateExercise = Omit<Exercise, "id">;
export type CreateWorkout = Prettify<
	Omit<Workout, "id" | "exercises"> & { exercises: CreateExercise[] }
>;
