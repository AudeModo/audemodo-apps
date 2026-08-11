import type { BadgeProps as VendorBadgeProps } from '@astryxdesign/core';
import type { ReactElement } from 'react';

import { Badge as VendorBadge } from '@astryxdesign/core';

/**
 * 배지의 무게.
 *
 * 사양이 「채운 것」과 「옅은 것」 둘을 요구하는데 벤더에는 그 축이 없다 —
 * `variant`는 색 이름(`neutral` · `info` · …)이지 무게가 아니다.
 *
 * 그래서 여기서 축을 하나 더 준다. 색은 벤더의 `variant`가 그대로 정하고, 무게만
 * 우리가 얹는다 — 색까지 다시 정하면 벤더 테마를 바꿀 때 두 곳이 어긋난다.
 */
export type BadgeTone = 'filled' | 'pale';

export interface BadgeProps extends VendorBadgeProps {
  /**
   * 기본은 채운 것. 옅은 것은 곁가지로 읽혀야 하는 자리에 쓴다.
   * @default 'filled'
   */
  tone?: BadgeTone;
}

/**
 * 배지.
 *
 * 옅은 무게는 클래스 하나로 표현한다. 벤더가 `astryx-badge`라는 안정적인 클래스와
 * `data-variant`를 일부러 노출하고(`themeProps`), 그 스타일은 `@layer astryx-base`
 * 안에 있다 — 레이어 밖인 우리 선언이 특이도 싸움 없이 이긴다.
 */
export const Badge = ({ tone = 'filled', className, ...rest }: BadgeProps): ReactElement => (
  <VendorBadge
    className={[tone === 'pale' ? 'ads-badge-pale' : '', className].filter(Boolean).join(' ')}
    {...rest}
  />
);
