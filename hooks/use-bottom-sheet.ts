import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, NativeEventSubscription } from "react-native";

// To be used with file:///./../components/bottom-sheet-modal.tsx
export function useBottomSheet() {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const [isOpen, setIsOpen] = useState(false);

	useFocusEffect(
		useCallback(() => {
			// close bottom sheet if leaving page
			return () => bottomSheetModalRef.current?.close();
		}, [])
	);

	const open = useCallback(() => {
		setIsOpen(true);
		bottomSheetModalRef.current?.present();
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		bottomSheetModalRef.current?.close();
	}, []);

	const backHandlerSubscriptionRef = useRef<NativeEventSubscription | null>(
		null
	);
	useEffect(() => {
		if (isOpen && !backHandlerSubscriptionRef.current) {
			backHandlerSubscriptionRef.current = BackHandler.addEventListener(
				"hardwareBackPress",
				() => {
					bottomSheetModalRef.current?.dismiss();
					return true;
				}
			);
		}

		return () => {
			backHandlerSubscriptionRef.current?.remove(); // remove event listener and clean up
			backHandlerSubscriptionRef.current = null;
		};
	}, [isOpen]);

	const onChange = useCallback((index: number) => {
		const isBottomSheetOpen = index >= 0;
		setIsOpen(isBottomSheetOpen);
	}, []);

	return {
		ref: bottomSheetModalRef,
		isOpen,
		onChange,
		open,
		close
	};
}
