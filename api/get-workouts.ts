import { count, like } from "drizzle-orm";
import { prettifyError } from "zod";

import {
	WorkoutFilters,
	WorkoutFiltersSchema,
	WorkoutWithExercisesSchema
} from "~/db/dto";
import { db } from "~/db/initalize";
import { workouts } from "~/db/schema";
import { DEFAULT_LIMIT } from "~/hooks/use-workout-filter-params";

export default async function getWorkouts(
	filters: WorkoutFilters & { page?: number } = {
		search: "",
		sortBy: "",
		offset: 0,
		limit: DEFAULT_LIMIT,
		page: 0
	}
) {
	// Option 1: Validate input filters using DTO
	const { data: validatedFilters, error: filtersError } =
		WorkoutFiltersSchema.safeParse({
			search: filters.search,
			sortBy: filters.sortBy,
			limit: filters.limit,
			offset: (filters.page ?? 0) * filters.limit
		});

	if (filtersError) {
		throw new Error(prettifyError(filtersError));
	}

	const result = await db.query.workouts.findMany({
		where: (workouts, { like }) =>
			validatedFilters.search
				? like(workouts.name, `%${validatedFilters.search}%`)
				: undefined,
		with: {
			exercises: {
				orderBy: (exercises, { asc }) => [
					asc(exercises.position),
					asc(exercises.id)
				]
			}
		},
		offset: validatedFilters.offset,
		orderBy: (workouts, { desc, asc }) => {
			if (!validatedFilters.sortBy) {
				return desc(workouts.id);
			}

			const sortColumn = validatedFilters.sortBy.includes("name")
				? workouts.name
				: workouts.id;
			const sortDirection = validatedFilters.sortBy.includes("desc")
				? desc
				: asc;
			return sortDirection(sortColumn);
		},
		limit: validatedFilters.limit
	});

	const { count: workoutCount } = (
		await db
			.select({
				count: count()
			})
			.from(workouts)
			.where(
				validatedFilters.search
					? like(workouts.name, `%${validatedFilters.search}%`)
					: undefined
			)
	)[0];

	// Transform string dates to Date objects using DTO
	const transformedResult = result.map((workout) => {
		const { data, error } = WorkoutWithExercisesSchema.safeParse(workout);
		if (error) {
			throw new Error(prettifyError(error));
		}
		return data;
	});

	return { count: workoutCount, data: transformedResult };
}
