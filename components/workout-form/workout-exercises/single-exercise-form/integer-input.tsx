import { View, ViewProps } from "react-native";
import { Text } from "../../../ui/text";
import { Button } from "../../../ui/button";
import { Plus } from "~/lib/icons/Plus";
import { Minus } from "~/lib/icons/Minus";
import { cn } from "~/lib/utils";

interface IntegerInputProps extends ViewProps {
	value: number;
	onChange: (updatedValue: number) => void;
	isInvalid?: boolean;
	disableDecrement?: boolean;
	disableIncrement?: boolean;
}

export default function IntegerInput({
	value,
	onChange,
	isInvalid,
	disableDecrement,
	disableIncrement,
	...props
}: IntegerInputProps) {
	return (
		<View
			{...props}
			className={cn(
				"flex w-full flex-row items-center justify-center gap-4",
				props.className
			)}
		>
			<Button
				variant="outline"
				className={cn(
					"aspect-square rounded-full",
					isInvalid && "border-destructive"
				)}
				onPress={() => onChange(value - 1)}
				disabled={disableDecrement}
			>
				<Minus
					className={cn(
						"h-4 w-4 text-foreground",
						isInvalid && "text-destructive"
					)}
				/>
			</Button>
			<Text
				className={cn(
					"flex-1 text-center font-medium",
					isInvalid && "border-destructive text-destructive"
				)}
			>
				{value}
			</Text>
			<Button
				variant="outline"
				onPress={() => onChange(value + 1)}
				className={cn(
					"aspect-square rounded-full",
					isInvalid && "border-destructive"
				)}
				disabled={disableIncrement}
			>
				<Plus
					className={cn(
						"text-foreground",
						isInvalid && "text-destructive"
					)}
				/>
			</Button>
		</View>
	);
}
