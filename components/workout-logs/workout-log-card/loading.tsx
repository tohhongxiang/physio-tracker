import { View } from "react-native";

import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
	return (
		<View className="flex flex-col gap-2 px-4 py-2">
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
		</View>
	);
}
