module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint/eslint-plugin"],
	extends: [
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"prettier/@typescript-eslint",
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	rules: {
		"no-console": "warn",
		"@typescript-eslint/explicit-function-return-type": ["warn"],
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": ["error", { ignoreRestArgs: true }],
		"@typescript-eslint/explicit-member-accessibility": ["error"],
		"@typescript-eslint/typedef": [
			"warn",
			{
				parameter: true,
				propertyDeclaration: true,
				variableDeclaration: true,
			},
		],
	},
	ignorePatterns: [".eslintrc.js"],
};
