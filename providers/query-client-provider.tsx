import {
	MutationCache,
	QueryClient,
	QueryClientProvider as TanstackQueryClientProvider
} from "@tanstack/react-query";

const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onSuccess: () => {
			queryClient.invalidateQueries();
		}
	})
});

export default function QueryClientProvider({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
		</TanstackQueryClientProvider>
	);
}
