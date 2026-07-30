import { createBaseConfig } from '@audemodo/eslint-config';
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * devlog ESLint 설정 — 공통 베이스(@audemodo/eslint-config) 위에 Next 전용 규칙과
 * FSD 레이어 import 순서를 얹는다.
 *
 * Next는 eslint-config-next 프리셋 대신 @next/eslint-plugin-next를 직접 쓴다. 프리셋은
 * react·hooks·a11y·import 플러그인을 자체 버전으로 등록해 우리가 고른 버전과 충돌하기 때문이다.
 */

/** FSD 레이어 순서로 import를 정렬한다. pages는 `_pages` 접두사를 반영. */
const FSD_IMPORT_GROUPS = [
  'type-import',
  ['value-builtin', 'value-external'],
  'app',
  'pages',
  'widgets',
  'features',
  'entities',
  'shared',
  ['value-parent', 'value-sibling', 'value-index'],
  'side-effect',
  'unknown',
];

const FSD_IMPORT_CUSTOM_GROUPS = [
  { groupName: 'app', elementNamePattern: '^@/_app' },
  { groupName: 'pages', elementNamePattern: '^@/_pages' },
  { groupName: 'widgets', elementNamePattern: '^@/widgets' },
  { groupName: 'features', elementNamePattern: '^@/features' },
  { groupName: 'entities', elementNamePattern: '^@/entities' },
  { groupName: 'shared', elementNamePattern: '^@/shared' },
];

export default defineConfig([
  ...createBaseConfig({
    tsconfigRootDir: import.meta.dirname,
    importGroups: FSD_IMPORT_GROUPS,
    importCustomGroups: FSD_IMPORT_CUSTOM_GROUPS,
  }),

  // ── 그룹 6: Next.js (프리셋 위 조정) ──
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@next/next': next },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-page-custom-font': 'error',
    },
  },

  // eslint-config-prettier — 포맷 관련 ESLint 규칙을 일괄로 꺼 Prettier와 충돌을 차단한다.
  // 반드시 맨 뒤에 둔다.
  prettier,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
