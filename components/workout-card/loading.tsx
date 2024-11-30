import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function LoadingWorkoutCard() {
	return (
		<Card className="w-full max-w-md">
			<CardHeader className="flex flex-row items-center justify-between">
				<Skeleton className="h-8 w-full" />
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
			</CardContent>
			<CardFooter>
				<Skeleton className="h-8 w-full" />
			</CardFooter>
		</Card>
	);
}
