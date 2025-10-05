import { deleteDatabaseAsync } from "expo-sqlite";
import { View } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { DATABASE_NAME, db } from "~/db/initalize";

export default function TestPage() {
	const handleResetDb = async () => {
		try {
			await db.$client.closeAsync();
			await deleteDatabaseAsync(DATABASE_NAME);
			toast.success("DB reset successfully");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<View className="flex flex-col gap-2 p-8">
			<Button>
				<Text onPress={handleResetDb}>Reset DB</Text>
			</Button>
		</View>
	);
}
