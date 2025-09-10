import { VariantProps } from "class-variance-authority";
import ExerciseDetailBadge, {
	exerciseDetailBadgeTextVariants,
	exerciseDetailBadgeVariants
} from "./exercise-detail-badge";
import { Dumbbell } from "~/lib/icons/Dumbbell";

export default function NumberOfExercisesBadge({
	number,
	variant,
	size,
	className
}: { number: number; className?: string } & VariantProps<
	typeof exerciseDetailBadgeVariants
>) {
	const iconSize = size === "small" ? 12 : 16;
	return (
		<ExerciseDetailBadge
			leftIcon={
				<Dumbbell
					className={exerciseDetailBadgeTextVariants({
						variant,
						size
					})}
					size={iconSize}
				/>
			}
			variant={variant}
			size={size}
			boldedText={number.toString()}
			text={number === 1 ? "exercise" : "exercises"}
			className={className}
		/>
	);
}
