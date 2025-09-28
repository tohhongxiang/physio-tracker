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

export default function ImportDataDialog({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">
							<Text>Cancel</Text>
						</Button>
					</DialogClose>
					<Button>
						<Text>Save changes</Text>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
