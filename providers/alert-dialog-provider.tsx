import { VariantProps } from "class-variance-authority";
import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState
} from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

type AlertOptions<T> = {
	title?: string;
	description?: string;
	actionText?: string;
	cancelText?: string;
	loadingText?: string;
	variant?: VariantProps<typeof buttonVariants>["variant"];
	onConfirm?: () => T | Promise<T>;
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => unknown;
	onCancel?: () => unknown;
};

const DialogContext = createContext<{
	alert: <T>(options: AlertOptions<T>) => void;
}>({ alert: () => {} });

const DEFAULT_TITLE = "";
const DEFAULT_DESCRIPTION = "";
const DEFAULT_ACTION_TEXT = "Confirm";
const DEFAULT_CANCEL_TEXT = "Cancel";
const DEFAULT_LOADING_TEXT = "Loading...";
const DEFAULT_VARIANT = "default";

function DEFAULT_CONFIRM_HANDLER() {}

function DEFAULT_SUCCESS_HANDLER() {}

function DEFAULT_CANCEL_HANDLER() {}

function DEFAULT_ERROR_HANDLER() {}

type AlertDialogUIState = {
	title: string;
	description: string;
	actionText: string;
	cancelText: string;
	loadingText: string;
	variant: VariantProps<typeof buttonVariants>["variant"];
};

export default function AlertDialogProvider({
	children
}: React.PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [state, setState] = useState<AlertDialogUIState>({
		title: DEFAULT_TITLE,
		description: DEFAULT_DESCRIPTION,
		actionText: DEFAULT_ACTION_TEXT,
		cancelText: DEFAULT_CANCEL_TEXT,
		loadingText: DEFAULT_LOADING_TEXT,
		variant: DEFAULT_VARIANT
	});

	const onConfirmRef = useRef<() => unknown>(DEFAULT_CONFIRM_HANDLER);
	const onSuccessRef = useRef<(data: unknown) => void>(
		DEFAULT_SUCCESS_HANDLER
	);
	const onErrorRef = useRef<(e: Error) => void>(DEFAULT_ERROR_HANDLER);
	const onCancelRef = useRef<() => void>(DEFAULT_CANCEL_HANDLER);

	const handleAlert = useCallback(
		<T,>({
			title,
			description,
			actionText,
			cancelText,
			loadingText,
			variant,
			onConfirm,
			onSuccess,
			onError,
			onCancel
		}: AlertOptions<T>) => {
			setState({
				title: title ?? DEFAULT_TITLE,
				description: description ?? DEFAULT_DESCRIPTION,
				actionText: actionText ?? DEFAULT_ACTION_TEXT,
				cancelText: cancelText ?? DEFAULT_CANCEL_TEXT,
				loadingText: loadingText ?? DEFAULT_LOADING_TEXT,
				variant: variant ?? DEFAULT_VARIANT
			});

			onConfirmRef.current = onConfirm ?? DEFAULT_CONFIRM_HANDLER;
			onSuccessRef.current =
				(onSuccess as (data: unknown) => void) ??
				DEFAULT_SUCCESS_HANDLER;
			onErrorRef.current = onError ?? DEFAULT_ERROR_HANDLER;
			onCancelRef.current = onCancel ?? DEFAULT_CANCEL_HANDLER;

			setIsOpen(true);
		},
		[]
	);

	async function handleDialogAction() {
		try {
			let result: ReturnType<typeof onConfirmRef.current>;
			const possiblePromise = onConfirmRef.current();
			if (possiblePromise instanceof Promise) {
				setIsLoading(true);
				result = await possiblePromise;
			}

			setIsOpen(false);

			onSuccessRef.current(result);
		} catch (e) {
			if (e instanceof Error) {
				onErrorRef.current(e);
			} else {
				onErrorRef.current(new Error(`Unspecified error`));
			}
		}

		setIsLoading(false);
	}

	return (
		<DialogContext.Provider value={{ alert: handleAlert }}>
			{children}
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent className="native:max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle>{state.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{state.description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-row justify-end">
						<AlertDialogCancel
							onPress={onCancelRef.current}
							disabled={isLoading}
						>
							<Text>{state.cancelText}</Text>
						</AlertDialogCancel>
						<Button
							onPress={handleDialogAction}
							variant={state.variant}
							disabled={isLoading}
						>
							<Text>
								{isLoading
									? state.loadingText
									: state.actionText}
							</Text>
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</DialogContext.Provider>
	);
}

export function useAlertDialog() {
	const { alert } = useContext(DialogContext);
	return alert;
}
