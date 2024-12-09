import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import gitignore from "eslint-config-flat-gitignore";

/** @type {import('eslint').Linter.Config[]} */
export default [
	gitignore(),
	{
		ignores: ["tailwind.config.js"]
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
	},
	{ languageOptions: { globals: { ...globals.browser, ...globals.node } } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	{
		plugins: {
			"react-hooks": eslintPluginReactHooks
		},
		rules: eslintPluginReactHooks.configs.recommended.rules
	},
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
