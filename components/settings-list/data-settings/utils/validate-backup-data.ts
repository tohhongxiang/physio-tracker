import { prettifyError } from "zod";

import { ExportDataSchema } from "~/db/dto";

export default function validateBackupData(data: unknown): string {
	if (
		!data ||
		typeof data !== "object" ||
		!(data as Record<string, unknown>)["data"]
	) {
		return "Invalid backup file";
	}

	const { error } = ExportDataSchema.safeParse(data);
	if (error) {
		return prettifyError(error);
	}

	return "";
}
