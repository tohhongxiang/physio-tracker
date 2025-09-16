import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { ExerciseFormSchema, ExerciseFormSchemaType } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import TimerInput from "~/components/timer-input";
import formatDuration from "~/lib/format-duration";
import { CreateExercise, Exercise } from "~/types";
import { X } from "~/lib/icons/X";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import FullWidthInput from "./full-width-input";
import IntegerInput from "./integer-input";
import SingleLineInput from "./single-line-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { toast } from "sonner-native";
import LoadingSingleExercise from "./loading";

const WEIGHT_UNIT_OPTIONS = [
	{ label: "kg", value: "kg" },
	{ label: "lbs", value: "lbs" },
	{ label: "%BW", value: "%BW" }
];

type SingleExerciseFormBaseProps = {
	isOpen?: boolean;
	showHeader?: boolean;
	onCancel?: () => void;
};

interface CreateNewExerciseProps extends SingleExerciseFormBaseProps {
	initialData?: CreateExercise | null | undefined;
	onSubmit?: (exercise: CreateExercise) => void;
}

interface UpdateExistingExerciseProps extends SingleExerciseFormBaseProps {
	initialData: Exercise;
	onSubmit?: (exercise: Exercise) => void;
}

export default function SingleExerciseForm({
	isOpen,
	showHeader = true,
	initialData,
	onCancel,
	onSubmit
}: CreateNewExerciseProps | UpdateExistingExerciseProps) {
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
		if (!onSubmit) return;

		form.handleSubmit(
			onSubmit as (exercise: CreateExercise) => void, // Cannot infer that id is defined if we intially pass in the ID
			(e) => {
				const errors = Object.entries(e).filter(([, value]) => value);
				errors.forEach(([key, value]) => {
					toast.error(`${key}: ${value.message}`);
				});
			}
		)();
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
			{showHeader && (
				<View className="flex flex-row items-center justify-between p-4 pr-0">
					<Text className="text-2xl font-bold">
						{initialData ? "Update Exercise" : "New Exercise"}
					</Text>
					<Button variant="ghost" onPress={onCancel}>
						<X className="text-foreground" />
					</Button>
				</View>
			)}
			<ScrollView contentContainerClassName="flex flex-col grow gap-8 p-4">
				<View className="flex flex-col gap-4">
					<FullWidthInput
						control={form.control}
						name="name"
						label="Name"
						errorMessage={form.formState.errors.name?.message}
					/>
				</View>
				<View className="flex flex-col gap-6">
					<View className="flex flex-col gap-4">
						<SingleLineInput
							control={form.control}
							errorMessage={form.formState.errors.sets?.message}
							name="sets"
							label="Sets"
							render={({ field: { onChange, value, name } }) => (
								<IntegerInput
									value={value}
									onChange={onChange}
									isInvalid={!!form.formState.errors[name]}
									disableDecrement={value <= 1}
								/>
							)}
						/>
						<SingleLineInput
							control={form.control}
							errorMessage={
								form.formState.errors.restBetweenSetsSeconds
									?.message
							}
							name="restBetweenSetsSeconds"
							label="Rest Between Sets"
							render={({
								field: { onChange, value, name, ...field }
							}) => (
								<TimerInput
									allowZeroDuration
									value={value}
									onConfirm={onChange}
									title="Rest Between Sets"
								>
									<Button
										className={cn(
											"text-center font-medium",
											form.formState.errors[name] &&
												"border-destructive"
										)}
										variant="outline"
										{...field}
									>
										<Text
											className={
												form.formState.errors[name] &&
												"text-destructive"
											}
										>
											{formatDuration(value * 1000)}
										</Text>
									</Button>
								</TimerInput>
							)}
						/>
					</View>
					<Separator />
					<View className="flex flex-col gap-4">
						<SingleLineInput
							control={form.control}
							errorMessage={form.formState.errors.reps?.message}
							name="reps"
							label="Reps"
							render={({ field: { onChange, value, name } }) => (
								<IntegerInput
									value={value}
									onChange={onChange}
									isInvalid={!!form.formState.errors[name]}
									disableDecrement={value <= 1}
								/>
							)}
						/>
						<SingleLineInput
							control={form.control}
							errorMessage={
								form.formState.errors.durationPerRepSeconds
									?.message
							}
							name="durationPerRepSeconds"
							label="Duration per Rep"
							render={({
								field: { onChange, value, name, ...field }
							}) => (
								<TimerInput
									allowZeroDuration
									value={value}
									onConfirm={onChange}
									title="Duration per Rep"
								>
									<Button
										className={cn(
											"text-center font-medium",
											form.formState.errors[name] &&
												"border-destructive"
										)}
										variant="outline"
										{...field}
									>
										<Text
											className={
												form.formState.errors[name] &&
												"text-destructive"
											}
										>
											{formatDuration(value * 1000)}
										</Text>
									</Button>
								</TimerInput>
							)}
						/>
						<SingleLineInput
							control={form.control}
							errorMessage={
								form.formState.errors.restBetweenRepsSeconds
									?.message
							}
							name="restBetweenRepsSeconds"
							label="Rest Between Reps"
							render={({
								field: { onChange, value, name, ...field }
							}) => (
								<TimerInput
									allowZeroDuration
									value={value}
									onConfirm={onChange}
									title="Rest Between Reps"
								>
									<Button
										className={cn(
											"text-center font-medium",
											form.formState.errors[name] &&
												"border-destructive"
										)}
										variant="outline"
										{...field}
									>
										<Text
											className={
												form.formState.errors[name] &&
												"text-destructive"
											}
										>
											{formatDuration(value * 1000)}
										</Text>
									</Button>
								</TimerInput>
							)}
						/>
					</View>
				</View>
				<Separator />
				<View className="flex flex-col gap-1">
					<View className="flex flex-row items-center justify-between">
						<Label
							className={cn(
								"native:text-lg font-semibold",
								(form.formState.errors.weight ||
									form.formState.errors.weightUnit) &&
									"text-destructive"
							)}
						>
							Weight
						</Label>
						<View className="flex w-52 flex-row">
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
											"flex-1 rounded-r-none text-center",
											(form.formState.errors.weight ||
												form.formState.errors
													.weightUnit) &&
												"border-destructive"
										)}
										value={value.toString()}
										onChangeText={(text) => {
											const parsedValue = Number(text);
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
							<Controller
								control={form.control}
								name="weightUnit"
								render={({
									field: {
										onChange,
										value: currentValue,
										...field
									}
								}) => (
									<Select
										className="flex-1"
										value={WEIGHT_UNIT_OPTIONS.find(
											({ value }) =>
												value === currentValue
										)}
										defaultValue={WEIGHT_UNIT_OPTIONS[0]}
										onValueChange={(option) =>
											onChange(option?.value)
										}
										{...field}
									>
										<SelectTrigger
											className={cn(
												"w-full flex-1 rounded-l-none",
												(form.formState.errors.weight ||
													form.formState.errors
														.weightUnit) &&
													"border-destructive"
											)}
										>
											<SelectValue
												className="native:text-lg text-foreground"
												placeholder=""
											/>
										</SelectTrigger>
										<SelectContent
											className="border-none"
											align="end"
											avoidCollisions
										>
											{WEIGHT_UNIT_OPTIONS.map(
												({ label, value }) => (
													<SelectItem
														label={label}
														value={value}
														key={value}
													>
														{label}
													</SelectItem>
												)
											)}
										</SelectContent>
									</Select>
								)}
							/>
						</View>
					</View>
					{(form.formState.errors.weight?.message ||
						form.formState.errors.weightUnit?.message) && (
						<View className="ml-auto w-52">
							<Text className="text-center text-sm text-destructive">
								{form.formState.errors.weight?.message ??
									form.formState.errors.weightUnit?.message}
							</Text>
						</View>
					)}
				</View>
				<Separator />
				<View>
					<FullWidthInput
						control={form.control}
						errorMessage={
							form.formState.errors.description?.message
						}
						label="Description"
						name="description"
						render={({
							field: { onChange, name, ...field },
							formState
						}) => (
							<Textarea
								aria-labelledby={name}
								onChangeText={onChange}
								placeholder="Describe the exercise technique, or any special notes..."
								className={
									formState.errors[name]?.message &&
									"border-destructive"
								}
								{...field}
							/>
						)}
					/>
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

SingleExerciseForm.Loading = LoadingSingleExercise;
