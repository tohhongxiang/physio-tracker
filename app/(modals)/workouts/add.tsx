import WorkoutForm from "~/components/workout-form";
import useCreateWorkout from "~/hooks/api/use-create-workout";

export default function AddWorkoutModal() {
	const { createWorkout } = useCreateWorkout();

	return <WorkoutForm onSubmit={createWorkout} />;
}
