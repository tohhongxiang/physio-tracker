import { createRef } from "react";
import { ScrollView, View } from "react-native";
import TimerInput from "~/components/timer-input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import formatDuration from "~/lib/format-duration";
import { Plus } from "~/lib/icons/Plus";
import { Controller, useFieldArray } from "react-hook-form";
import { cn } from "~/lib/utils";
import { FormStepProps } from "./form-step-props";

export default function WorkoutExerciseDetailsForm({
	control,
	errors
}: FormStepProps) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "exercises"
	});

	const scrollViewRef = createRef<ScrollView>();
	function handleAddExercise() {
		append({
			name: "",
			description: "",
			sets: 1,
			reps: 1,
			restBetweenRepsSeconds: 0,
			restBetweenSetsSeconds: 0,
			durationPerRepSeconds: 0
		});

		scrollViewRef.current?.scrollToEnd({ animated: true });
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
			<Separator />
			{/* -mx-4 and p-4 to keep the scrollbar on the edge of the screen */}
			<ScrollView className="-mx-4" ref={scrollViewRef}>
				<View className="flex flex-col gap-4 p-4">
					{fields.length === 0 ? (
						<View>
							<Text className="text-center text-xl text-muted-foreground">
								^
							</Text>
							<Text className="text-center text-xl text-muted-foreground">
								Click the button above to add an exercise!
							</Text>
						</View>
					) : (
						fields.map((exercise, index) => (
							<Card key={exercise.id}>
								<CardContent className="flex flex-col gap-4 pt-6">
									<View>
										<Label
											nativeID="name"
											className={cn(
												"mb-2",
												errors.exercises?.[index]?.name
													?.message &&
													"text-destructive"
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
													errors.exercises?.[index]
														?.name?.message
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
											<Text className="text-lg">
												{" "}
												set(s)
											</Text>
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
											<Text className="text-lg">
												{" "}
												rep(s)
											</Text>
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
											<Text className="text-lg">
												Rest
											</Text>
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
								</CardContent>
								<CardFooter className="flex justify-end">
									<Button
										variant="destructive"
										onPress={() =>
											handleDeleteExercise(index)
										}
									>
										<Text>Delete</Text>
									</Button>
								</CardFooter>
							</Card>
						))
					)}
				</View>
			</ScrollView>
		</View>
	);
}
