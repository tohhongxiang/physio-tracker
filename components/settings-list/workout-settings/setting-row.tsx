import { View } from "react-native";

import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface SettingRowProps {
	label: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
}

export default function SettingRow({
	label,
	description,
	children,
	className
}: SettingRowProps) {
	return (
		<View
			className={cn(
				"flex flex-row items-center justify-between gap-4",
				className
			)}
		>
			<View className="flex-1">
				<Label className="text-base">{label}</Label>
				{description && (
					<Text className="text-sm text-muted-foreground">
						{description}
					</Text>
				)}
			</View>
			<View>{children}</View>
		</View>
	);
}
