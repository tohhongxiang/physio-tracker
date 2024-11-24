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
} & BaseExercise;

type WeightedExercise = {
	weightKg: number;
} & BaseExercise;

export type Exercise = BaseExercise | DurationExercise | WeightedExercise;
