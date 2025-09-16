import {
	Control,
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues
} from "react-hook-form";
import { View } from "react-native";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

import { Text } from "../../../ui/text";

export default function SingleLineInput<
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
			<View className="flex flex-row items-center justify-between gap-1">
				<Text
					className={cn(
						"text-lg font-medium",
						errorMessage && "text-destructive"
					)}
					id="weight"
				>
					{label}
				</Text>
				<Controller
					control={control}
					name={name}
					render={
						render
							? (renderParams) => (
									<View className="w-52">
										{render(renderParams)}
									</View>
								)
							: ({
									field: { onChange, name, ...field },
									formState
								}) => (
									<View className="w-52">
										<Input
											aria-labelledby={name}
											className={
												formState.errors[name]
													?.message &&
												"border-destructive"
											}
											onChangeText={onChange}
											{...field}
										/>
									</View>
								)
					}
				/>
			</View>
			{errorMessage && (
				<View className="ml-auto w-52">
					<Text className="text-center text-sm text-destructive">
						{errorMessage}
					</Text>
				</View>
			)}
		</View>
	);
}
