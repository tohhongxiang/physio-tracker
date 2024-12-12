import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { Controller } from "react-hook-form";
import { cn } from "~/lib/utils";
import { View } from "react-native";
import { FormStepProps } from "./form-step-props";

export default function WorkoutDetailsForm({ control, errors }: FormStepProps) {
	return (
		<View className="flex flex-col gap-4">
			<View>
				<Label
					nativeID="name"
					className={cn(
						"mb-2",
						errors.name?.message && "text-destructive"
					)}
				>
					Name
				</Label>
				<Controller
					control={control}
					name="name"
					render={({ field: { onChange, ...field } }) => (
						<Input
							aria-labelledby="name"
							onChangeText={onChange}
							{...field}
						/>
					)}
				/>
				{errors.name && (
					<Text className="text-destructive">
						{errors.name.message}
					</Text>
				)}
			</View>
			<View>
				<Label
					nativeID="workoutDescription"
					className={cn(
						"mb-2",
						errors.description?.message && "text-destructive"
					)}
				>
					Description
				</Label>
				<Controller
					control={control}
					name="description"
					render={({ field: { onChange, ...field } }) => (
						<Textarea
							aria-labelledby="workoutDescription"
							onChangeText={onChange}
							{...field}
						/>
					)}
				/>
				{errors.description && (
					<Text className="text-destructive">
						{errors.description.message}
					</Text>
				)}
			</View>
		</View>
	);
}
