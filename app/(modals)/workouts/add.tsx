import WorkoutForm from "~/components/workout-form";
import { CreateWorkout } from "~/types";

export default function AddWorkoutModal() {
	function handleCreateWorkout(workout: CreateWorkout) {
		console.log(workout);
	}

	return <WorkoutForm onSubmit={handleCreateWorkout} />;
}
