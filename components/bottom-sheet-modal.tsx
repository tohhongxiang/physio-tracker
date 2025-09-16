import {
	BottomSheetBackdrop,
	BottomSheetScrollView,
	BottomSheetView,
	BottomSheetModal as GorhomBottomSheetModal,
	BottomSheetModalProps as GorhomBottomSheetModalProps
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { View } from "react-native";

export type BottomSheetModalRef<T> = GorhomBottomSheetModal<T>;
export interface BottomSheetModalProps<T>
	extends GorhomBottomSheetModalProps<T> {
	scrollable?: boolean; // whether children will be wrapped in a scrollable container
}

// To use together with file:///./../hooks/use-bottom-sheet.ts
// Adding defaults to GorhomBottomSheetModal + don't need to specify BottomSheetView and BottomSheetScrollView in children anymore
const BottomSheetModal = forwardRef<
	BottomSheetModalRef<unknown>,
	BottomSheetModalProps<unknown>
>(function BottomSheetModal(props, ref) {
	const content =
		typeof props.children === "function" ? (
			<props.children />
		) : (
			props.children
		);
	return (
		<GorhomBottomSheetModal
			ref={ref}
			enablePanDownToClose
			handleComponent={() => (
				<View className="flex items-center justify-center rounded-t-xl bg-popover pb-2 pt-4">
					<View className="h-1 w-16 rounded-md bg-muted-foreground" />
				</View>
			)}
			backgroundComponent={null}
			enableOverDrag={false}
			backdropComponent={(props) => (
				<BottomSheetBackdrop
					opacity={1}
					pressBehavior={"close"}
					disappearsOnIndex={-1}
					style={{
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						height: "100%",
						width: "100%"
					}}
					{...props}
				/>
			)}
			{...props}
		>
			<BottomSheetView className="flex flex-col gap-4 bg-popover">
				{props.scrollable ? ( // if scrollable, wrap within scroll view
					<BottomSheetScrollView>{content}</BottomSheetScrollView>
				) : (
					content
				)}
			</BottomSheetView>
		</GorhomBottomSheetModal>
	);
}) as <T>(
	props: BottomSheetModalProps<T> & {
		ref?: React.Ref<BottomSheetModalRef<T>>;
	}
) => JSX.Element;

export default BottomSheetModal;
