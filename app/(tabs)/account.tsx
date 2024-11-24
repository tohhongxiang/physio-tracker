import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "~/lib/use-color-scheme";

export default function AccountPage() {
	const { isDarkColorScheme } = useColorScheme();
	return (
		<View className="flex h-full items-center justify-center">
			<Button className="flex flex-row items-center gap-4">
				<Ionicons
					name={"logo-google"}
					size={16}
					color={isDarkColorScheme ? "black" : "white"}
				/>
				<Text>Login with Google</Text>
			</Button>
		</View>
	);
}
