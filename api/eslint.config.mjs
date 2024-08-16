import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImportX from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      'import-x': eslintPluginImportX,
    },
  },
  {
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'import-x/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
