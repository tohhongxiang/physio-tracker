import { Text } from "~/components/ui/text";

export default function SpecialExerciseErrorDisplay({
	errors
}: {
	errors: string[];
}) {
	return errors.map((error, index) => (
		<Text key={index} className="text-destructive">
			{error}
		</Text>
	));
}
