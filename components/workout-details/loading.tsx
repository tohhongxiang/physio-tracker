import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";

export default function LoadingWorkoutDetails() {
	return (
		<View className="flex gap-8 p-4">
			<View className="flex flex-col gap-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
			</View>
			<Text className="text-2xl font-bold">Exercises</Text>
			<View className="flex flex-col gap-8">
				<View className="flex flex-col gap-2">
					<Skeleton className="mb-2 h-6 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</View>
				<View className="flex flex-col gap-2">
					<Skeleton className="mb-2 h-6 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</View>
				<View className="flex flex-col gap-2">
					<Skeleton className="mb-2 h-6 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</View>
			</View>
		</View>
	);
}
