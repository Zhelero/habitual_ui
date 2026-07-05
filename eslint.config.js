import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        // App source: browser globals + React-specific rules.
        files: ['src/**/*.{js,jsx}'],
        extends: [
            js.configs.recommended,
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // This codebase doesn't use PropTypes (no runtime prop validation
            // anywhere), so enforcing it now would mean annotating every
            // component from scratch rather than fixing an actual bug.
            'react/prop-types': 'off',
        },
    },
    {
        // Playwright tests + root config files: plain Node scripts, no JSX,
        // no React. react-hooks would otherwise misfire on Playwright's own
        // `use` fixture parameter (matches the "useX" hook-naming heuristic),
        // and browser globals don't include Node's `process`/`require`.
        files: ['e2e/**/*.js', '*.config.js'],
        extends: [js.configs.recommended],
        languageOptions: {
            globals: globals.node,
        },
    },
])
