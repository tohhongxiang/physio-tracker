import { workouts } from "~/data/workouts";

export default async function getWorkout(id: string) {
  await new Promise((resolve) => setTimeout(() => resolve(1), 2000));
  const workout = workouts.find((workout) => workout.id === id);

  if (!workout) {
    return null;
  }

  return workout;
}
