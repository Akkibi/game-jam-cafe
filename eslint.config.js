import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		ignores: ['node_modules', 'dist'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
			eslintConfigPrettier, // disables ESLint rules that conflict with Prettier
		],
		plugins: { prettier },
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: globals.browser,
		},
		rules: {
			'prettier/prettier': 'error',
		},
	},
]);
