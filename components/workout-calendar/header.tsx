import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";

export default function Header({
	title,
	onGoToNextMonth,
	onGoToPreviousMonth
}: {
	title: string;
	onGoToNextMonth: () => void;
	onGoToPreviousMonth: () => void;
}) {
	return (
		<View className="relative flex flex-row items-center justify-between">
			<Button variant="ghost" onPress={onGoToPreviousMonth}>
				<ChevronLeft className="text-foreground" />
			</Button>
			<Text className="text-lg font-bold">{title}</Text>
			<Button variant="ghost" onPress={onGoToNextMonth}>
				<ChevronRight className="text-foreground" />
			</Button>
		</View>
	);
}
