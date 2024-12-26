import "~/global.css";

import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import ThemeProvider from "~/providers/theme-provider";
import QueryClientProvider from "~/providers/query-client-provider";
import DatabaseProvider from "~/providers/database-provider";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AlertDialogProvider from "~/providers/alert-dialog-provider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary
} from "expo-router";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView>
				<DatabaseProvider>
					<QueryClientProvider>
						<ThemeProvider>
							<AlertDialogProvider>
								<BottomSheetModalProvider>
									<Stack
										screenOptions={{ headerShown: false }}
									>
										<Stack.Screen name="(tabs)" />
										<Stack.Screen name="+not-found" />
										<Stack.Screen name="workouts/[id]" />
										<Stack.Screen
											name="(modals)/workouts/add"
											options={{
												presentation: "modal",
												headerShown: true,
												title: "Add New Workout"
											}}
										/>
									</Stack>
									<Toaster position="bottom-center" />
								</BottomSheetModalProvider>
								<PortalHost />
							</AlertDialogProvider>
						</ThemeProvider>
					</QueryClientProvider>
				</DatabaseProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
