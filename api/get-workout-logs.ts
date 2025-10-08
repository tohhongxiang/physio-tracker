import { prettifyError } from "zod";

import { WorkoutLogWithWorkout, WorkoutLogWithWorkoutSchema } from "~/db/dto";
import { db } from "~/db/initalize";

export default async function getWorkoutLogs(): Promise<
	WorkoutLogWithWorkout[]
> {
	const result = await db.query.workoutLogs.findMany({
		with: {
			workout: {
				with: {
					exercises: true
				}
			}
		},
		orderBy: (workoutLogs, { desc }) => [desc(workoutLogs.completedAt)]
	});

	return result.map((log) => {
		const { data, error } = WorkoutLogWithWorkoutSchema.safeParse(log);
		if (error) {
			throw new Error(prettifyError(error));
		}

		return data;
	});
}
