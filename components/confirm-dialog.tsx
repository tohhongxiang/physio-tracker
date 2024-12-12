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

interface ConfirmDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => unknown;
	title: string;
	description?: string;
	variant?: "default" | "destructive";
	onConfirm?: () => unknown | Promise<unknown>;
	onCancel?: () => unknown;
	confirmText?: string;
	cancelText?: string;
	children?: React.ReactNode;
	isLoading?: boolean;
	loadingText?: string;
}

export default function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	variant,
	onConfirm,
	onCancel,
	confirmText = "Confirm",
	cancelText = "Cancel",
	children,
	isLoading,
	loadingText = "Loading"
}: ConfirmDialogProps) {
	async function handleConfirm() {
		const value = onConfirm?.();
		if (value instanceof Promise) {
			await value;
		}

		onOpenChange?.(false);
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{children ? (
				<DialogTrigger asChild>{children}</DialogTrigger>
			) : null}
			<DialogContent
				className="mx-8 sm:max-w-[425px]"
				onInteractOutside={(e) => {
					if (isLoading) {
						e.preventDefault();
					}
				}}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex flex-row justify-end gap-2">
					<DialogClose asChild>
						<Button
							variant="secondary"
							onPress={onCancel}
							disabled={isLoading}
						>
							<Text>{cancelText}</Text>
						</Button>
					</DialogClose>
					<Button
						variant={variant}
						onPress={handleConfirm}
						disabled={isLoading}
					>
						<Text>{isLoading ? loadingText : confirmText}</Text>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
