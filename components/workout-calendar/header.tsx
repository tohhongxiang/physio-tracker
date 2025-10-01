import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";

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
				<Icon as={ChevronLeft} className="text-foreground" />
			</Button>
			<Text className="text-lg font-bold">{title}</Text>
			<Button variant="ghost" onPress={onGoToNextMonth}>
				<Icon as={ChevronRight} className="text-foreground" />
			</Button>
		</View>
	);
}
