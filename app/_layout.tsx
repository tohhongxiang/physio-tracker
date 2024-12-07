import "~/global.css";

import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import ThemeProvider from "~/providers/theme-provider";
import QueryClientProvider from "~/providers/query-client-provider";
import DatabaseProvider from "~/providers/database-provider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary
} from "expo-router";

export default function RootLayout() {
	return (
		<DatabaseProvider>
			<QueryClientProvider>
				<ThemeProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="+not-found" />
						<Stack.Screen name="workouts/[id]" />
						<Stack.Screen
							name="(modals)/workouts/add"
							options={{ presentation: "modal" }}
						/>
					</Stack>
					<PortalHost />
				</ThemeProvider>
			</QueryClientProvider>
		</DatabaseProvider>
	);
}
