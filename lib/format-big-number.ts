export default function formatBigNumber(
	number: number,
	maxDecimalsForExponentNotation = 2
) {
	const result = number.toString();

	if (result.includes("e")) {
		const [numberPortion, exponentPortion] = result.split("e");
		return (
			parseFloat(numberPortion).toFixed(maxDecimalsForExponentNotation) +
			"e" +
			exponentPortion
		);
	} else {
		return result;
	}
}
