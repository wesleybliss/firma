const globals = require('globals')
const eslintJs = require('@eslint/js')
const stylistic = require('@stylistic/eslint-plugin-js')
const reactPlugin = require('eslint-plugin-react')
const reactCompiler = require('eslint-plugin-react-compiler')
const reactHooksPlugin = require('eslint-plugin-react-hooks')
const indentEmptyLinesPlugin = require('eslint-plugin-indent-empty-lines')
const parseESLintRulesPlugin = require('./config/eslint/parse-eslint-rules')

// @todo investigate these
// https://github.com/dustinspecker/awesome-eslint
// https://github.com/github/eslint-plugin-github
// https://github.com/sindresorhus/eslint-plugin-unicorn
// https://github.com/francoismassart/eslint-plugin-tailwindcss

// Turn this on while developing for extra hints, but
// disable before committing, since it generates tons of warnings
const strictMode = false

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
    
    // global ignores
    {
        ignores: [
            'dist/**',
            'build/**',
            'node_modules/**',
            'src/assets/typedefs/**',
        ],
    },
    
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest', // Needed or JSX breaks
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                process: 'readonly',
                Logger: 'readonly',
            },
        },
        plugins: {
            react: reactPlugin,
            // 'react-compiler': reactCompiler,
            'react-hooks': reactHooksPlugin,
            '@stylistic': stylistic,
            'indent-empty-lines': indentEmptyLinesPlugin,
            parse: parseESLintRulesPlugin,
        },
        settings: {
            react: {
                version: 'detect', // You can add this if you get a warning about the React version when you lint
            },
        },
        rules: {
            ...eslintJs.configs.recommended.rules,
            // 'react-compiler/react-compiler': 'error',
            ...Object.keys(parseESLintRulesPlugin.rules).reduce((acc, it) => ({
                ...acc,
                [`parse/${it}`]: ['error'],
            }), {}),
            
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            
            'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': strictMode ? 'error' : 'off', // @todo nice to have eventually
            'react/jsx-no-literals': 'off',
            'react/jsx-closing-bracket-location': ['error', 'after-props'],
            
            'no-restricted-globals': ['error', 'document'],
            
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
            'indent': [
                'error',
                4,
                {
                    SwitchCase: 1,
                },
            ],
            'linebreak-style': [
                'error',
                'unix',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'never',
            ],
            'arrow-parens': ['error', 'as-needed'],
            'lines-between-class-members': ['error', 'always', { 'exceptAfterSingleLine': true }],
            'comma-dangle': ['error', 'always-multiline'],
            'max-len': ['error', { 'code': 120 }],
            'block-spacing': ['error', 'always'],
            'space-before-blocks': ['error', 'always'],
            'indent-empty-lines/indent-empty-lines': ['error', 4],
            'keyword-spacing': ['error', { 'before': true, 'after': true }],
            '@stylistic/padding-line-between-statements': [
                'error',
                // { blankLine: 'always', prev: '*', next: 'return' }, // @todo nice to have
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: 'directive', next: '*' },
                { blankLine: 'any', prev: 'directive', next: 'directive' },
                { blankLine: 'always', prev: 'block-like', next: '*' },
                { blankLine: 'always', prev: '*', next: 'block-like' },
                { blankLine: 'always', prev: 'function', next: '*' },
                { blankLine: 'always', prev: '*', next: 'function' },
                { blankLine: 'always', prev: 'class', next: '*' },
                { blankLine: 'always', prev: '*', next: 'class' },
                { blankLine: 'always', prev: 'export', next: '*' },
                { blankLine: 'any', prev: '*', next: 'export' },
                { blankLine: 'always', prev: 'import', next: '*' },
                { blankLine: 'any', prev: 'import', next: 'import' },
            ],
            'radix': ['error', 'always'],
            'no-eq-null': 'error',
            'object-curly-spacing': ['error', 'always'],
            'keyword-spacing': ['error', {
                before: true,
                after: true,
            }],
        },
    },
    
]
