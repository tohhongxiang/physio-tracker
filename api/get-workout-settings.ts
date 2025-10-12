import { prettifyError } from "zod";

import { WorkoutSettings, WorkoutSettingsSchema } from "~/db/dto";
import { db } from "~/db/initalize";
import { workoutSettings } from "~/db/schema";

/**
 * Gets workout settings. Creates default settings if none exist.
 * Settings table is a singleton - only one row with id=1.
 */
export default async function getWorkoutSettings(): Promise<WorkoutSettings> {
	// Try to get existing settings
	let settings = await db.query.workoutSettings.findFirst();

	// If no settings exist, create default row (first-time setup)
	if (!settings) {
		const [created] = await db
			.insert(workoutSettings)
			.values({ id: 1 }) // All other fields use schema defaults
			.returning();
		settings = created;
	}

	// Validate with schema
	const { data, error } = WorkoutSettingsSchema.safeParse(settings);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
