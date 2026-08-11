import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

/**
 * 테스트 실행기에도 `@/` 별칭을 알려준다.
 *
 * 지금까지 테스트가 슬라이스 안에서만 상대경로로 끝나 필요가 없었지만, 슬라이스 경계를
 * 넘는 모듈은 절대경로로 import하도록 되어 있어(fsd/import-locality) 별칭 없이는
 * 그 모듈을 테스트할 수 없다. 별칭은 tsconfig의 paths와 같은 곳을 가리켜야 한다.
 *
 * ── `server-only`
 *
 * 두 번째 별칭이 그것이다. 자세한 것은 아래.
 */

/**
 * `server-only`를 테스트에서만 빈 모듈로 바꾼다.
 *
 * 그 패키지는 조건부 export다 — `react-server` 조건이 없는 곳에서 import되면 던진다.
 * 클라이언트 번들에 섞이는 것을 막는 것이 그 일이고, 실제로 그 일을 하는 곳은 빌드다
 * (배럴이 하이라이터를 끌고 간 것을 그렇게 잡았다). 테스트 실행기는 클라이언트 번들이
 * 아니므로 여기서 던지면 서버 전용 모듈은 영영 테스트할 수 없다.
 *
 * 그 패키지가 `react-server` 조건에서 내주는 빈 파일을 그대로 가리킨다 — 우리가 빈
 * 모듈을 새로 만들면 그것이 또 하나의 지켜야 할 파일이 된다.
 *
 * 전역 `resolve.conditions`에 `react-server`를 넣는 방법도 있지만 그러면 React까지
 * 다른 빌드로 풀린다. 이 모듈 하나만 바꾼다.
 */
const serverOnlyEmpty = join(
  dirname(createRequire(import.meta.url).resolve('server-only')),
  'empty.js',
);

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'server-only': serverOnlyEmpty,
    },
  },
  test: {
    // 죽은 코드 검사기도 이 목록을 읽어 테스트 파일을 진입점으로 삼는다.
    // 적어두지 않으면 테스트가 「아무도 안 쓰는 파일」로 잡힌다.
    include: ['src/**/*.test.ts'],
  },
});
