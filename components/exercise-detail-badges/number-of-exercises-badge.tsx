import { VariantProps } from "class-variance-authority";
import { Dumbbell } from "lucide-react-native";

import { Icon } from "../ui/icon";
import ExerciseDetailBadge, {
	exerciseDetailBadgeTextVariants,
	exerciseDetailBadgeVariants
} from "./exercise-detail-badge";

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
				<Icon
					as={Dumbbell}
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
