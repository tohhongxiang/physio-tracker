const IS_DEV = process.env.APP_VARIANT === "development";

export default {
	name: IS_DEV ? "Physio Tracker (Dev)" : "Physio Tracker",
	slug: "physio-tracker",
	newArchEnabled: true,
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: "physio-tracker",
	userInterfaceStyle: "automatic",
	splash: {
		image: "./assets/images/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff"
	},
	assetBundlePatterns: ["**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: IS_DEV
			? "com.anonymous.physiotracker.dev"
			: "com.anonymous.physiotracker"
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/images/adaptive-icon.png",
			backgroundColor: "#ffffff"
		},
		package: IS_DEV
			? "com.anonymous.physiotracker.dev"
			: "com.anonymous.physiotracker"
	},
	web: {
		bundler: "metro",
		output: "static",
		favicon: "./assets/images/favicon.png"
	},
	plugins: ["expo-router", "expo-av", "expo-sqlite"],
	experiments: {
		typedRoutes: true
	},
	extra: {
		router: {
			origin: false
		},
		eas: {
			projectId: "4fd9f709-455e-4d40-95d2-6e33f80c2771"
		}
	}
};
