import { workouts } from "~/data/workouts";

export default async function getWorkouts() {
  await new Promise((resolve) => setTimeout(() => resolve(1), 1000));
  return workouts.sort(() => Math.random() - 0.5);
}
