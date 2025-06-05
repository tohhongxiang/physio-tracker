import {
	Control,
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues
} from "react-hook-form";
import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Text } from "../../../ui/text";
import { Input } from "~/components/ui/input";

export default function FullWidthInput<
	TFieldPath extends FieldValues,
	TFieldName extends FieldPath<TFieldPath>
>({
	control,
	errorMessage,
	name,
	label,
	render
}: {
	control: Control<TFieldPath>;
	errorMessage: string | undefined;
	name: TFieldName;
	label: string;
	render?: ControllerProps<TFieldPath, TFieldName>["render"];
}) {
	return (
		<View className="flex flex-col gap-1">
			<Label
				nativeID={name}
				className={cn(
					"native:text-lg",
					errorMessage && "text-destructive"
				)}
			>
				{label}
			</Label>
			<Controller
				control={control}
				name={name}
				render={
					render
						? render
						: ({
								field: { onChange, name, ...field },
								formState
							}) => (
								<Input
									aria-labelledby={name}
									className={
										formState.errors[name]?.message &&
										"border-destructive"
									}
									onChangeText={onChange}
									{...field}
								/>
							)
				}
			/>
			{errorMessage && (
				<Text className="text-sm text-destructive">{errorMessage}</Text>
			)}
		</View>
	);
}
