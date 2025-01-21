import { useCallback, useRef } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Plus } from "~/lib/icons/Plus";
import { useFieldArray } from "react-hook-form";
import { FormStepProps } from "../form-step-props";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import WorkoutExerciseDetailsCard from "./workout-exercise-details-card";

export default function WorkoutExerciseDetailsForm({
	form: {
		control,
		formState: { errors }
	}
}: FormStepProps) {
	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "exercises"
	});

	function handleAddExercise() {
		append(
			{
				name: "",
				description: "",
				sets: 1,
				reps: 1,
				restBetweenRepsSeconds: 0,
				restBetweenSetsSeconds: 0,
				durationPerRepSeconds: 0
			},
			{ shouldFocus: false }
		);
	}

	const scrollViewRef = useRef<Animated.FlatList<unknown> | null>(null);
	const previousHeight = useRef(-1);
	function handleContentSizeChanged(height: number) {
		if (height > previousHeight.current) {
			scrollViewRef.current?.scrollToEnd({ animated: true });
		}

		previousHeight.current = height;
	}

	const renderItem = useCallback(
		({ index }: { index: number }) => {
			return (
				<WorkoutExerciseDetailsCard
					errors={errors}
					index={index}
					control={control}
					fields={fields}
					move={move}
					remove={remove}
				/>
			);
		},
		[control, errors, fields, move, remove]
	);

	return (
		<View className="flex flex-1 grow flex-col gap-4">
			<View className="px-4 py-2">
				<Button
					onPress={handleAddExercise}
					className="flex flex-row items-center justify-center gap-4"
				>
					<Plus className="text-primary-foreground" />
					<Text>Add Exercise</Text>
				</Button>
			</View>
			{errors.exercises?.message ? (
				<Text className="text-center text-lg text-destructive">
					{errors.exercises?.message}
				</Text>
			) : null}
			<Animated.FlatList
				ref={scrollViewRef}
				data={fields}
				onContentSizeChange={(_, h) => handleContentSizeChanged(h)}
				itemLayoutAnimation={LinearTransition.duration(150).easing(
					Easing.ease
				)}
				ListEmptyComponent={
					<Text className="text-center text-lg italic text-muted-foreground opacity-75">
						No exercises yet.
					</Text>
				}
				contentContainerClassName={"min-h-0"}
				ItemSeparatorComponent={() => <View className="p-2" />}
				renderItem={renderItem}
			/>
		</View>
	);
}
