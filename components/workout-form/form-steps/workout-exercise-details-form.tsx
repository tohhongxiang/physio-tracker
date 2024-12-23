import { useRef } from "react";
import { View } from "react-native";
import TimerInput from "~/components/timer-input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import formatDuration from "~/lib/format-duration";
import { Plus } from "~/lib/icons/Plus";
import {
	Controller,
	FieldError,
	FieldErrorsImpl,
	Merge,
	useFieldArray
} from "react-hook-form";
import { cn } from "~/lib/utils";
import { FormStepProps } from "./form-step-props";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";
import { WorkoutFormSchemaType } from "../schema";

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

	function handleDeleteExercise(index: number) {
		remove(index);
	}

	return (
		<View className="flex flex-1 flex-col gap-4">
			<View className="px-4 py-2">
				<Button
					onPress={handleAddExercise}
					className="flex flex-row items-center justify-center gap-4"
				>
					<Plus className="text-primary-foreground" />
					<Text>Add Exercise</Text>
				</Button>
			</View>
			{/* -mx-4 and p-4 to keep the scrollbar on the edge of the screen */}
			<Animated.FlatList
				ref={scrollViewRef}
				data={fields}
				onContentSizeChange={(_, h) => handleContentSizeChanged(h)}
				itemLayoutAnimation={LinearTransition.duration(150).easing(
					Easing.ease
				)}
				ItemSeparatorComponent={() => <View className="p-2" />}
				renderItem={({ index }) => {
					const specialErrors = getSpecialExerciseErrorMessages(
						errors.exercises?.[index]
					);
					return (
						<Card>
							<CardContent className="flex flex-col gap-4 pt-6">
								<View>
									<Label
										nativeID="name"
										className={cn(
											"mb-2",
											errors.exercises?.[index]?.name
												?.message && "text-destructive"
										)}
									>
										Name
									</Label>
									<Controller
										control={control}
										name={`exercises.${index}.name`}
										render={({
											field: { onChange, ...field }
										}) => (
											<Input
												aria-labelledby="name"
												placeholder="Name"
												onChangeText={onChange}
												{...field}
											/>
										)}
									/>
									{errors.exercises?.[index]?.name
										?.message && (
										<Text className="text-destructive">
											{
												errors.exercises?.[index]?.name
													?.message
											}
										</Text>
									)}
								</View>
								<View>
									<Label
										nativeID="description"
										className={cn(
											"mb-2",
											errors.exercises?.[index]
												?.description?.message &&
												"text-destructive"
										)}
									>
										Description
									</Label>
									<Controller
										control={control}
										name={`exercises.${index}.description`}
										render={({
											field: { onChange, ...field }
										}) => (
											<Textarea
												aria-labelledby="description"
												placeholder="Description"
												onChangeText={onChange}
												{...field}
											/>
										)}
									/>
								</View>
								<View className="flex flex-row flex-wrap items-center gap-2">
									<View className="flex flex-row items-center justify-center gap-1 text-center">
										<Controller
											control={control}
											name={`exercises.${index}.sets`}
											render={({
												field: {
													value,
													onChange,
													onBlur
												}
											}) => (
												<Input
													keyboardType="numeric"
													className={cn(
														"w-16",
														errors.exercises?.[
															index
														]?.sets &&
															"border-destructive"
													)}
													value={String(value)}
													onChangeText={onChange}
													onBlur={onBlur}
												/>
											)}
										/>
										<Text className="text-lg"> set(s)</Text>
									</View>
									<Text className="text-lg"> × </Text>
									<View className="flex flex-row items-center justify-center gap-1 text-center">
										<Controller
											control={control}
											name={`exercises.${index}.reps`}
											render={({
												field: {
													onChange,
													onBlur,
													value
												}
											}) => (
												<Input
													keyboardType="numeric"
													className={cn(
														"w-16",
														errors.exercises?.[
															index
														]?.reps &&
															"border-destructive"
													)}
													value={String(value)}
													onChangeText={onChange}
													onBlur={onBlur}
												/>
											)}
										/>
										<Text className="text-lg"> rep(s)</Text>
									</View>
									<Text className="text-lg"> × </Text>
									<View className="flex flex-row items-center justify-center gap-1 text-center">
										<Controller
											control={control}
											name={`exercises.${index}.durationPerRepSeconds`}
											render={({
												field: { onChange, value }
											}) => (
												<TimerInput
													value={value}
													onConfirm={onChange}
													allowZeroDuration
												>
													<Button variant="outline">
														<Text>
															{formatDuration(
																value * 1000
															)}
														</Text>
													</Button>
												</TimerInput>
											)}
										/>
										<Text className="text-lg">
											{" "}
											per rep
										</Text>
									</View>
								</View>
								<View className="flex flex-row flex-wrap items-center gap-2">
									<View className="flex flex-row items-center justify-center gap-2 text-center">
										<Text className="text-lg">Rest</Text>
										<Controller
											control={control}
											name={`exercises.${index}.restBetweenRepsSeconds`}
											render={({
												field: { onChange, value }
											}) => (
												<TimerInput
													value={value}
													onConfirm={onChange}
													allowZeroDuration
												>
													<Button variant="outline">
														<Text>
															{formatDuration(
																value * 1000
															)}
														</Text>
													</Button>
												</TimerInput>
											)}
										/>
										<Text className="text-lg">
											{" "}
											per rep,
										</Text>
									</View>
									<View className="flex flex-row items-center justify-center gap-1 text-center">
										<Controller
											control={control}
											name={`exercises.${index}.restBetweenSetsSeconds`}
											render={({
												field: { onChange, value }
											}) => (
												<TimerInput
													value={value}
													onConfirm={onChange}
													allowZeroDuration
												>
													<Button variant="outline">
														<Text>
															{formatDuration(
																value * 1000
															)}
														</Text>
													</Button>
												</TimerInput>
											)}
										/>
										<Text className="text-lg">
											{" "}
											per set
										</Text>
									</View>
								</View>
								{specialErrors.length > 0 ? (
									<View>
										<SpecialExerciseErrorDisplay
											errors={specialErrors}
										/>
									</View>
								) : null}
							</CardContent>
							<CardFooter className="flex justify-between">
								<View className="flex flex-row">
									<Button
										className="rounded-r-none"
										disabled={
											fields.length === 1 || index === 0
										}
										onPress={() => move(index, index - 1)}
									>
										<ChevronUp className="text-primary-foreground" />
									</Button>
									<Button
										className="rounded-l-none"
										disabled={
											fields.length === 1 ||
											index === fields.length - 1
										}
										onPress={() => move(index, index + 1)}
									>
										<ChevronDown className="text-primary-foreground" />
									</Button>
								</View>
								<Button
									variant="destructive"
									onPress={() => handleDeleteExercise(index)}
								>
									<Text>Delete</Text>
								</Button>
							</CardFooter>
						</Card>
					);
				}}
			/>
		</View>
	);
}

// special errors refer to error messages that cannot be displayed on the form (due to lack of space). These are extracted to be displayed separately
function getSpecialExerciseErrorMessages(
	error?: Merge<
		FieldError,
		FieldErrorsImpl<WorkoutFormSchemaType["exercises"][number]>
	>
) {
	if (!error) return [];
	const specialErrors = [
		error.sets?.message,
		error.reps?.message,
		error.durationPerRepSeconds?.message,
		error.restBetweenRepsSeconds?.message,
		error.restBetweenSetsSeconds?.message
	];
	return specialErrors.filter(Boolean) as string[];
}

function SpecialExerciseErrorDisplay({ errors }: { errors: string[] }) {
	return errors.map((error, index) => (
		<Text key={index} className="text-destructive">
			{error}
		</Text>
	));
}
