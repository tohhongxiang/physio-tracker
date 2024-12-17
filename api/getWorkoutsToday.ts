import { workouts } from "~/data/workouts";

export default async function getWorkoutsToday() {
	await new Promise((resolve) => setTimeout(() => resolve(1), 1000));

	return [workouts[0]];
}
