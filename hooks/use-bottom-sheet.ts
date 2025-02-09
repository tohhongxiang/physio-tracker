import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";

export function useBottomSheet() {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	useFocusEffect(
		useCallback(() => {
			// close bottom sheet if leaving page
			return () => bottomSheetModalRef.current?.close();
		}, [])
	);

	const open = useCallback(() => {
		setIsBottomSheetOpen(true);
		bottomSheetModalRef.current?.present();
	}, []);

	const close = useCallback(() => {
		setIsBottomSheetOpen(false);
		bottomSheetModalRef.current?.close();
	}, []);

	const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
		null
	);
	const setIsOpen = useCallback(
		(index: number) => {
			const isBottomSheetOpen = index >= 0;
			setIsBottomSheetOpen(isBottomSheetOpen);

			// handle back button to dismiss bottom sheet
			if (isBottomSheetOpen && !backHandlerSubscriptionRef.current) {
				// setup the back handler if the bottom sheet is right in front of the user
				backHandlerSubscriptionRef.current =
					BackHandler.addEventListener("hardwareBackPress", () => {
						bottomSheetModalRef.current?.dismiss();
						return true;
					});
			} else if (!isBottomSheetOpen) {
				backHandlerSubscriptionRef.current?.remove(); // remove event listener and clean up
				backHandlerSubscriptionRef.current = null;
			}
		},
		[backHandlerSubscriptionRef]
	);

	return {
		ref: bottomSheetModalRef,
		isOpen: isBottomSheetOpen,
		setIsOpen,
		open,
		close
	};
}
