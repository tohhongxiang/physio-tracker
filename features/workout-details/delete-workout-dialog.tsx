import { Button } from "~/components/ui/button";
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
import { Text } from "~/components/ui/text";

export default function DeleteWorkoutDialog({
	children,
	onDeleteConfirm
}: {
	children: React.ReactNode;
	onDeleteConfirm: () => unknown;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="mx-8 sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete Workout?</DialogTitle>
					<DialogDescription>
						This action is permanent. You will lose all data
						regarding this workout.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex flex-row justify-end gap-2">
					<DialogClose asChild>
						<Button variant="secondary">
							<Text>Cancel</Text>
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="destructive" onPress={onDeleteConfirm}>
							<Text>Delete</Text>
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
