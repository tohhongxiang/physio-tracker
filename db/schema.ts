import { relations, sql } from "drizzle-orm";
import {
	int,
	real,
	sqliteTable,
	text,
	uniqueIndex
} from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull().default(""),
	createdAt: text("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const exercises = sqliteTable(
	"exercises",
	{
		id: int().primaryKey({ autoIncrement: true }),
		name: text().notNull(),
		description: text().notNull().default(""),
		sets: int().notNull().default(1),
		reps: int().notNull().default(1),
		weight: real().notNull().default(0),
		weightUnit: text("weight_unit", { enum: ["kg", "lbs", "%BW"] })
			.notNull()
			.default("kg"),
		durationPerRepSeconds: int("duration_per_rep_seconds")
			.notNull()
			.default(0),
		restBetweenRepsSeconds: int("rest_between_reps_seconds")
			.notNull()
			.default(0),
		restBetweenSetsSeconds: int("rest_between_sets_seconds")
			.notNull()
			.default(0),
		workoutId: int("workout_id")
			.references(() => workouts.id, { onDelete: "cascade" })
			.notNull(),
		position: int().notNull().default(0),
		createdAt: text("created_at")
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text("updated_at")
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
			.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
	},
	(table) => ({
		execisesWorkoutPositionUnique: uniqueIndex(
			"exercises_workout_position_unique"
		).on(table.workoutId, table.position)
	})
);

export const workoutLogs = sqliteTable("workout_logs", {
	id: int().primaryKey({ autoIncrement: true }),
	workoutId: int("workout_id")
		.references(() => workouts.id, { onDelete: "cascade" })
		.notNull(),
	completedAt: text("completed_at").notNull(), // Store dates as ISO string e.g. '2025-05-31T16:00:00.000Z'
	createdAt: text("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const pinnedWorkouts = sqliteTable("pinned_workouts", {
	workoutId: int("workout_id")
		.primaryKey()
		.references(() => workouts.id, { onDelete: "cascade" }),
	position: int().notNull().unique(),
	createdAt: text("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const workoutSettings = sqliteTable("workout_settings", {
	id: int().primaryKey().notNull().default(1),
	// Timer Settings
	readyUpDurationSeconds: int("ready_up_duration_seconds")
		.notNull()
		.default(10),
	countdownWarningSeconds: int("countdown_warning_seconds")
		.notNull()
		.default(3),
	// Sound Settings
	soundsMutedByDefault: int("sounds_muted_by_default", { mode: "boolean" })
		.notNull()
		.default(false),
	// Haptic Settings
	hapticOnTimerStart: int("haptic_on_timer_start", { mode: "boolean" })
		.notNull()
		.default(false),
	hapticOnWarning: int("haptic_on_warning", { mode: "boolean" })
		.notNull()
		.default(true),
	hapticOnComplete: int("haptic_on_complete", { mode: "boolean" })
		.notNull()
		.default(true),
	createdAt: text("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
});

export const workoutsRelations = relations(workouts, ({ many }) => ({
	exercises: many(exercises),
	workoutLogs: many(workoutLogs)
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
	workout: one(workouts, {
		fields: [exercises.workoutId],
		references: [workouts.id]
	})
}));

export const workoutLogsRelations = relations(workoutLogs, ({ one }) => ({
	workout: one(workouts, {
		fields: [workoutLogs.workoutId],
		references: [workouts.id]
	})
}));

export const pinnedWorkoutsRelations = relations(pinnedWorkouts, ({ one }) => ({
	workout: one(workouts, {
		fields: [pinnedWorkouts.workoutId],
		references: [workouts.id]
	})
}));
