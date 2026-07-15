import fsd from '@feature-sliced/steiger-plugin';
import { defineConfig } from 'steiger';

/**
 * Steiger 설정 — FSD 아키텍처 경계를 CI에서 강제한다.
 *
 * 실행: `npx steiger ./apps/devlog/src`. Next 라우팅은 루트 app/ 에 두어 스캔 대상에서 제외된다.
 *
 * pages 레이어는 _pages 접두사로 둔다. Next 16은 src/pages를 루트 app/과 무관하게
 * Pages Router로 인식해 빌드가 실패하므로(pages/app 폴더 충돌), _pages로 이를 회피한다.
 * Steiger는 커스텀 레이어명을 지원하지 않아 _pages를 typo로 잡으므로, 아래에서
 * typo-in-layer-name 규칙만 _pages에 한정해 끈다. 나머지 FSD 검사는 _pages에도 그대로 적용된다.
 *
 * 심각도 원칙: 아키텍처 경계를 깨는 위반은 error(빌드 차단), 개발 흐름을 막으면 안 되는
 * 구조적 신호는 warn. 죽은 코드 자체는 knip이 error로 따로 잡는다.
 *
 * recommended 스프레드는 FSD 플러그인을 등록하는 역할이다. 아래 rules 는 심각도를
 * 명시적으로 확정해, 각 규칙을 의식적으로 이 값으로 정했음을 파일에 드러낸다.
 */
export default defineConfig([
  ...fsd.configs.recommended,
  {
    rules: {
      // ── 의존성 경계 (error) ──
      // 상위 레이어 import·같은 레이어 슬라이스 간 참조 금지. FSD의 핵심.
      'fsd/forbidden-imports': 'error',
      // 슬라이스 내부 파일 직접 import(public API 우회) 금지.
      'fsd/no-public-api-sidestep': 'error',
      // 같은 슬라이스는 상대경로, 슬라이스 경계를 넘으면 절대경로. 일관성 + 리팩터링 안정성.
      // recommended 기본 비활성 → 일관성을 위해 의도적으로 활성화.
      'fsd/import-locality': 'error',

      // ── Public API (error) ──
      // 각 슬라이스가 index.ts 공개 API를 갖도록 강제.
      'fsd/public-api': 'error',
      // 레이어 레벨엔 index 파일을 두지 않는다.
      'fsd/no-layer-public-api': 'error',

      // ── 슬라이스 구조 (error, 단 insignificant-slice만 warn) ──
      // 세그먼트 없는 슬라이스 금지.
      'fsd/no-segmentless-slices': 'error',
      // sliced 레이어에 세그먼트를 직접 두는 것 금지.
      'fsd/no-segments-on-sliced-layers': 'error',
      // shared/lib 에 정리 안 된 모듈이 너무 많이 쌓이는 것 금지.
      'fsd/shared-lib-grouping': 'error',
      // 슬라이스 과다 분할 금지.
      'fsd/excessive-slicing': 'error',
      // 참조가 적은(0~1개) 슬라이스 신호. 참조 0개만 잡고 싶지만 규칙이 0/1개를 분리하지
      // 않으므로, 개발 중 생기는 "참조 1개" 슬라이스가 빌드를 막지 않도록 warn.
      // 진짜 죽은 코드(참조 0개)는 knip이 error로 확실히 잡는다.
      'fsd/insignificant-slice': 'warn',

      // ── 네이밍 (error) ──
      // shared 세그먼트 이름과 겹치는 슬라이스명 금지.
      'fsd/ambiguous-slice-names': 'error',
      // 슬라이스 이름 복수형 일관성.
      'fsd/inconsistent-naming': 'error',
      // 반복적 네이밍 패턴 방지.
      'fsd/repetitive-naming': 'error',
      // 레이어 이름 오타 방지. _pages는 아래에서 files-scoped로 예외 처리한다.
      'fsd/typo-in-layer-name': 'error',
      // 세그먼트를 본질이 아니라 목적으로 묶도록.
      'fsd/segments-by-purpose': 'error',

      // ── 레이어 특정 (error) ──
      // app 레이어에 ui 세그먼트 금지.
      'fsd/no-ui-in-app': 'error',
      // deprecated된 processes 레이어 금지.
      'fsd/no-processes': 'error',
      // 세그먼트 하위에 예약 이름 폴더 금지.
      'fsd/no-reserved-folder-names': 'error',
    },
  },
  {
    // _pages 접두사 레이어만 typo 검사에서 제외한다. Next의 src/pages 라우터 충돌을
    // 피하려면 접두사가 필요하고, Steiger는 커스텀 레이어명을 지원하지 않으므로
    // 이 규칙만 끈다. Steiger는 _pages를 여전히 pages 레이어로 인식해 나머지 검사는 적용된다.
    // 패턴은 모노레포 경로(apps/devlog/src/_pages)에도 맞도록 **/_pages/** 로 둔다.
    files: ['**/_pages/**'],
    rules: {
      'fsd/typo-in-layer-name': 'off',
    },
  },
]);
