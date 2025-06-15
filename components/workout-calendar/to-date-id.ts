import { format } from "date-fns";

export default function toDateId(date: Date) {
	return format(date, "yyyy-MM-dd");
}
