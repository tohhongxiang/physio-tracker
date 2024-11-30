import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingWorkoutPage() {
	return (
		<View className="flex-1 p-4">
			<Skeleton className="h-8 w-full" />
			<View className="flex flex-1 flex-col gap-8">
				<View className="flex grow items-center justify-center gap-8">
					<Skeleton className="mx-auto h-64 w-64 rounded-full" />
					<Skeleton className="h-8 w-full" />
					<View className="flex w-full flex-row justify-around py-4">
						<Skeleton className="h-8 w-full" />
						<Skeleton className="h-8 w-full" />
					</View>
				</View>
				<Skeleton className="h-8 w-full" />
			</View>
		</View>
	);
}
