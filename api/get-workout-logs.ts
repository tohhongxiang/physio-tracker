import { db } from "~/db/initalize";

export default async function getWorkoutLogs() {
	const result = await db.query.workoutLogs.findMany({
		columns: { workoutId: false },
		with: {
			workout: {
				with: {
					exercises: true
				}
			}
		},
		orderBy: (workoutLogs, { desc }) => [desc(workoutLogs.completedAt)]
	});

	return result.map((log) => ({
		...log,
		completedAt: new Date(log.completedAt)
	}));
}
