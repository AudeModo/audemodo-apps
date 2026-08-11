/*
 * 버튼.
 *
 * 위계 셋(강조 · 기본 · 조용함)이 벤더의 `primary` · `secondary` · `ghost`에 그대로 맞는다.
 * 색은 브랜드 토큰이 정하므로 여기서 더할 것이 없다 — 그래서 재수출 그대로 둔다.
 *
 * 감쌀 것이 없는데 감싸면 그 층이 무엇을 하는지 다음 사람이 매번 확인해야 한다.
 */
export { Button } from '@astryxdesign/core';

export type { ButtonProps, ButtonVariant } from '@astryxdesign/core';
