/**
 * Stack — 콘텐츠를 수직·수평으로 배치하는 레이아웃 기본 요소.
 *
 * 데코레이션 없이 그대로 내보낸다. 래퍼가 연결 지점을 소유하는 것이 목적이며,
 * 자체 인터페이스 정의는 필요해질 때만 한다(CONVENTIONS의 승격 기준 참조).
 *
 * 주의: direction은 'vertical' | 'horizontal'이고, gap은 임의의 px가 아니라
 * SpacingStep(0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10) 토큰이다.
 */
export { Stack } from '@astryxdesign/core';

export type { StackProps } from '@astryxdesign/core';
