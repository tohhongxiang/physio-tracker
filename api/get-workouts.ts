import { db } from "~/db/initalize";
import { Workout, WorkoutFilters } from "~/types";

export default async function getWorkouts(filters: WorkoutFilters = {}) {
	const result = await db.query.workouts.findMany({
		where: (workouts, { like }) =>
			filters.search
				? like(workouts.name, `%${filters.search}%`)
				: undefined,
		with: { exercises: true },
		orderBy: (workouts, { desc, asc }) =>
			filters.sortBy === "name" ? asc(workouts.name) : desc(workouts.id)
	});

	return result as Workout[];
}
