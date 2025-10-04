import { count, like } from "drizzle-orm";

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
		orderBy: (workouts, { desc, asc }) => {
			if (filters.sortBy === "") {
				return desc(workouts.id);
			}

			const sortColumn = filters.sortBy.includes("name")
				? workouts.name
				: workouts.id;
			const sortDirection = filters.sortBy.includes("desc") ? desc : asc;
			return sortDirection(sortColumn);
		},
		limit: filters.limit
	});

	const { count: workoutCount } = (
		await db
			.select({
				count: count()
			})
			.from(workouts)
			.where(
				filters.search
					? like(workouts.name, `%${filters.search}%`)
					: undefined
			)
	)[0];

	return { count: workoutCount, data: result };
}
