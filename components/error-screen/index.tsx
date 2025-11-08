import { useNavigation } from "expo-router";
import {
	ChevronsUpDown,
	RotateCcw,
	TriangleAlert,
	Undo2
} from "lucide-react-native";
import { useState } from "react";
import { View, ViewProps } from "react-native";

import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "../ui/collapsible";

interface ErrorScreenProps extends ViewProps {
	headerText?: string;
	descriptionText?: string;
	error?: Error;
	onRetry: () => void;
	showBackButton?: boolean;
}

export default function ErrorScreen({
	headerText = "Oops! Something went wrong.",
	descriptionText = "Something went wrong while loading the page. Please try again or come back later.",
	error,
	onRetry,
	showBackButton = true,
	className,
	...props
}: ErrorScreenProps) {
	const navigation = useNavigation();

	const [open, setOpen] = useState(false);
	return (
		<View
			{...props}
			className={cn(
				"flex flex-1 flex-col items-center justify-start gap-8 p-4",
				className
			)}
		>
			<View className="flex flex-col items-center justify-center gap-2">
				<Icon
					as={TriangleAlert}
					size={96}
					className="text-muted-foreground"
				/>
				<View>
					{headerText && (
						<Text className="text-lg text-center font-semibold">
							{headerText}
						</Text>
					)}
					{descriptionText && (
						<Text className="text-muted-foreground">
							{descriptionText}
						</Text>
					)}
				</View>
			</View>

			<View className="flex flex-row gap-4 w-full">
				<Button
					className="flex flex-row gap-2 flex-1 items-center justify-center"
					onPress={onRetry}
				>
					<Icon as={RotateCcw} />
					<Text>Try Again</Text>
				</Button>
				{showBackButton && (
					<Button
						variant="outline"
						className="flex flex-row gap-2 flex-1 items-center justify-center"
						onPress={() => navigation.goBack()}
					>
						<Icon as={Undo2} />
						<Text>Go back</Text>
					</Button>
				)}
			</View>
			{error && (
				<View className="flex flex-row gap-4 w-full">
					<Collapsible
						className="w-full"
						open={open}
						onOpenChange={setOpen}
					>
						<CollapsibleTrigger asChild>
							<Button
								variant="secondary"
								className={cn(
									"flex flex-row gap-2 w-full justify-start bg-secondary/50",
									open && "rounded-b-none"
								)}
							>
								<Icon as={ChevronsUpDown} />
								<Text>Technical Details</Text>
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="p-4 border border-secondary/50 rounded-b-md border-t-0">
							<Text className="text-destructive">
								{error.message}
							</Text>
						</CollapsibleContent>
					</Collapsible>
				</View>
			)}
		</View>
	);
}
