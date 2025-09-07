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
import {
	configureReanimatedLogger,
	ReanimatedLogLevel
} from "react-native-reanimated";
import NavigationHeader from "~/components/navigation-header";

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false // Disable warnings due to react-native-reanimated-carousel
});

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary
} from "expo-router";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView>
				<ThemeProvider>
					<DatabaseProvider>
						<QueryClientProvider>
							<AlertDialogProvider>
								<BottomSheetModalProvider>
									<Stack
										screenOptions={{ headerShown: false }}
									>
										<Stack.Screen // we put the add workout here to show it in front of the tabs
											name="(modals)/workouts/add"
											options={{
												headerShown: true,
												header: (props) => (
													<NavigationHeader
														back={props.back}
														title={
															"Add New Workout"
														}
													/>
												),
												contentStyle: { flex: 1 }
											}}
										/>
										<Stack.Screen name="(tabs)" />
										<Stack.Screen name="+not-found" />
										<Stack.Screen name="workouts/[id]" />
									</Stack>
								</BottomSheetModalProvider>
								<Toaster position="bottom-center" />
								<PortalHost />
							</AlertDialogProvider>
						</QueryClientProvider>
					</DatabaseProvider>
				</ThemeProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
