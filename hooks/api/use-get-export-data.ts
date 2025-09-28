import { useQuery } from "@tanstack/react-query";

import getExportData from "~/api/get-export-data";
import { ExportDataOptions } from "~/types";

import { exportDataQueryKeys } from "./query-keys";

export default function useGetExportData(options: ExportDataOptions) {
	return useQuery({
		queryKey: exportDataQueryKeys.filtered(options),
		queryFn: ({ queryKey: [, options] }) => getExportData(options),
		enabled: false
	});
}
