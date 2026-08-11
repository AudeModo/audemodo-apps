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

/**
 * 벤더 격리.
 *
 * 앱은 래퍼(`@audemodo/design-system`)만 부른다. 지금까지는 사람이 grep으로 확인했는데,
 * 그건 기억해야 도는 검사다 — 잊으면 그냥 통과한다. 린트가 잡으면 머지가 막힌다.
 *
 * **이 파일이 저장소에서 벤더 이름이 적히는 유일한 앱 쪽 자리다.** 규칙을 쓰려면
 * 이름을 적을 수밖에 없다. 대신 이 검사가 grep을 대신하므로 앱 소스(`src` · `app`)는
 * 여전히 0건이어야 하고, 그것을 이제 린트가 지킨다.
 *
 * 이 규칙을 공통 설정(`@audemodo/eslint-config`)에 두지 않는 이유 — design-system은
 * 벤더를 부르는 것이 제 일이다. 공통에 얹으면 래퍼가 제 일을 못 한다.
 */
const VENDOR_ISOLATION = {
  group: ['@astryxdesign', '@astryxdesign/*'],
  message: '벤더를 직접 부르지 않는다. @audemodo/design-system 래퍼를 쓴다.',
};

/**
 * 슬라이스 안쪽으로 들어가는 import 금지.
 *
 * Steiger는 `apps/devlog/src`만 훑는다. 루트 `app/`은 그 밖이라 지금까지 규율로만
 * 지켰다 — 라우트가 슬라이스 내부 파일을 바로 집어도 아무도 막지 않았다.
 *
 * 허용되는 깊이는 둘이다: 공개 API(`@/entities/post`)와 서버 전용 공개
 * API(`@/entities/post/server`). 그보다 깊으면 그 슬라이스가 무엇을 감췄는지가
 * 무의미해진다.
 */
const NO_DEEP_SLICE_IMPORT = {
  group: ['@/*/*/*', '@/*/*/*/**', '!@/*/*/server'],
  message:
    '슬라이스 안쪽을 직접 부르지 않는다. 공개 API(@/<레이어>/<슬라이스>)나 서버 전용 공개 API(.../server)를 쓴다.',
};

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

  // ── 그룹 7: import 경계 ──
  //
  // 두 블록이 같은 규칙 이름을 쓴다. 플랫 설정은 뒤엣것이 앞엣것을 통째로 덮으므로
  // app/ 블록에 벤더 패턴을 함께 싣는다 — 빼면 라우트에서만 격리가 풀린다.
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [VENDOR_ISOLATION] }],
    },
  },

  {
    files: ['app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [VENDOR_ISOLATION, NO_DEEP_SLICE_IMPORT] }],
    },
  },

  // eslint-config-prettier — 포맷 관련 ESLint 규칙을 일괄로 꺼 Prettier와 충돌을 차단한다.
  // 반드시 맨 뒤에 둔다.
  prettier,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
