import { Info, LoaderCircle, Trash } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "~/components/ui/dialog";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import useDeleteAll from "~/hooks/api/use-delete-all";
import useDeleteAlert from "~/hooks/use-delete-alert";

export default function DeleteAllDataDialog({
	children
}: {
	children: React.ReactNode;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const { isLoading, deleteAll } = useDeleteAll({
		onSuccess: (deletedResult) => {
			toast(
				`Deleted ${deletedResult.workouts} workouts, ${deletedResult.pinned} pinned, ${deletedResult.logs} logs`
			);
			setIsOpen(false);
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	const alert = useDeleteAlert();
	function handleSubmit() {
		alert({
			title: "Delete All Data?",
			description:
				"This action is permanent. Are you sure to want to delete all your data?",
			actionText: "Delete all data",
			loadingText: "Deleting",
			onConfirm: async () => {
				await new Promise<void>((res) => setTimeout(() => res(), 100));
				await deleteAll();
			},
			onSuccess: () => {
				setIsOpen(false);
			}
		});
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete All Data</DialogTitle>
					<View className="bg-destructive rounded-md p-4 flex flex-col gap-2 mt-2">
						<View className="flex flex-row gap-2 items-center">
							<Icon
								as={Info}
								className="text-destructive-foreground h-6 w-6"
							/>
							<Text className="text-destructive-foreground font-bold">
								This will delete all existing data
							</Text>
						</View>
						<Text className="opacity-80 text-destructive-foreground">
							Your current workouts, logs, and pinned workouts
							will be permanently deleted. This process is
							IRREVERSIBLE.
						</Text>
					</View>
				</DialogHeader>
				<DialogFooter className="flex flex-row justify-end">
					<DialogClose asChild>
						<Button variant="outline" className="flex-1">
							<Text>Cancel</Text>
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						className="flex-1 flex flex-row gap-2 justify-center items-center"
						onPress={handleSubmit}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<View className="animate-spin">
									<Icon
										as={LoaderCircle}
										className="text-primary-foreground"
										size={16}
									/>
								</View>
								<Text>Loading</Text>
							</>
						) : (
							<>
								<Icon
									as={Trash}
									className="text-primary-foreground"
									size={16}
								/>
								<Text>Delete</Text>
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
