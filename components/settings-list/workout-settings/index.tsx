import { Dumbbell, Timer, Vibrate, Volume2 } from "lucide-react-native";
import { View } from "react-native";

import TimerInput from "~/components/timer-input";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "~/components/ui/card";
import { Icon } from "~/components/ui/icon";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import useGetWorkoutSettings from "~/hooks/api/use-get-workout-settings";
import useUpdateWorkoutSettings from "~/hooks/api/use-update-workout-settings";
import formatDuration from "~/lib/format-duration";

import SettingRow from "./setting-row";

export default function WorkoutSettings() {
	// Fetch settings from database
	const { data: settings, isLoading } = useGetWorkoutSettings();
	const { updateWorkoutSettings } = useUpdateWorkoutSettings();

	return (
		<Card className="bg-background">
			<CardHeader>
				<View className="flex flex-row gap-2 items-center mb-1">
					<Icon
						as={Dumbbell}
						className="text-card-foreground h-6 w-6"
					/>
					<CardTitle className="flex flex-row gap-4">
						Workout and Exercises
					</CardTitle>
				</View>
				<CardDescription>
					Customize your workout experience
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-6 w-full">
				{/* Timer Settings Section */}
				<View className="flex flex-col gap-4">
					<View className="flex flex-row items-center gap-2">
						<Icon
							as={Timer}
							className="text-muted-foreground h-5 w-5"
						/>
						<Text className="text-base font-semibold">
							Timer Settings
						</Text>
					</View>

					<SettingRow
						label="Ready Up Duration"
						description="Countdown before exercise starts"
					>
						<TimerInput
							value={settings?.readyUpDurationSeconds ?? 10}
							onConfirm={(value) =>
								updateWorkoutSettings({
									readyUpDurationSeconds: value
								})
							}
							title="Ready Up Duration"
							description="How long to countdown before starting an exercise"
						>
							<Button
								variant="outline"
								className="min-w-24"
								disabled={isLoading}
							>
								<Text>
									{formatDuration(
										(settings?.readyUpDurationSeconds ??
											10) * 1000
									)}
								</Text>
							</Button>
						</TimerInput>
					</SettingRow>

					<SettingRow
						label="Countdown Warning Time"
						description="When to play warning sound before timer ends"
					>
						<TimerInput
							value={settings?.countdownWarningSeconds ?? 3}
							onConfirm={(value) =>
								updateWorkoutSettings({
									countdownWarningSeconds: value
								})
							}
							title="Countdown Warning Time"
						>
							<Button
								variant="outline"
								className="min-w-24"
								disabled={isLoading}
							>
								<Text>
									{formatDuration(
										(settings?.countdownWarningSeconds ??
											3) * 1000
									)}
								</Text>
							</Button>
						</TimerInput>
					</SettingRow>
				</View>

				<Separator />

				{/* Sound Settings Section */}
				<View className="flex flex-col gap-4">
					<View className="flex flex-row items-center gap-2">
						<Icon
							as={Volume2}
							className="text-muted-foreground h-5 w-5"
						/>
						<Text className="text-base font-semibold">
							Sound Settings
						</Text>
					</View>

					<SettingRow
						label="Mute by Default"
						description="Start workouts with sound muted"
					>
						<Switch
							checked={settings?.soundsMutedByDefault ?? false}
							onCheckedChange={(value) =>
								updateWorkoutSettings({
									soundsMutedByDefault: value
								})
							}
							disabled={isLoading}
						/>
					</SettingRow>
				</View>

				<Separator />

				{/* Haptic Feedback Section */}
				<View className="flex flex-col gap-4">
					<View className="flex flex-row items-center gap-2">
						<Icon
							as={Vibrate}
							className="text-muted-foreground h-5 w-5"
						/>
						<Text className="text-base font-semibold">
							Haptic Feedback
						</Text>
					</View>

					<SettingRow
						label="Vibrate on Timer Start"
						description="Light vibration when timer starts"
					>
						<Switch
							checked={settings?.hapticOnTimerStart ?? false}
							onCheckedChange={(value) =>
								updateWorkoutSettings({
									hapticOnTimerStart: value
								})
							}
							disabled={isLoading}
						/>
					</SettingRow>

					<SettingRow
						label="Vibrate on Warning"
						description="Medium vibration during countdown warning"
					>
						<Switch
							checked={settings?.hapticOnWarning ?? true}
							onCheckedChange={(value) =>
								updateWorkoutSettings({
									hapticOnWarning: value
								})
							}
							disabled={isLoading}
						/>
					</SettingRow>

					<SettingRow
						label="Vibrate on Complete"
						description="Heavy vibration when timer completes"
					>
						<Switch
							checked={settings?.hapticOnComplete ?? true}
							onCheckedChange={(value) =>
								updateWorkoutSettings({
									hapticOnComplete: value
								})
							}
							disabled={isLoading}
						/>
					</SettingRow>
				</View>
			</CardContent>
		</Card>
	);
}
