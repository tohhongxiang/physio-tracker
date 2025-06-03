import { View } from "react-native";
import { Text } from "../../ui/text";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Plus } from "~/lib/icons/Plus";
import { Minus } from "~/lib/icons/Minus";
import { Controller, useForm } from "react-hook-form";
import { ExerciseFormSchema, ExerciseFormSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import TimerInput from "../../timer-input";
import formatDuration from "~/lib/format-duration";
import { CreateExercise } from "~/types";
import { X } from "~/lib/icons/X";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function SingleExerciseForm({
	isOpen,
	initialData,
	onCancel,
	onSubmit
}: {
	isOpen?: boolean;
	initialData?: CreateExercise | null | undefined;
	onCancel: () => void;
	onSubmit: (createdExercise: CreateExercise) => void;
}) {
	const form = useForm<ExerciseFormSchemaType>({
		resolver: zodResolver(ExerciseFormSchema),
		defaultValues: {
			name: "",
			description: "",
			sets: 1,
			restBetweenSetsSeconds: 0,
			reps: 1,
			durationPerRepSeconds: 0,
			restBetweenRepsSeconds: 0,
			weight: 0,
			...initialData
		}
	});

	function handleSubmit() {
		form.handleSubmit(onSubmit)();
	}

	useEffect(() => {
		if (initialData || !isOpen) return;

		const timeoutHandler = setTimeout(() => {
			form.setFocus("name");
		}, 0);

		return () => timeoutHandler && clearTimeout(timeoutHandler);
	}, [form, initialData, isOpen]);

	return (
		<View className="flex h-full flex-col">
			<View className="flex flex-row items-center justify-between p-4">
				<Text className="text-2xl font-bold">
					{initialData ? "Update Exercise" : "New Exercise"}
				</Text>
				<Button variant="ghost" onPress={onCancel}>
					<X className="text-foreground" />
				</Button>
			</View>
			<ScrollView contentContainerClassName="flex flex-col grow gap-8 p-4">
				<View className="flex flex-col gap-4">
					<View className="flex flex-col gap-1">
						<Label
							nativeID="name"
							className={cn(
								"native:text-lg",
								form.formState.errors.name && "text-destructive"
							)}
						>
							Name
						</Label>
						<Controller
							control={form.control}
							name="name"
							render={({ field: { onChange, ...field } }) => (
								<Input
									aria-labelledby="name"
									className={
										form.formState.errors.name &&
										"border-destructive"
									}
									onChangeText={onChange}
									{...field}
								/>
							)}
						/>
						{form.formState.errors.name && (
							<Text className="text-sm text-destructive">
								{form.formState.errors.name?.message}
							</Text>
						)}
					</View>
				</View>
				<View className="flex flex-col gap-6">
					<View className="flex flex-col gap-4">
						<View className="flex flex-col gap-1">
							<View className="flex flex-row items-center justify-between gap-1">
								<Label
									nativeID="sets"
									className={cn(
										"native:text-lg font-medium",
										form.formState.errors.sets &&
											"text-destructive"
									)}
								>
									Sets
								</Label>
								<Controller
									control={form.control}
									name="sets"
									render={({
										field: { onChange, value }
									}) => (
										<View className="flex flex-row items-center justify-center gap-4">
											<Button
												variant="outline"
												className={cn(
													"aspect-square rounded-full",
													form.formState.errors
														.sets &&
														"border-destructive"
												)}
												onPress={() =>
													onChange(value - 1)
												}
												disabled={value <= 1}
											>
												<Minus
													className={cn(
														"h-4 w-4 text-foreground",
														form.formState.errors
															.sets &&
															"text-destructive"
													)}
												/>
											</Button>
											<Text
												className={cn(
													"w-20 text-center font-medium",
													form.formState.errors
														.sets &&
														"border-destructive text-destructive"
												)}
											>
												{value}
											</Text>
											<Button
												variant="outline"
												onPress={() =>
													onChange(value + 1)
												}
												className={cn(
													"aspect-square rounded-full",
													form.formState.errors
														.sets &&
														"border-destructive"
												)}
											>
												<Plus
													className={cn(
														"text-foreground",
														form.formState.errors
															.sets &&
															"text-destructive"
													)}
												/>
											</Button>
										</View>
									)}
								/>
							</View>
							{form.formState.errors.sets && (
								<View className="ml-auto w-52">
									<Text className="text-center text-sm text-destructive">
										{form.formState.errors.sets.message}
									</Text>
								</View>
							)}
						</View>
						<View className="flex flex-col gap-1">
							<View className="flex flex-row items-center justify-between gap-1">
								<Text
									className={cn(
										"text-lg font-medium",
										form.formState.errors
											.restBetweenSetsSeconds &&
											"text-destructive"
									)}
								>
									Rest Between Sets
								</Text>
								<Controller
									control={form.control}
									name="restBetweenSetsSeconds"
									render={({
										field: { onChange, value, ...field }
									}) => (
										<TimerInput
											allowZeroDuration
											value={value}
											onConfirm={(durationSeconds) =>
												onChange(durationSeconds)
											}
										>
											<Button
												className={cn(
													"w-52 text-center font-medium",
													form.formState.errors
														.restBetweenSetsSeconds &&
														"border-destructive"
												)}
												variant="outline"
												{...field}
											>
												<Text
													className={
														form.formState.errors
															.restBetweenSetsSeconds &&
														"text-destructive"
													}
												>
													{formatDuration(
														value * 1000
													)}
												</Text>
											</Button>
										</TimerInput>
									)}
								/>
							</View>
							{form.formState.errors.restBetweenSetsSeconds && (
								<View className="ml-auto w-52">
									<Text className="text-center text-sm text-destructive">
										{
											form.formState.errors
												.restBetweenSetsSeconds.message
										}
									</Text>
								</View>
							)}
						</View>
					</View>
					<Separator />
					<View className="flex flex-col gap-4">
						<View className="flex flex-col gap-1">
							<View className="flex flex-row items-center justify-between gap-1">
								<Label
									nativeID="reps"
									className={cn(
										"native:text-lg font-medium",
										form.formState.errors.reps &&
											"text-destructive"
									)}
								>
									Reps
								</Label>
								<Controller
									control={form.control}
									name="reps"
									render={({
										field: { onChange, value }
									}) => (
										<View className="flex flex-row items-center justify-center gap-4">
											<Button
												variant="outline"
												className={cn(
													"aspect-square rounded-full",
													form.formState.errors
														.reps &&
														"border-destructive"
												)}
												onPress={() =>
													onChange(value - 1)
												}
												disabled={value <= 1}
											>
												<Minus
													className={cn(
														"h-4 w-4 text-foreground",
														form.formState.errors
															.reps &&
															"text-destructive"
													)}
												/>
											</Button>
											<Text
												className={cn(
													"w-20 text-center font-medium",
													form.formState.errors
														.reps &&
														"border-destructive text-destructive"
												)}
											>
												{value}
											</Text>
											<Button
												variant="outline"
												onPress={() =>
													onChange(value + 1)
												}
												className={cn(
													"aspect-square rounded-full",
													form.formState.errors
														.reps &&
														"border-destructive"
												)}
											>
												<Plus
													className={cn(
														"text-foreground",
														form.formState.errors
															.reps &&
															"text-destructive"
													)}
												/>
											</Button>
										</View>
									)}
								/>
							</View>
							{form.formState.errors.reps && (
								<View className="ml-auto w-52">
									<Text className="text-center text-sm text-destructive">
										{form.formState.errors.reps.message}
									</Text>
								</View>
							)}
						</View>
						<View className="flex flex-col gap-1">
							<View className="flex flex-row items-center justify-between gap-1">
								<Text
									className={cn(
										"text-lg font-medium",
										form.formState.errors
											.durationPerRepSeconds &&
											"text-destructive"
									)}
								>
									Duration per Rep
								</Text>
								<Controller
									control={form.control}
									name="durationPerRepSeconds"
									render={({
										field: { onChange, value, ...field }
									}) => (
										<TimerInput
											allowZeroDuration
											value={value}
											onConfirm={(durationSeconds) =>
												onChange(durationSeconds)
											}
										>
											<Button
												className={cn(
													"w-52 text-center font-medium",
													form.formState.errors
														.durationPerRepSeconds &&
														"border-destructive"
												)}
												variant="outline"
												{...field}
											>
												<Text
													className={
														form.formState.errors
															.durationPerRepSeconds &&
														"text-destructive"
													}
												>
													{formatDuration(
														value * 1000
													)}
												</Text>
											</Button>
										</TimerInput>
									)}
								/>
							</View>
							{form.formState.errors.durationPerRepSeconds && (
								<View className="ml-auto w-52">
									<Text className="text-center text-sm text-destructive">
										{
											form.formState.errors
												.durationPerRepSeconds.message
										}
									</Text>
								</View>
							)}
						</View>
						<View className="flex flex-col gap-1">
							<View className="flex flex-row items-center justify-between gap-1">
								<Text
									className={cn(
										"text-lg font-medium",
										form.formState.errors
											.restBetweenRepsSeconds &&
											"text-destructive"
									)}
								>
									Rest Between Reps
								</Text>
								<Controller
									control={form.control}
									name="restBetweenRepsSeconds"
									render={({
										field: { onChange, value, ...field }
									}) => (
										<TimerInput
											allowZeroDuration
											value={value}
											onConfirm={(durationSeconds) =>
												onChange(durationSeconds)
											}
										>
											<Button
												className={cn(
													"w-52 text-center font-medium",
													form.formState.errors
														.restBetweenRepsSeconds &&
														"border-destructive"
												)}
												variant="outline"
												{...field}
											>
												<Text
													className={
														form.formState.errors
															.restBetweenRepsSeconds &&
														"text-destructive"
													}
												>
													{formatDuration(
														value * 1000
													)}
												</Text>
											</Button>
										</TimerInput>
									)}
								/>
							</View>
							{form.formState.errors.restBetweenRepsSeconds && (
								<View className="ml-auto w-52">
									<Text className="text-center text-sm text-destructive">
										{
											form.formState.errors
												.restBetweenRepsSeconds.message
										}
									</Text>
								</View>
							)}
						</View>
						<View className="flex flex-col gap-1">
							<View className="flex flex-row items-center justify-between gap-1">
								<Text
									className={cn(
										"text-lg font-medium",
										form.formState.errors.weight &&
											"text-destructive"
									)}
									id="weight"
								>
									Weight (kg)
								</Text>
								<Controller
									control={form.control}
									name="weight"
									render={({
										field: { onChange, value, ...field }
									}) => (
										<Input
											aria-labelledby="weight"
											keyboardType="number-pad"
											className={cn(
												"w-52 text-center",
												form.formState.errors.weight &&
													"border-destructive"
											)}
											value={value.toString()}
											onChangeText={(text) => {
												const parsedValue =
													Number(text);
												if (
													text.startsWith("0") &&
													!text.includes(".") &&
													!Number.isNaN(parsedValue)
												) {
													onChange(parsedValue);
												} else {
													onChange(text);
												}
											}}
											{...field}
										/>
									)}
								/>
							</View>
							{form.formState.errors.weight && (
								<View className="ml-auto w-52">
									<Text className="text-center text-sm text-destructive">
										{form.formState.errors.weight.message}
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>
				<View>
					<View className="flex flex-col gap-1">
						<Label
							nativeID="description"
							className={cn(
								"native:text-lg",
								form.formState.errors.description &&
									"text-destructive"
							)}
						>
							Notes
						</Label>
						<Controller
							control={form.control}
							name="description"
							render={({ field: { onChange, ...field } }) => (
								<Textarea
									aria-labelledby="description"
									onChangeText={onChange}
									{...field}
								/>
							)}
						/>
						{form.formState.errors.description && (
							<Text className="text-destructive">
								{form.formState.errors.description.message}
							</Text>
						)}
					</View>
				</View>
			</ScrollView>
			<View className="mt-auto flex flex-row gap-4 p-4">
				<Button
					variant="secondary"
					className="flex-grow"
					onPress={onCancel}
				>
					<Text>Cancel</Text>
				</Button>
				<Button className="flex-grow" onPress={handleSubmit}>
					<Text>
						{initialData ? "Update Exercise" : "Add Exercise"}
					</Text>
				</Button>
			</View>
		</View>
	);
}
