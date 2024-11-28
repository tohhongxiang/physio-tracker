export type Workout = {
	id: string;
	name: string;
	description: string;
	exercises: Exercise[];
};

type BaseExercise = {
	id: string;
	name: string;
	description: string;
	sets: number;
	repsPerSet: number;
};

type DurationExercise = {
	durationPerRepSeconds: number;
	restBetweenRepsSeconds: number;
	restBetweenSetsSeconds?: number;
} & BaseExercise;

type RepsExercise = {
	durationPerRepSeconds?: number;
	restBetweenRepsSeconds?: number;
	restBetweenSetsSeconds: number;
} & BaseExercise;

export type Exercise =
	| DurationExercise
	| RepsExercise
	| (DurationExercise & RepsExercise);
