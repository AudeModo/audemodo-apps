import { createBaseConfig } from '@audemodo/eslint-config';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * design-system ESLint 설정 — 공통 베이스를 그대로 쓴다.
 *
 * 이 패키지는 프레임워크를 모르므로 Next 전용 규칙을 얹지 않는다.
 * import 정렬도 FSD 레이어가 아닌 기본 그룹을 쓴다(라이브러리라 FSD 대상이 아니다).
 */
export default defineConfig([
  ...createBaseConfig({ tsconfigRootDir: import.meta.dirname }),

  prettier,

  globalIgnores(['dist/**']),
]);
