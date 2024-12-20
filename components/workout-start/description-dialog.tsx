import { ScrollView, View } from "react-native";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "../ui/dialog";
import { Text } from "../ui/text";

export default function DescriptionAlertDialog({
	title = "Description",
	text,
	children
}: {
	title?: string;
	text: string;
	children: React.ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DialogDescription className="max-h-[500px]">
					{/* DialogOverlay is a touchable, which is interfering with ScrollView https://stackoverflow.com/questions/33060859/react-native-touchable-is-disabling-scrollview/49918614#49918614 */}
					<ScrollView>
						<View onStartShouldSetResponder={() => true}>
							<Text>{text}</Text>
						</View>
					</ScrollView>
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button>
							<Text>Close</Text>
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
