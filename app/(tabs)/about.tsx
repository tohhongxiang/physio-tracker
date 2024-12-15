import { Text } from "~/components/ui/text";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { useAlertDialog } from "~/providers/alert-dialog-provider";

export default function AboutScreen() {
	const alert = useAlertDialog();
	return (
		<View>
			<Text>About screen</Text>
			<View className="flex flex-col gap-4">
				<Button
					onPress={() =>
						alert({
							title: "asdfasdfasdf",
							description: "Shit",
							actionText: "Delete this now!",
							cancelText: "Please do not delete anything!",
							variant: "destructive",
							onConfirm: async () => {
								console.log("Running promise");
								await new Promise((resolve) =>
									setTimeout(() => resolve(1), 1000)
								);
								console.log("Promise done");
							},
							onSuccess: () => {
								console.log("Succeeded promise");
							}
						})
					}
				>
					<Text>Delete Alert</Text>
				</Button>
				<Button
					onPress={() =>
						alert({
							title: "Bomba",
							description: "Clat",
							onConfirm: async () => {
								await new Promise<void>((resolve) =>
									setTimeout(() => resolve(), 1000)
								);
								throw new Error("Failed");
							},
							onSuccess: async () => {
								console.log("Success");
							},
							onError: (error) => {
								console.log(error.message);
							}
						})
					}
				>
					<Text>Promise with error</Text>
				</Button>
				<Button
					onPress={() =>
						alert({
							title: "Bomba",
							description: "Clat",
							onConfirm: () => {
								console.log("Running action");
							}
						})
					}
				>
					<Text>Test alert</Text>
				</Button>
			</View>
		</View>
	);
}
