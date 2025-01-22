import { cva, VariantProps } from "class-variance-authority";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export const exerciseDetailBadgeVariants = cva(
	"flex flex-row items-center rounded-md px-2 text-center",
	{
		variants: {
			variant: {
				primary: "bg-primary",
				secondary: "bg-secondary",
				ghost: ""
			}
		},
		defaultVariants: {
			variant: "primary"
		}
	}
);

export const exerciseDetailBadgeTextVariants = cva("text-lg", {
	variants: {
		variant: {
			primary: "text-primary-foreground",
			secondary: "text-secondary-foreground",
			ghost: "text-foreground"
		}
	},
	defaultVariants: {
		variant: "primary"
	}
});

type ExerciseDetailBadgeProps = Prettify<
	(
		| {
				boldedText: string;
				text: string;
				children?: never;
		  }
		| { children: React.ReactNode; boldedText?: never; text?: never }
	) & {
		leftIcon?: React.ReactNode;
		className?: string;
	} & VariantProps<typeof exerciseDetailBadgeVariants>
>;

export default function ExerciseDetailBadge({
	boldedText,
	text,
	children,
	leftIcon,
	className,
	variant
}: ExerciseDetailBadgeProps) {
	return (
		<View
			className={cn(exerciseDetailBadgeVariants({ variant }), className)}
		>
			{leftIcon}
			{leftIcon ? <View className="ml-2" /> : null}
			{children ? (
				children
			) : (
				<>
					<Text
						className={cn(
							"font-semibold",
							exerciseDetailBadgeTextVariants({ variant })
						)}
					>
						{boldedText}
					</Text>
					<Text
						className={cn(
							"text-secondary-foreground",
							exerciseDetailBadgeTextVariants({ variant })
						)}
					>
						{" "}
						{text}
					</Text>
				</>
			)}
		</View>
	);
}
