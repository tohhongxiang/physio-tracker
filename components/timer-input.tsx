import { useEffect, useRef, useState } from "react";
import { TextInput, TouchableWithoutFeedback, View } from "react-native";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

const ZERO_DURATION_INPUT = "000000";
const DEFAULT_TITLE = "Enter Duration";
export default function TimerInput({
	value,
	onConfirm,
	children,
	title = DEFAULT_TITLE,
	description = "",
	allowZeroDuration = false
}: {
	value?: number;
	onConfirm?: (durationSeconds: number) => void;
	children?: React.ReactNode;
	title?: string;
	description?: string;
	allowZeroDuration?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		setText(value ? secondsToInputString(value) : ZERO_DURATION_INPUT);
	}, [isOpen, value]);

	const [text, setText] = useState(
		value ? secondsToInputString(value) : ZERO_DURATION_INPUT
	);
	const inputRef = useRef<TextInput | null>(null);
	function handleFocusInput() {
		inputRef.current?.blur(); // TODO: Do not blur and refocus if already focused
		inputRef.current?.focus();
	}

	function handleChangeText(text: string) {
		// do not allow inputs longer than 6 characters
		if (!text.startsWith("0") && text.length > 6) return;

		// if text contains non-numeric characters, do not continue
		if (!/^\d+$/.test(text)) {
			return;
		}

		setText(text.slice(-6).padStart(6, "0"));
	}

	function handleConfirm() {
		const duration = inputStringToSeconds(text);
		const seconds =
			duration.hours * 3600 + duration.minutes * 60 + duration.seconds;

		onConfirm?.(seconds);
	}

	const durationInput = inputStringToSeconds(text);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{children ? (
					children
				) : (
					<Button>
						<Text>Timer input</Text>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && (
						<DialogDescription>{description}</DialogDescription>
					)}
				</DialogHeader>
				<TouchableWithoutFeedback
					onPress={() => inputRef.current?.blur()}
				>
					<View className="flex flex-col items-center justify-center">
						<TouchableWithoutFeedback
							onPress={handleFocusInput}
							onBlur={() => inputRef.current?.blur()}
						>
							<View className="flex w-full flex-row items-baseline gap-3 px-4 justify-center">
								<View className="flex flex-row items-baseline gap-1">
									<Text className="text-7xl font-bold">
										{durationInput.hours
											.toString()
											.padStart(2, "0")}
									</Text>
									<Text className="text-3xl font-semibold text-muted-foreground">
										h
									</Text>
								</View>
								<View className="flex flex-row items-baseline gap-1">
									<Text className="text-7xl font-bold">
										{durationInput.minutes
											.toString()
											.padStart(2, "0")}
									</Text>
									<Text className="text-3xl font-semibold text-muted-foreground">
										m
									</Text>
								</View>
								<View className="flex flex-row items-baseline gap-1">
									<Text className="text-7xl font-bold">
										{durationInput.seconds
											.toString()
											.padStart(2, "0")}
									</Text>
									<Text className="text-3xl font-semibold text-muted-foreground">
										s
									</Text>
								</View>
							</View>
						</TouchableWithoutFeedback>
						<View>
							<Input
								ref={inputRef}
								value={text}
								onChangeText={handleChangeText}
								keyboardType="number-pad"
								placeholder="00"
								className="native:h-0 native:w-0 left-[300em] h-0 w-0 border-none opacity-0 outline-none p-0 m-0"
								autoFocus
							/>
						</View>
					</View>
				</TouchableWithoutFeedback>
				<DialogFooter className="flex flex-row justify-end gap-2">
					<DialogClose asChild>
						<Button variant="secondary">
							<Text>Cancel</Text>
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							onPress={handleConfirm}
							disabled={
								!allowZeroDuration &&
								text === ZERO_DURATION_INPUT
							}
						>
							<Text>Confirm</Text>
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function inputStringToSeconds(text: string) {
	const seconds = text.slice(-2);
	const minutes = text.slice(-4, -2);
	const hours = text.slice(-6, -4);

	return {
		hours: parseInt(hours),
		minutes: parseInt(minutes),
		seconds: parseInt(seconds)
	};
}

function secondsToInputString(seconds: number) {
	return new Date(seconds * 1000)
		.toISOString()
		.slice(11, 19)
		.replaceAll(":", "");
}
