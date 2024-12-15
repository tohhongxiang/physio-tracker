import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const exercises = sqliteTable("exercises", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull().default(""),
	sets: int().notNull().default(1),
	reps: int().notNull().default(1),
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

export const workouts = sqliteTable("workouts", {
	id: int().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	description: text().notNull().default("")
});

export const workoutsRelations = relations(exercises, ({ one }) => ({
	exercises: one(workouts, {
		fields: [exercises.workoutId],
		references: [workouts.id]
	})
}));

export const exercisesRelations = relations(workouts, ({ many }) => ({
	exercises: many(exercises)
}));
