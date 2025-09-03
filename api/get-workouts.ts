import { count } from "drizzle-orm";
import { db } from "~/db/initalize";
import { workouts } from "~/db/schema";
import { DEFAULT_LIMIT } from "~/hooks/use-workout-filter-params";
import { Workout, WorkoutFilters } from "~/types";

export default async function getWorkouts(
	filters: WorkoutFilters & { page?: number } = {
		search: "",
		sortBy: "",
		limit: DEFAULT_LIMIT,
		page: 0
	}
) {
	const result: Workout[] = await db.query.workouts.findMany({
		where: (workouts, { like }) =>
			filters.search
				? like(workouts.name, `%${filters.search}%`)
				: undefined,
		with: {
			exercises: {
				orderBy: (exercises, { asc }) => [
					asc(exercises.position),
					asc(exercises.id)
				]
			}
		},
		offset: (filters.page ?? 0) * filters.limit,
		orderBy: (workouts, { desc, asc }) =>
			filters.sortBy === "name" ? asc(workouts.name) : desc(workouts.id),
		limit: filters.limit
	});

	const { count: workoutCount } = (
		await db.select({ count: count() }).from(workouts)
	)[0];

	return { count: workoutCount, data: result };
}
