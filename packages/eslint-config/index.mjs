import stylex from '@stylexjs/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/**
 * 워크스페이스 공통 ESLint 베이스 — 코드 품질·타입 안전성·import 정렬·React·접근성·
 * 빈 줄 정책·StyleX를 담당한다. 프레임워크 전용 규칙(Next 등)은 소비자가 얹는다.
 *
 * 역할 분담: 아키텍처 경계는 Steiger, 죽은 코드는 knip, 순수 포맷은 Prettier가 맡는다.
 * ESLint는 그 사이의 "코드 품질·의미 있는 규칙"을 담당한다.
 *
 * 인라인 eslint-disable은 쓰지 않는다. 규칙이 마찰을 일으키면 그 줄을 끄지 말고
 * 전역 심각도를 바꾼다.
 *
 * import 정렬 그룹은 소비자마다 다르므로(앱은 FSD 레이어 순서, 라이브러리는 기본)
 * 파라미터로 받는다.
 */

/** 라이브러리·일반 패키지용 import 정렬 그룹. */
export const DEFAULT_IMPORT_GROUPS = [
  'type-import',
  ['value-builtin', 'value-external'],
  ['value-parent', 'value-sibling', 'value-index'],
  'side-effect',
  'unknown',
];

/**
 * 공통 베이스 설정을 만든다.
 *
 * @param tsconfigRootDir 타입 인식 규칙이 tsconfig를 찾는 기준 경로(소비자의 import.meta.dirname).
 * @param importGroups perfectionist import 정렬 그룹.
 * @param importCustomGroups 위 그룹에서 참조하는 커스텀 그룹 정의.
 */
export function createBaseConfig({
  tsconfigRootDir,
  importGroups = DEFAULT_IMPORT_GROUPS,
  importCustomGroups = [],
}) {
  return [
    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          // 타입 정보가 필요한 규칙(no-floating-promises 등)을 위해 tsconfig를 물린다.
          projectService: true,
          tsconfigRootDir,
        },
      },
      settings: {
        react: { version: 'detect' },
      },
      plugins: {
        '@typescript-eslint': tseslint.plugin,
        'react-hooks': reactHooks,
        react,
        'jsx-a11y': jsxA11y,
        perfectionist,
        'import-x': importX,
        '@stylistic': stylistic,
        '@stylexjs': stylex,
      },
      rules: {
        // ── 프리셋 베이스 (뒤의 우리 규칙이 덮어쓸 수 있게 먼저) ──
        ...jsxA11y.flatConfigs.recommended.rules,

        // ── 그룹 1: 코어 품질·함수형 ──
        'prefer-const': 'error',
        'no-var': 'error',
        'no-param-reassign': 'error',
        eqeqeq: ['error', 'always'],
        'no-nested-ternary': 'error',
        'no-console': 'warn',
        'object-shorthand': 'error',
        'prefer-template': 'error',
        'prefer-arrow-callback': 'error',
        'no-else-return': 'error',
        'no-unused-expressions': 'error',
        curly: ['error', 'all'],
        'no-implicit-coercion': 'error',
        'prefer-destructuring': 'off',
        // for-in 금지 — 프로토타입 체인 순회 위험, Object.keys/배열 메서드를 쓴다.
        'no-restricted-syntax': [
          'error',
          {
            selector: 'ForInStatement',
            message: 'for-in 대신 Object.keys/entries 또는 배열 메서드를 사용한다.',
          },
        ],

        // ── 그룹 2: TypeScript ──
        // 코어 no-unused-vars는 끄고 TS판을 쓴다(타입 전용 import 등을 정확히 다룬다).
        'no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/no-empty-function': 'warn',
        '@typescript-eslint/ban-ts-comment': 'error',
        // [TC] 타입 정보 필요
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/require-await': 'warn',
        // 외부 데이터 방어 코드와 마찰 가능 — 짦으면 전역 warn으로 내린다(개별 예외 금지).
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',

        // ── 그룹 3: import 관리 ──
        // 정렬은 perfectionist. 그룹 순서는 소비자가 주입한다.
        // 경로 스타일(상대/절대)는 건드리지 않는다 — 그건 Steiger import-locality의 영역이다.
        'perfectionist/sort-imports': [
          'error',
          { groups: importGroups, customGroups: importCustomGroups },
        ],
        'perfectionist/sort-named-imports': 'error',
        'perfectionist/sort-exports': 'error',
        'perfectionist/sort-named-exports': 'error',
        // 위생 — 정렬이 아니라서 perfectionist와 공존 안전.
        'import-x/no-duplicates': 'error',
        'import-x/no-cycle': 'error',
        'import-x/no-self-import': 'error',
        'import-x/no-useless-path-segments': 'error',
        // import 블록 뒤 빈 줄은 이 규칙이 담당한다(그룹 7 padding-line과 중복 안 되게 여기서만).
        'import-x/newline-after-import': 'error',

        // ── 그룹 4: React / Hooks / JSX (react-hooks v6 전체 + 엄선) ──
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'react-hooks/purity': 'error',
        'react-hooks/immutability': 'error',
        'react-hooks/set-state-in-render': 'error',
        'react-hooks/set-state-in-effect': 'error',
        'react-hooks/refs': 'error',
        'react-hooks/globals': 'error',
        'react-hooks/static-components': 'error',
        'react-hooks/error-boundaries': 'error',
        'react-hooks/preserve-manual-memoization': 'error',
        'react-hooks/component-hook-factories': 'error',
        'react-hooks/use-memo': 'error',
        'react-hooks/config': 'error',
        'react-hooks/gating': 'error',
        'react-hooks/incompatible-library': 'error',
        'react-hooks/unsupported-syntax': 'error',
        'react/jsx-key': 'error',
        'react/no-unstable-nested-components': 'error',
        // 콘텐츠에서 마찰 후보 — 자주 걸리면 전역 off로 내리는 것을 검토.
        'react/no-unescaped-entities': 'error',

        // ── 그룹 5: 접근성 (recommended 베이스 위 조정) ──
        'jsx-a11y/control-has-associated-label': 'error',
        'jsx-a11y/no-noninteractive-tabindex': 'error',
        'jsx-a11y/no-static-element-interactions': 'error',
        'jsx-a11y/no-noninteractive-element-interactions': 'error',
        'jsx-a11y/no-autofocus': 'error',
        'jsx-a11y/anchor-is-valid': 'error',

        // ── 그룹 7: 빈 줄 정책 (@stylistic — Prettier가 안 하는 것만) ──
        '@stylistic/padding-line-between-statements': [
          'error',
          { blankLine: 'always', prev: '*', next: 'return' },
          { blankLine: 'always', prev: ['const', 'let'], next: '*' },
          { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
          { blankLine: 'always', prev: 'function', next: '*' },
          { blankLine: 'always', prev: '*', next: 'function' },
          { blankLine: 'always', prev: '*', next: 'export' },
          { blankLine: 'always', prev: 'block-like', next: '*' },
        ],

        // ── 그룹 8: StyleX ──
        // sort-keys는 allowLineSeparatedGroups로 미디어쿼리 순서를 보호한다.
        '@stylexjs/valid-styles': 'error',
        '@stylexjs/sort-keys': ['error', { allowLineSeparatedGroups: true, minKeys: 2 }],
        '@stylexjs/valid-shorthands': 'error',
        '@stylexjs/no-unused': 'error',
        '@stylexjs/no-legacy-contextual-styles': 'error',
        '@stylexjs/enforce-extension': 'error',
      },
    },
  ];
}
