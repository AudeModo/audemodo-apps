import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

/**
 * 테스트 실행기에도 `@/` 별칭을 알려준다.
 *
 * 지금까지 테스트가 슬라이스 안에서만 상대경로로 끝나 필요가 없었지만, 슬라이스 경계를
 * 넘는 모듈은 절대경로로 import하도록 되어 있어(fsd/import-locality) 별칭 없이는
 * 그 모듈을 테스트할 수 없다. 별칭은 tsconfig의 paths와 같은 곳을 가리켜야 한다.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // 죽은 코드 검사기도 이 목록을 읽어 테스트 파일을 진입점으로 삼는다.
    // 적어두지 않으면 테스트가 「아무도 안 쓰는 파일」로 잡힌다.
    include: ['src/**/*.test.ts'],
  },
});
