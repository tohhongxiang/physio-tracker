import { VariantProps } from "class-variance-authority";
import ExerciseDetailBadge, {
	exerciseDetailBadgeTextVariants,
	exerciseDetailBadgeVariants
} from "./exercise-detail-badge";
import { Dumbbell } from "~/lib/icons/Dumbbell";

export default function NumberOfExercisesBadge({
	number,
	variant,
	className
}: { number: number; className?: string } & VariantProps<
	typeof exerciseDetailBadgeVariants
>) {
	return (
		<ExerciseDetailBadge
			leftIcon={
				<Dumbbell
					className={exerciseDetailBadgeTextVariants({ variant })}
					size={16}
				/>
			}
			variant={variant}
			boldedText={number.toString()}
			text={number === 1 ? "exercise" : "exercises"}
			className={className}
		/>
	);
}
