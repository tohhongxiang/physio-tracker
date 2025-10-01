import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Pause,
	Play
} from "lucide-react-native";
import { memo } from "react";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";

export default memo(function BottomControls({
	currentSet,
	currentRep,
	totalSets,
	totalReps,
	isTimerRunning,
	onSetChange,
	onRepChange,
	onStart,
	setChangeDisabled = false,
	repChangeDisabled = false
}: {
	currentSet: number;
	currentRep: number;
	totalSets: number;
	totalReps: number;
	isTimerRunning: boolean;
	onSetChange: (change: number) => unknown;
	onRepChange: (change: number) => unknown;
	onStart: () => unknown;
	setChangeDisabled?: boolean;
	repChangeDisabled?: boolean;
}) {
	return (
		<View className="flex flex-row items-center justify-around gap-2 p-4">
			<Button
				variant="secondary"
				className="native:h-fit h-fit"
				disabled={currentSet === 1 || setChangeDisabled}
				onPress={() => onSetChange(-1)}
			>
				<Icon
					as={ChevronsLeft}
					className="text-secondary-foreground h-6 w-6"
				/>
				<Text className="text-center">Set</Text>
			</Button>
			<Button
				variant="secondary"
				className="native:h-fit h-fit"
				disabled={
					(currentRep === 1 && currentSet === 1) || repChangeDisabled
				}
				onPress={() => onRepChange(-1)}
			>
				<Icon
					as={ChevronLeft}
					className="text-secondary-foreground h-6 w-6"
				/>
				<Text className="text-center">Rep</Text>
			</Button>
			<Button
				size="lg"
				className="native:h-24 native:w-24 h-24 w-24 rounded-full p-4"
				onPress={onStart}
			>
				{isTimerRunning ? (
					<Icon
						as={Pause}
						className="text-primary-foreground h-6 w-6"
					/>
				) : (
					<Icon
						as={Play}
						className="text-primary-foreground h-6 w-6"
					/>
				)}
			</Button>
			<Button
				variant="secondary"
				className="native:h-fit h-fit px-4 py-2"
				onPress={() => onRepChange(1)}
				disabled={
					(currentRep === totalReps && currentSet === totalSets) ||
					repChangeDisabled
				}
			>
				<View>
					<Icon
						as={ChevronRight}
						className="text-secondary-foreground h-6 w-6"
					/>
					<Text className="text-center text-secondary-foreground">
						Rep
					</Text>
				</View>
			</Button>
			<Button
				className="native:h-fit h-fit px-4 py-2"
				variant="secondary"
				onPress={() => onSetChange(1)}
				disabled={currentSet === totalSets || setChangeDisabled}
			>
				<View>
					<Icon
						as={ChevronsRight}
						className="text-secondary-foreground h-6 w-6"
					/>
					<Text className="text-center text-secondary-foreground">
						Set
					</Text>
				</View>
			</Button>
		</View>
	);
});
