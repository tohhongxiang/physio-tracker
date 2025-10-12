import { eq } from "drizzle-orm";
import { prettifyError } from "zod";

import {
	UpdateWorkoutSettings,
	UpdateWorkoutSettingsSchema,
	WorkoutSettings,
	WorkoutSettingsSchema
} from "~/db/dto";
import { db } from "~/db/initalize";
import { workoutSettings } from "~/db/schema";

/**
 * Updates workout settings. Creates default settings if none exist (upsert).
 * Settings table is a singleton - only one row with id=1.
 */
export default async function updateWorkoutSettings(
	updates: UpdateWorkoutSettings
): Promise<WorkoutSettings> {
	// Validate updates
	const { data: validatedUpdates, error: validationError } =
		UpdateWorkoutSettingsSchema.safeParse(updates);
	if (validationError) {
		throw new Error(prettifyError(validationError));
	}

	// Try to update existing row
	const updated = await db
		.update(workoutSettings)
		.set(validatedUpdates)
		.where(eq(workoutSettings.id, 1))
		.returning();

	// If no row was updated (none existed), create one with the updates
	if (updated.length === 0) {
		const [created] = await db
			.insert(workoutSettings)
			.values({
				id: 1,
				...validatedUpdates // Apply updates on top of defaults
			})
			.returning();

		const { data, error } = WorkoutSettingsSchema.safeParse(created);
		if (error) {
			throw new Error(prettifyError(error));
		}
		return data;
	}

	// Validate and return updated settings
	const { data, error } = WorkoutSettingsSchema.safeParse(updated[0]);
	if (error) {
		throw new Error(prettifyError(error));
	}

	return data;
}
