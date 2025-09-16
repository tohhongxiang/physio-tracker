import { ElementRef, forwardRef, memo } from "react";
import { View, ViewProps } from "react-native";

import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface CounterDisplayProps extends ViewProps {
	title: string;
	text: string;
}

export default memo(
	forwardRef<ElementRef<typeof View>, CounterDisplayProps>(
		function CounterDisplay({ title, text, className, ...props }, ref) {
			return (
				<View
					{...props}
					className={cn(
						"flex flex-col items-center justify-center rounded-md bg-secondary px-8 py-4",
						className
					)}
					ref={ref}
				>
					<Text className="text-muted-foreground">{title}</Text>
					<Text className="text-2xl font-semibold">{text}</Text>
				</View>
			);
		}
	)
);
