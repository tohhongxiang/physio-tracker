import { deleteDatabaseAsync } from "expo-sqlite";
import { View } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function TestPage() {
	const handleResetDb = async () => {
		await deleteDatabaseAsync("db.db");
		toast.success("DB reset successfully");
	};

	return (
		<View className="flex flex-col gap-2 p-8">
			<Button>
				<Text onPress={handleResetDb}>Reset DB</Text>
			</Button>
		</View>
	);
}
