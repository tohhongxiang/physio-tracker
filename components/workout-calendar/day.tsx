import { View } from "react-native";

import { Text } from "~/components/ui/text";
import { CircleCheckBig } from "~/lib/icons/CircleCheckBig";
import { cn } from "~/lib/utils";

interface DayProps {
	date: Date;
	isToday: boolean;
	isInDisplayedMonth: boolean;
	isMarked: boolean;
}

export default function Day({
	date,
	isToday,
	isInDisplayedMonth,
	isMarked
}: DayProps) {
	return (
		<View
			className={cn(
				"flex h-16 w-16 flex-1 items-center justify-center rounded-full",
				isToday && isInDisplayedMonth
					? isMarked
						? "bg-secondary"
						: "bg-primary"
					: ""
			)}
		>
			{isInDisplayedMonth ? (
				<View className="flex flex-col items-center justify-center">
					{isMarked ? (
						<CircleCheckBig className="text-green-500" />
					) : (
						<Text
							className={cn(
								"text-center text-lg font-bold",
								!isInDisplayedMonth &&
									"text-muted-foreground opacity-50",
								isToday && "text-primary-foreground"
							)}
						>
							{date.getDate()}
						</Text>
					)}
				</View>
			) : (
				<View />
			)}
		</View>
	);
}
