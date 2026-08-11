import type { TokenProps } from '@astryxdesign/core';
import type { ReactElement } from 'react';

import { Token } from '@astryxdesign/core';

/**
 * 칩.
 *
 * 사양 문서는 이것을 `Token`이라 부르지만 여기서는 `Chip`이다 — 이 패키지에는 이미
 * 디자인 토큰 타입을 내주는 `foundation/token`이 있어서, 같은 이름이 두 뜻을 가지면
 * import 한 줄로는 어느 쪽인지 알 수 없다.
 *
 * ── 벤더가 표현하지 못하는 둘
 *
 * 사양의 네 갈래 중 「제거 가능」(`onRemove`)과 「카운터 결합」(`endContent`)은 벤더가
 * 그대로 준다. 나머지 둘은 없다:
 *
 *   읽기 전용 — 테두리 없이 색 라벨만. 벤더 칩은 늘 테두리를 가진다
 *   선택 가능 — 선택되면 채움이 반전된다. 「선택됨」이라는 상태가 벤더에 없다
 *
 * 둘 다 프롭이 아니라 **모양**이라 클래스로 얹는다. 벤더 스타일은
 * `@layer astryx-base` 안에 있어 레이어 밖인 우리 선언이 이긴다.
 */
export interface ChipProps extends Omit<TokenProps, 'className'> {
  /**
   * CSS 모듈의 클래스는 `string | undefined`로 나온다. 그것을 못 받으면 이 저장소가
   * 스타일을 쓰는 방식과 래퍼가 어긋난다.
   */
  className?: string | undefined;

  /**
   * 테두리를 지운다. 읽기 전용 칩 — 누를 수 없는 것이 눌릴 것처럼 보이면 안 된다.
   * @default false
   */
  isPlain?: boolean;
  /**
   * 선택됨. 채움이 반전된다.
   *
   * 벤더에 이 상태가 없어 `onClick`만으로는 「누를 수 있다」까지만 말할 수 있다.
   * @default false
   */
  isSelected?: boolean;
}

export const Chip = ({
  isPlain = false,
  isSelected = false,
  className,
  ...rest
}: ChipProps): ReactElement => (
  <Token
    className={[isPlain ? 'ads-chip-plain' : '', isSelected ? 'ads-chip-selected' : '', className]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  />
);
