import { memo } from "react";
import { View } from "react-native";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { ChevronsLeft } from "~/lib/icons/ChevronsLeft";
import { ChevronsRight } from "~/lib/icons/ChevronsRight";
import { Pause } from "~/lib/icons/Pause";
import { Play } from "~/lib/icons/Play";

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
				<ChevronsLeft className="text-secondary-foreground" />
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
				<ChevronLeft className="text-secondary-foreground" />
				<Text className="text-center">Rep</Text>
			</Button>
			<Button
				size="lg"
				className="native:h-28 native:w-28 h-28 w-28 rounded-full p-4"
				onPress={onStart}
			>
				{isTimerRunning ? (
					<Pause className="text-primary-foreground" />
				) : (
					<Play className="text-primary-foreground" />
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
					<ChevronRight className="text-secondary-foreground" />
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
					<ChevronsRight className="text-secondary-foreground" />
					<Text className="text-center text-secondary-foreground">
						Set
					</Text>
				</View>
			</Button>
		</View>
	);
});
