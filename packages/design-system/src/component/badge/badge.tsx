import type { BadgeProps as VendorBadgeProps } from '@astryxdesign/core';
import type { CSSProperties, ReactElement } from 'react';

import { Badge as VendorBadge } from '@astryxdesign/core';

/**
 * 배지의 무게.
 *
 * 사양이 「채운 것」과 「옅은 것」 둘을 요구하는데 벤더에는 그 축이 없다 —
 * `variant`는 색 이름(`neutral` · `info` · …)이지 무게가 아니다.
 */
export type BadgeTone = 'filled' | 'pale';

export interface BadgeProps extends Omit<VendorBadgeProps, 'className'> {
  /** CSS 모듈의 클래스는 `string | undefined`로 나온다 */
  className?: string | undefined;
  /**
   * 기본은 채운 것. 옅은 것은 곁가지로 읽혀야 하는 자리에 쓴다.
   * @default 'filled'
   */
  tone?: BadgeTone;
  /**
   * 옅은 면의 색.
   *
   * **계산하지 않는다.** 처음에는 글자색에서 `color-mix`로 만들었는데, 그러면 시안이
   * 손으로 고른 값이 사라진다. 색을 손으로 고른 데에는 이유가 있다 — 계산이 대비를
   * 못 맞춘다. 흰 면 위 기본 초록이 2.99라 텍스트 단계를 쓰기로 한 판단이, 계산에
   * 맡기면 그대로 지워진다.
   *
   * 상태마다 색이 달라지는 자리에서는 이 프롭을 비우고 부르는 쪽 스타일시트가
   * `--ads-badge-surface`를 정한다 — 상태에 따라 갈리는 값은 값이 아니라 관계다.
   * Card의 여백과 같은 갈림이다.
   */
  surface?: string;
}

/**
 * 배지.
 *
 * 옅은 무게는 클래스 하나로 표현한다. 벤더가 `astryx-badge`라는 안정적인 클래스를
 * 일부러 노출하고 그 스타일은 `@layer astryx-base` 안에 있다 — 레이어 밖인 우리
 * 선언이 특이도 싸움 없이 이긴다.
 */
export const Badge = ({
  tone = 'filled',
  surface,
  className,
  style,
  ...rest
}: BadgeProps): ReactElement => {
  const merged =
    surface === undefined ? style : ({ ...style, '--ads-badge-surface': surface } as CSSProperties);

  const props = {
    ...rest,
    className: [tone === 'pale' ? 'ads-badge-pale' : '', className].filter(Boolean).join(' '),
    ...(merged === undefined ? {} : { style: merged }),
  } as VendorBadgeProps;

  return <VendorBadge {...props} />;
};
