import { LucideIcon, Trash } from "lucide-react-native";
import { useCallback } from "react";
import { View } from "react-native";

import { LoadingSpinner } from "~/components/loading-spinner";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import {
	AlertOptions,
	useAlertDialog
} from "~/providers/alert-dialog-provider";

type DeleteAlertOptions<T> = Omit<
	AlertOptions<T>,
	"actionContent" | "loadingContent" | "variant"
> & {
	actionIcon?: LucideIcon;
	actionText?: React.ReactNode | string;
	loadingIcon?: LucideIcon;
	loadingText?: React.ReactNode | string;
};

export default function useDeleteAlert() {
	const alert = useAlertDialog();

	return useCallback(
		<T,>({
			title,
			description,
			actionIcon,
			actionText,
			loadingIcon,
			loadingText,
			onConfirm,
			onSuccess,
			onError,
			onCancel
		}: DeleteAlertOptions<T>) => {
			const actionContent =
				typeof actionText === "string" || actionText == null ? (
					<View className="flex flex-row gap-2 items-center justify-center">
						<Icon
							as={actionIcon ?? Trash}
							className="text-destructive-foreground"
						/>
						<Text>{actionText ?? "Delete"}</Text>
					</View>
				) : (
					actionText
				);

			const loadingContent =
				typeof loadingText === "string" || loadingText == null ? (
					<View className="flex flex-row gap-2 items-center justify-center">
						{loadingIcon ? (
							<Icon
								as={loadingIcon}
								className="text-destructive-foreground"
							/>
						) : (
							<LoadingSpinner iconClassName="text-destructive-foreground" />
						)}
						<Text>{loadingText ?? "Loading"}</Text>
					</View>
				) : (
					loadingText
				);

			alert({
				variant: "destructive",
				title,
				description,
				actionContent,
				loadingContent,
				onConfirm,
				onSuccess,
				onError,
				onCancel
			});
		},
		[alert]
	);
}
