import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	ReanimatedLogLevel,
	configureReanimatedLogger
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";

import NavigationHeader from "~/components/navigation-header";
import "~/global.css";
import AlertDialogProvider from "~/providers/alert-dialog-provider";
import DatabaseProvider from "~/providers/database-provider";
import QueryClientProvider from "~/providers/query-client-provider";
import ThemeProvider from "~/providers/theme-provider";

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
										<Stack.Screen name="(tabs)" />
										<Stack.Screen name="+not-found" />
										<Stack.Screen name="workouts/[id]" />
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
									</Stack>
								</BottomSheetModalProvider>
								<PortalHost />
								<Toaster position="bottom-center" />
							</AlertDialogProvider>
						</QueryClientProvider>
					</DatabaseProvider>
				</ThemeProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
