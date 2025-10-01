import AsyncStorage from "@react-native-async-storage/async-storage";
import { MoonStar, Sun } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { Icon } from "~/components/ui/icon";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { useColorScheme } from "~/lib/use-color-scheme";
import { cn } from "~/lib/utils";

export function ThemeToggle() {
	const { isDarkColorScheme, setColorScheme } = useColorScheme();
	return (
		<Pressable
			onPress={() => {
				const newTheme = isDarkColorScheme ? "light" : "dark";
				setColorScheme(newTheme);
				setAndroidNavigationBar(newTheme);
				AsyncStorage.setItem("theme", newTheme);
			}}
			className="h-10 w-10 web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2"
		>
			{({ pressed }) => (
				<View
					className={cn(
						"aspect-square flex-1 items-start justify-center pt-0.5 web:px-5",
						pressed && "opacity-70"
					)}
				>
					{isDarkColorScheme ? (
						<Icon
							as={MoonStar}
							className="text-foreground h-6 w-6"
						/>
					) : (
						<Icon as={Sun} className="text-foreground h-6 w-6" />
					)}
				</View>
			)}
		</Pressable>
	);
}
