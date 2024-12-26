import { View } from "react-native";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";

const SELECT_OPTIONS = [
	{ label: "Name", value: "name" },
	{ label: "Date created", value: "dateCreated" }
];

export default function TestPage() {
	const [selectedValue, setSelectedValue] = useState<
		(typeof SELECT_OPTIONS)[number] | undefined
	>(SELECT_OPTIONS[0]);

	return (
		<View className="flex flex-col gap-2 p-8">
			<Label>Sort By:</Label>
			<Select value={selectedValue} onValueChange={setSelectedValue}>
				<SelectTrigger>
					<SelectValue
						className="native:text-lg text-sm text-foreground"
						placeholder="Placeholder"
					/>
				</SelectTrigger>
				<SelectContent className="pr-4">
					{SELECT_OPTIONS.map((option) => (
						<SelectItem
							key={option.value}
							label={option.label}
							value={option.value}
						>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</View>
	);
}
