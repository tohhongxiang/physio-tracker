import { useState } from "react";
import { Text } from "./ui/text";
import { TextProps, View } from "react-native";
import { Button } from "./ui/button";

const DEFAULT_MAX_LINES = 3;
export default function ReadMoreText({
	text,
	maxLines = DEFAULT_MAX_LINES,
	...props
}: {
	text: string;
	maxLines?: number;
} & TextProps) {
	const [requiresExpanding, setRequiresExpanding] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<View className="flex flex-col items-start gap-1">
			<Text
				{...props}
				numberOfLines={isExpanded ? 0 : maxLines}
				className={props.className}
				onTextLayout={(e) =>
					setRequiresExpanding(e.nativeEvent.lines.length > maxLines)
				}
			>
				{text}
			</Text>
			{requiresExpanding ? (
				<Button
					variant="secondary"
					size="sm"
					onPress={() => setIsExpanded((c) => !c)}
				>
					<Text>{isExpanded ? "Show less" : "Read more"}</Text>
				</Button>
			) : null}
		</View>
	);
}
