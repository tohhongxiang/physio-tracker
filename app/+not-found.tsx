import { Link } from "expo-router";
import { CircleAlert } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";

export default function NotFoundScreen() {
	return (
		<>
			<View className="flex flex-1 flex-col items-center justify-center gap-4">
				<Icon
					as={CircleAlert}
					size={64}
					className="mb-8 text-foreground"
				/>
				<Text className="text-center text-2xl">
					This screen does not exist.
				</Text>
				<Link href="/" asChild>
					<Button>
						<Text className="text-center text-lg">
							Go to home screen!
						</Text>
					</Button>
				</Link>
			</View>
		</>
	);
}
