import { ScrollView } from "react-native";

import DataSettings from "./data-settings";
import WorkoutSettings from "./workout-settings";

export default function SettingsList() {
	return (
		<ScrollView contentContainerClassName="flex flex-col gap-4 p-4">
			<DataSettings />
			<WorkoutSettings />
		</ScrollView>
	);
}
