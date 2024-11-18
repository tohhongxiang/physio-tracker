export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
};
