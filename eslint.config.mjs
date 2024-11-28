import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ["tailwind.config.js"]
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
	},
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		ignores: ["node_modules/*"],
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off"
		}
	},
	{
		settings: { react: { version: "detect" } }
	}
];
