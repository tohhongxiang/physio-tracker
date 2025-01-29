import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

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

	return {
		ref: bottomSheetModalRef,
		isOpen: isBottomSheetOpen,
		setIsOpen: (index: number) =>
			setIsBottomSheetOpen(index < 0 ? false : true),
		open,
		close
	};
}
