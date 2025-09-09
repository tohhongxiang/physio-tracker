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
				accent: "bg-accent",
				ghost: ""
			},
			size: {
				small: "h-4",
				medium: "h-6",
				large: "h-8"
			}
		},
		defaultVariants: {
			variant: "primary",
			size: "medium"
		}
	}
);

export const exerciseDetailBadgeTextVariants = cva("", {
	variants: {
		variant: {
			primary: "text-primary-foreground",
			secondary: "text-secondary-foreground",
			accent: "text-accent-foreground",
			ghost: "text-foreground"
		},
		size: {
			small: "text-xs",
			medium: "text-md",
			large: "text-lg"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "medium"
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
	variant,
	size
}: ExerciseDetailBadgeProps) {
	return (
		<View
			className={cn(
				exerciseDetailBadgeVariants({ variant, size }),
				className
			)}
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
							exerciseDetailBadgeTextVariants({ variant, size })
						)}
					>
						{boldedText}
					</Text>
					<Text
						className={cn(
							"text-secondary-foreground",
							exerciseDetailBadgeTextVariants({ variant, size })
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
