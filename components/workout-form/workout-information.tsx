import { Controller } from "react-hook-form";
import { View } from "react-native";
import { toast } from "sonner-native";
import { ZodError, prettifyError } from "zod";

import { cn } from "~/lib/utils";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";
import useWorkoutForm from "./use-workout-form";

export default function WorkoutInformation({
	form,
	onSuccessfulSubmit,
	onGoToPreviousStep
}: {
	form: ReturnType<typeof useWorkoutForm>;
	onSuccessfulSubmit: () => void;
	onGoToPreviousStep: () => void;
}) {
	async function handleSubmit() {
		try {
			const isValid = await form.trigger(["name", "description"]);

			if (!isValid) {
				return;
			}

			onSuccessfulSubmit();
		} catch (error) {
			if (error instanceof ZodError) {
				toast.error(prettifyError(error));
			} else if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Unexpected error");
			}
		}
	}

	return (
		<View className="flex h-full flex-col gap-4 p-4">
			<View className="flex flex-col gap-2">
				<Label
					nativeID="name"
					className={
						form.formState.errors.name?.message &&
						"text-destructive"
					}
				>
					Title
				</Label>
				<Controller
					control={form.control}
					name="name"
					render={({ field: { onChange, ...field } }) => (
						<Input
							aria-labelledby="name"
							onChangeText={onChange}
							className={
								form.formState.errors.name?.message &&
								"border-destructive"
							}
							{...field}
						/>
					)}
				/>
				{form.formState.errors.name && (
					<Text className="text-destructive">
						{form.formState.errors.name.message}
					</Text>
				)}
			</View>
			<View className="flex flex-col gap-2">
				<Label
					nativeID="description"
					className={
						form.formState.errors.description?.message &&
						"text-destructive"
					}
				>
					Description
				</Label>
				<Controller
					control={form.control}
					name="description"
					render={({ field: { onChange, ...field } }) => (
						<Textarea
							aria-labelledby="description"
							numberOfLines={8}
							className={cn(
								"max-h-64",
								form.formState.errors.description?.message &&
									"border-destructive"
							)}
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
			<View>
				<Text className="text-destructive">
					{form.formState.errors.root?.message}
				</Text>
			</View>
			<View className="mt-auto flex flex-row gap-4">
				<Button
					onPress={onGoToPreviousStep}
					variant="secondary"
					className="flex-1"
				>
					<Text>Cancel</Text>
				</Button>
				<Button onPress={handleSubmit} className="flex-1">
					<Text>Next</Text>
				</Button>
			</View>
		</View>
	);
}
