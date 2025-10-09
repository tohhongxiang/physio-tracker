import { prettifyError } from "zod";

import { ExportData, ExportDataSchema } from "~/db/dto";

type ValidationResult =
	| { error: Error; data: null }
	| { error: null; data: ExportData };
export default function validateBackupData(data: unknown): ValidationResult {
	if (
		!data ||
		typeof data !== "object" ||
		!(data as Record<string, unknown>)["data"]
	) {
		return { data: null, error: new Error("Invalid backup file") };
	}

	const { data: validatedExportData, error } =
		ExportDataSchema.safeParse(data);
	if (error) {
		return { data: null, error: new Error(prettifyError(error)) };
	}

	return { data: validatedExportData, error: null };
}
