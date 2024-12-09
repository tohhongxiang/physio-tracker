import { cva, VariantProps } from "class-variance-authority";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const exerciseCardBadgeVariants = cva(
	"flex flex-row items-center rounded-md px-2 text-center",
	{
		variants: {
			variant: {
				primary: "bg-primary",
				secondary: "bg-secondary"
			}
		},
		defaultVariants: {
			variant: "primary"
		}
	}
);

const exerciseCardBadgeTextVariants = cva("text-lg", {
	variants: {
		variant: {
			primary: "text-primary-foreground",
			secondary: "text-secondary-foreground"
		}
	},
	defaultVariants: {
		variant: "primary"
	}
});

type ExerciseCardBadgeProps = {
	boldedText: string;
	text: string;
} & VariantProps<typeof exerciseCardBadgeVariants>;

export default function ExerciseCardBadge({
	boldedText,
	text,
	variant
}: ExerciseCardBadgeProps) {
	return (
		<View className={exerciseCardBadgeVariants({ variant })}>
			<Text
				className={cn(
					"font-semibold",
					exerciseCardBadgeTextVariants({ variant })
				)}
			>
				{boldedText}
			</Text>
			<Text
				className={cn(
					"text-secondary-foreground",
					exerciseCardBadgeTextVariants({ variant })
				)}
			>
				{" "}
				{text}
			</Text>
		</View>
	);
}
