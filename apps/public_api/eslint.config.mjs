import eslintParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/type-annotation-spacing': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: { delimiter: 'semi', requireLast: true },
          singleline: { delimiter: 'semi', requireLast: false },
        },
      ],
      'prettier/prettier': [
        'error',
        {
          semi: true,
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          endOfLine: 'lf',
        },
      ],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'no-unused-vars': 'warn',
      'no-console': 'off',
      curly: ['error', 'multi'],
      eqeqeq: ['error', 'always'],
      'no-throw-literal': 'error',
      strict: ['error', 'never'],
      'max-params': ['error', 4],
      complexity: ['error', { max: 10 }],
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      'max-statements': ['error', 15],
      'no-magic-numbers': 'off',
      'no-implicit-globals': 'error',
      'prefer-promise-reject-errors': 'error',
      'no-await-in-loop': 'error',
      'no-return-await': 'error',
      'no-duplicate-imports': 'error',
      'no-use-before-define': 'error',
    },
    ignores: ['node_modules/', 'dist/', '*.min.js', 'coverage/'],
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
];
