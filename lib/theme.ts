import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";

export const THEME = {
	light: {
		background: "hsl(210 40% 98.0392%)",
		foreground: "hsl(217.2414 32.5843% 17.451%)",
		card: "hsl(0 0% 100%)",
		cardForeground: "hsl(217.2414 32.5843% 17.451%)",
		popover: "hsl(0 0% 100%)",
		popoverForeground: "hsl(217.2414 32.5843% 17.451%)",
		primary: "hsl(234 96% 70%)",
		primaryForeground: "hsl(0 0% 100%)",
		secondary: "hsl(220 13.0435% 90.9804%)",
		secondaryForeground: "hsl(216.9231 19.1176% 26.6667%)",
		muted: "hsl(220 14.2857% 95.8824%)",
		mutedForeground: "hsl(220 8.9362% 46.0784%)",
		accent: "hsl(226.4516 100% 93.9216%)",
		accentForeground: "hsl(216.9231 19.1176% 26.6667%)",
		destructive: "hsl(0 84.2365% 60.1961%)",
		destructiveForeground: "hsl(0 0% 100%)",
		border: "hsl(216 12.1951% 83.9216%)",
		input: "hsl(216 12.1951% 83.9216%)",
		ring: "hsl(238.7324 83.5294% 66.6667%)",
		radius: "0.5rem",
		chart1: "hsl(12 76% 61%)",
		chart2: "hsl(173 58% 39%)",
		chart3: "hsl(197 37% 24%)",
		chart4: "hsl(43 74% 66%)",
		chart5: "hsl(27 87% 67%)"
	},
	dark: {
		background: "hsl(222.2222 47.3684% 11.1765%)",
		foreground: "hsl(214.2857 31.8182% 91.3725%)",
		card: "hsl(217.2414 32.5843% 17.451%)",
		cardForeground: "hsl(214.2857 31.8182% 91.3725%)",
		popover: "hsl(217.2414 32.5843% 17.451%)",
		popoverForeground: "hsl(214.2857 31.8182% 91.3725%)",
		primary: "hsl(221 83% 53%)",
		primaryForeground: "hsl(0 0% 100%)",
		secondary: "hsl(217.7778 23.0769% 22.9412%)",
		secondaryForeground: "hsl(216 12.1951% 83.9216%)",
		muted: "hsl(217.2414 32.5843% 17.451%)",
		mutedForeground: "hsl(217.8947 10.6145% 64.902%)",
		accent: "hsl(226 83% 82%)",
		accentForeground: "hsl(216.9231 19.1176% 26.6667%)",
		destructive: "hsl(0 68% 59%)",
		destructiveForeground: "hsl(0 0% 100%)",
		border: "hsl(215 13.7931% 34.1176%)",
		input: "hsl(215 13.7931% 34.1176%)",
		ring: "hsl(234.4538 89.4737% 73.9216%)",
		radius: "0.5rem",
		chart1: "hsl(220 70% 50%)",
		chart2: "hsl(160 60% 45%)",
		chart3: "hsl(30 80% 55%)",
		chart4: "hsl(280 65% 60%)",
		chart5: "hsl(340 75% 55%)"
	}
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
	light: {
		...DefaultTheme,
		colors: {
			background: THEME.light.background,
			border: THEME.light.border,
			card: THEME.light.card,
			notification: THEME.light.destructive,
			primary: THEME.light.primary,
			text: THEME.light.foreground
		}
	},
	dark: {
		...DarkTheme,
		colors: {
			background: THEME.dark.background,
			border: THEME.dark.border,
			card: THEME.dark.card,
			notification: THEME.dark.destructive,
			primary: THEME.dark.primary,
			text: THEME.dark.foreground
		}
	}
};
