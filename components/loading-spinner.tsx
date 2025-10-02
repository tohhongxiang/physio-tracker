import { LoaderCircle } from "lucide-react-native";
import { View } from "react-native";

import { Icon } from "~/components/ui/icon";
import { cn } from "~/lib/utils";

type LoadingSpinnerProps = {
	className?: string;
	iconClassName?: string;
	size?: number;
};

export function LoadingSpinner({
	className,
	iconClassName,
	size
}: LoadingSpinnerProps) {
	return (
		<View className={cn("animate-spin", className)}>
			<Icon as={LoaderCircle} className={iconClassName} size={size} />
		</View>
	);
}
