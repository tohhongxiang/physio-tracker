import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const workouts = sqliteTable("workouts", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull().default("")
});

export const exercises = sqliteTable("exercises", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull().default(""),
	sets: int().notNull().default(1),
	reps: int().notNull().default(1),
	weight: real().notNull().default(0),
	weightUnit: text("weight_unit", { enum: ["kg", "lbs", "%BW"] })
		.notNull()
		.default("kg"),
	durationPerRepSeconds: int("duration_per_rep_seconds").notNull().default(0),
	restBetweenRepsSeconds: int("rest_between_reps_seconds")
		.notNull()
		.default(0),
	restBetweenSetsSeconds: int("rest_between_sets_seconds")
		.notNull()
		.default(0),
	workoutId: int("workout_id")
		.references(() => workouts.id, { onDelete: "cascade" })
		.notNull()
});

export const workoutLogs = sqliteTable("workout_logs", {
	id: int().primaryKey({ autoIncrement: true }),
	workoutId: int("workout_id")
		.references(() => workouts.id, { onDelete: "cascade" })
		.notNull(),
	completedAt: text("completed_at").notNull() // Store dates as ISO string e.g. '2025-05-31T16:00:00.000Z'
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

// TODO: Index for workout logs on (userId, completedAt)
