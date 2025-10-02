import { Link } from "expo-router";
import { Trash } from "lucide-react-native";
import { Pressable, View, ViewProps } from "react-native";
import { toast } from "sonner-native";

import NumberOfExercisesBadge from "~/components/exercise-detail-badges/number-of-exercises-badge";
import WorkoutDurationBadge from "~/components/exercise-detail-badges/workout-duration-badge";
import useDeleteWorkoutLog from "~/hooks/api/use-delete-workout-log";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import { WorkoutLog } from "~/types";

import { Button } from "../../ui/button";
import { Icon } from "../../ui/icon";
import { Text } from "../../ui/text";
import Loading from "./loading";

interface WorkoutLogCardProps extends ViewProps {
	workoutLog: WorkoutLog;
}

export default function WorkoutLogCard({
	workoutLog,
	className,
	...props
}: WorkoutLogCardProps) {
	const { deleteWorkoutLog } = useDeleteWorkoutLog({
		onSuccess: () => {
			toast.success("Successfully deleted log!");
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});
	const alert = useAlertDialog();

	function handleDeleteDialogPress() {
		alert({
			variant: "destructive",
			title: "Delete Log?",
			description: "This action is permanent.",
			actionContent: "Delete",
			loadingContent: "Deleting...",
			onConfirm: async () => {
				deleteWorkoutLog(workoutLog.id);
			}
		});
	}

	return (
		<View {...props} key={workoutLog.id} className={className}>
			<Link href={`/workouts/${workoutLog.workout.id}`} asChild>
				<Pressable className="flex w-full flex-row items-center justify-between gap-2 rounded-md border border-input px-4 py-4 active:opacity-80">
					<View>
						<Text className="font-bold text-muted-foreground">
							{workoutLog.completedAt.toLocaleDateString(
								"default",
								{
									day: "2-digit",
									month: "short"
								}
							)}
						</Text>
						<Text className="text-sm font-light text-muted-foreground">
							{new Intl.DateTimeFormat("en-US", {
								timeStyle: "short"
							}).format(workoutLog.completedAt)}
						</Text>
					</View>
					<View className="flex flex-1 flex-col gap-2">
						<Text
							className="line-clamp-1 text-ellipsis px-2 text-xl font-bold"
							numberOfLines={2}
						>
							{workoutLog.workout.name}
						</Text>
						<View className="flex flex-row flex-wrap">
							<WorkoutDurationBadge
								workout={workoutLog.workout}
								variant="ghost"
								className="opacity-75"
							/>
							<NumberOfExercisesBadge
								number={workoutLog.workout.exercises.length}
								variant="ghost"
								className="opacity-75"
							/>
						</View>
					</View>
					<View className="flex-0 flex flex-row gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="self-center"
							onPress={handleDeleteDialogPress}
						>
							<Icon
								as={Trash}
								className="text-destructive h-6 w-6"
							/>
						</Button>
					</View>
				</Pressable>
			</Link>
		</View>
	);
}

WorkoutLogCard.Loading = Loading;
