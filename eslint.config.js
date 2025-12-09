import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: [
            'dist',
            'build',
            'node_modules',
            'src/components/ui/**',
        ],
    },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                process: 'readonly',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'react/prop-types': 'off',
            'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
            'react/jsx-closing-bracket-location': ['error', 'after-props'],
            'react/react-in-jsx-scope': 'off', // React is automatically in scope with Vite
            'react-hooks/exhaustive-deps': 'warn',

            // Restricted syntax rules
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'JSXAttribute[ name.name="className" ] > JSXExpressionContainer' +
                        '> TemplateLiteral > TemplateElement[source.raw*="z-"]',
                    message: 'Avoid using Tailwind z-index classes in JSX.',
                },
                {
                    selector: 'JSXAttribute[ name.name="style" ] > JSXExpressionContainer' +
                        '> ObjectExpression > Property[key.name="zIndex"] > Literal',
                    message: 'Avoid using Tailwind z-index values directly in style props.',
                },
                {
                    selector: 'CallExpression[callee.name="setSearchParams"] > ObjectExpression',
                    message: 'Use the callback syntax for setSearchParams.',
                },
            ],

            // Code quality rules
            'no-restricted-globals': ['error', 'document'],
            'radix': ['error', 'always'],
            'no-eq-null': 'error',
            'object-curly-spacing': ['error', 'always'],
            '@typescript-eslint/no-explicit-any': 'off', // Allow explicit any types

            // Style rules (built-in ESLint)
            'indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                },
            ],
            'linebreak-style': ['error', 'unix'],
            'quotes': ['error', 'single'],
            'semi': ['error', 'never'],
            'arrow-parens': ['error', 'as-needed'],
            'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
            'comma-dangle': ['error', 'always-multiline'],
            'max-len': ['error', { 'code': 120 }],
            'block-spacing': ['error', 'always'],
            'space-before-blocks': ['error', 'always'],
            'keyword-spacing': ['error', { 'before': true, 'after': true }]
        },
    },
]