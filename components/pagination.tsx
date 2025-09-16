import { View } from "react-native";

import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { ChevronsLeft } from "~/lib/icons/ChevronsLeft";
import { ChevronsRight } from "~/lib/icons/ChevronsRight";

import { Button } from "./ui/button";
import { Text } from "./ui/text";

export default function Pagination({
	currentPage,
	pageLimit,
	dataCount,
	onGoToPreviousPage,
	onGoToNextPage,
	onGoToPage
}: {
	currentPage: number;
	pageLimit: number;
	dataCount: number;
	onGoToPreviousPage: () => void;
	onGoToNextPage: () => void;
	onGoToPage: (page: number) => void;
}) {
	const numberOfPages = Math.ceil(dataCount / pageLimit);

	return (
		<View className="flex flex-col gap-2">
			<View className="flex flex-row items-center justify-center gap-2">
				<Button
					onPress={() => onGoToPage(0)}
					variant="ghost"
					className="aspect-square"
					disabled={currentPage <= 0}
				>
					<ChevronsLeft className="text-foreground" />
				</Button>
				<Button
					onPress={onGoToPreviousPage}
					variant="ghost"
					className="aspect-square"
					disabled={currentPage <= 0}
				>
					<ChevronLeft className="text-foreground" />
				</Button>
				<Button>
					<Text>{currentPage + 1}</Text>
				</Button>
				<Button
					onPress={onGoToNextPage}
					variant="ghost"
					className="aspect-square rounded-full"
					disabled={currentPage >= numberOfPages - 1}
				>
					<ChevronRight className="text-foreground" />
				</Button>
				<Button
					onPress={() => onGoToPage(numberOfPages - 1)}
					variant="ghost"
					className="aspect-square"
					disabled={currentPage >= numberOfPages - 1}
				>
					<ChevronsRight className="text-foreground" />
				</Button>
			</View>
			<Text className="text-center text-sm text-muted-foreground">
				{currentPage * pageLimit + 1} -{" "}
				{Math.min((currentPage + 1) * pageLimit, dataCount)} of{" "}
				{dataCount} {dataCount === 1 ? "item" : "items"}
			</Text>
		</View>
	);
}
