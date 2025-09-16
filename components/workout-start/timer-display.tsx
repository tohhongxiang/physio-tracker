import { TextProps } from "react-native";

import { Text } from "~/components/ui/text";
import formatDuration from "~/lib/format-duration";
import { cn } from "~/lib/utils";

interface TimerDisplayProps extends TextProps {
	durationMs: number;
}

export default function TimerDisplay({
	durationMs,
	...props
}: TimerDisplayProps) {
	return (
		<Text {...props} className={cn("text-7xl font-bold", props.className)}>
			{formatDuration(durationMs, 2)}
		</Text>
	);
}
