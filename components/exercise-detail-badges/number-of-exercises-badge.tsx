import { VariantProps } from "class-variance-authority";
import ExerciseDetailBadge, {
	exerciseDetailBadgeVariants
} from "./exercise-detail-badge";

export default function NumberOfExercisesBadge({
	number,
	variant,
	className
}: { number: number; className?: string } & VariantProps<
	typeof exerciseDetailBadgeVariants
>) {
	return (
		<ExerciseDetailBadge
			variant={variant}
			boldedText={number.toString()}
			text={number === 1 ? "exercise" : "exercises"}
			className={className}
		/>
	);
}
