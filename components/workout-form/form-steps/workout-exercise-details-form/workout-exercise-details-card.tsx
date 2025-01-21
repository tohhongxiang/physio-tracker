import { View } from "react-native";
import TimerInput from "~/components/timer-input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import formatDuration from "~/lib/format-duration";
import {
	Control,
	Controller,
	FieldArrayWithId,
	FieldErrors,
	UseFieldArrayMove,
	UseFieldArrayRemove
} from "react-hook-form";
import { cn } from "~/lib/utils";
import { ChevronUp } from "~/lib/icons/ChevronUp";
import { ChevronDown } from "~/lib/icons/ChevronDown";
import { WorkoutFormSchemaType } from "../../schema";
import getSpecialExerciseErrorMessages from "./get-special-exercise-error-messages";
import SpecialExerciseErrorDisplay from "./special-exercise-error-display";

export default function WorkoutExerciseDetailsCard({
	errors,
	index,
	control,
	fields,
	move,
	remove
}: {
	errors: FieldErrors<WorkoutFormSchemaType>;
	control: Control<WorkoutFormSchemaType>;
	index: number;
	fields: FieldArrayWithId<WorkoutFormSchemaType>[];
	move: UseFieldArrayMove;
	remove: UseFieldArrayRemove;
}) {
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
							errors.exercises?.[index]?.name?.message &&
								"text-destructive"
						)}
					>
						Name
					</Label>
					<Controller
						control={control}
						name={`exercises.${index}.name`}
						render={({ field: { onChange, ...field } }) => (
							<Input
								aria-labelledby="name"
								placeholder="Name"
								onChangeText={onChange}
								{...field}
							/>
						)}
					/>
					{errors.exercises?.[index]?.name?.message && (
						<Text className="text-destructive">
							{errors.exercises?.[index]?.name?.message}
						</Text>
					)}
				</View>
				<View>
					<Label
						nativeID="description"
						className={cn(
							"mb-2",
							errors.exercises?.[index]?.description?.message &&
								"text-destructive"
						)}
					>
						Description
					</Label>
					<Controller
						control={control}
						name={`exercises.${index}.description`}
						render={({ field: { onChange, ...field } }) => (
							<Textarea
								aria-labelledby="description"
								placeholder="Description"
								onChangeText={onChange}
								{...field}
							/>
						)}
					/>
				</View>
				<View className="flex flex-row flex-wrap items-center gap-2 py-2">
					<View className="flex flex-row items-center justify-center gap-1 text-center">
						<Controller
							control={control}
							name={`exercises.${index}.sets`}
							render={({
								field: { value, onChange, onBlur }
							}) => (
								<Input
									keyboardType="number-pad"
									className={cn(
										"w-16",
										errors.exercises?.[index]?.sets &&
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
								field: { onChange, onBlur, value }
							}) => (
								<Input
									keyboardType="number-pad"
									className={cn(
										"w-16",
										errors.exercises?.[index]?.reps &&
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
							render={({ field: { onChange, value } }) => (
								<TimerInput
									value={value}
									onConfirm={onChange}
									allowZeroDuration
								>
									<Button variant="outline">
										<Text>
											{formatDuration(value * 1000)}
										</Text>
									</Button>
								</TimerInput>
							)}
						/>
						<Text className="text-lg"> per rep</Text>
					</View>
				</View>
				<View className="flex flex-row flex-wrap items-center gap-2 py-2">
					<View className="flex flex-row items-center justify-center gap-2 text-center">
						<Text className="text-lg">Rest</Text>
						<Controller
							control={control}
							name={`exercises.${index}.restBetweenRepsSeconds`}
							render={({ field: { onChange, value } }) => (
								<TimerInput
									value={value}
									onConfirm={onChange}
									allowZeroDuration
								>
									<Button variant="outline">
										<Text>
											{formatDuration(value * 1000)}
										</Text>
									</Button>
								</TimerInput>
							)}
						/>
						<Text className="text-lg"> per rep,</Text>
					</View>
					<View className="flex flex-row items-center justify-center gap-1 text-center">
						<Controller
							control={control}
							name={`exercises.${index}.restBetweenSetsSeconds`}
							render={({ field: { onChange, value } }) => (
								<TimerInput
									value={value}
									onConfirm={onChange}
									allowZeroDuration
								>
									<Button variant="outline">
										<Text>
											{formatDuration(value * 1000)}
										</Text>
									</Button>
								</TimerInput>
							)}
						/>
						<Text className="text-lg"> per set</Text>
					</View>
				</View>
				{specialErrors.length > 0 ? (
					<View>
						<SpecialExerciseErrorDisplay errors={specialErrors} />
					</View>
				) : null}
			</CardContent>
			<CardFooter className="flex justify-between">
				<View className="flex flex-row">
					<Button
						className="rounded-r-none"
						disabled={fields.length === 1 || index === 0}
						onPress={() => move(index, index - 1)}
					>
						<ChevronUp className="text-primary-foreground" />
					</Button>
					<Button
						className="rounded-l-none"
						disabled={
							fields.length === 1 || index === fields.length - 1
						}
						onPress={() => move(index, index + 1)}
					>
						<ChevronDown className="text-primary-foreground" />
					</Button>
				</View>
				<Button variant="destructive" onPress={() => remove(index)}>
					<Text>Delete</Text>
				</Button>
			</CardFooter>
		</Card>
	);
}
