import { WorkoutLog } from "~/types";
import { View, ViewProps } from "react-native";
import { Text } from "../../ui/text";
import { Link } from "expo-router";
import { Button } from "../../ui/button";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { cn } from "~/lib/utils";
import Loading from "./loading";
import { Trash } from "~/lib/icons/Trash";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import { toast } from "sonner-native";
import useDeleteWorkoutLog from "~/hooks/api/use-delete-workout-log";

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
			actionText: "Delete",
			loadingText: "Deleting...",
			onConfirm: async () => {
				deleteWorkoutLog(workoutLog.id);
			}
		});
	}

	return (
		<Link key={workoutLog.id} href={`/workouts/${workoutLog.workout.id}`}>
			<View
				{...props}
				className={cn(
					"flex flex-row gap-4 rounded-md px-4 py-4",
					className
				)}
			>
				<View>
					<Text className="font-bold">
						{workoutLog.completedAt.toLocaleDateString("en-SG", {
							day: "2-digit",
							month: "short"
						})}
					</Text>
					<Text className="text-muted-foreground">
						{new Intl.DateTimeFormat("en-US", {
							timeStyle: "short"
						}).format(workoutLog.completedAt)}
					</Text>
				</View>
				<Text className="line-clamp-3 flex-1 font-bold">
					{workoutLog.workout.name}
				</Text>
				<View className="flex flex-row gap-2">
					<Button
						variant="ghost"
						className="self-center"
						onPress={handleDeleteDialogPress}
					>
						<Trash size={20} className="text-destructive" />
					</Button>
					<Link href={`/workouts/${workoutLog.workout.id}`} asChild>
						<Button
							variant="ghost"
							size="icon"
							className="self-center"
						>
							<ChevronRight className="text-muted-foreground" />
						</Button>
					</Link>
				</View>
			</View>
		</Link>
	);
}

WorkoutLogCard.Loading = Loading;
