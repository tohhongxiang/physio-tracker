import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider as ReactNavigationThemeProvider } from "@react-navigation/native";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/theme";
import { useColorScheme } from "~/lib/use-color-scheme";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function ThemeProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

	useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (Platform.OS === "web") {
				// Adds the background color to the html element to prevent white background on overscroll.
				document.documentElement.classList.add("bg-background");
			}
			if (!theme) {
				AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);
				setAndroidNavigationBar(colorTheme);
				setIsColorSchemeLoaded(true);
				return;
			}

			setAndroidNavigationBar(colorTheme);
			setIsColorSchemeLoaded(true);
		})().finally(() => {
			SplashScreen.hideAsync();
		});
	}, [colorScheme, setColorScheme]);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<ReactNavigationThemeProvider
			value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}
		>
			<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
			{children}
		</ReactNavigationThemeProvider>
	);
}
