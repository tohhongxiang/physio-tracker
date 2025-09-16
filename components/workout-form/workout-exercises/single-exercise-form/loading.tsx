import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

export default function LoadingSingleExercise() {
	return (
		<View className="flex flex-col gap-8 px-4 py-8">
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-12 w-full" />
			<Skeleton className="h-32 w-full" />
		</View>
	);
}
