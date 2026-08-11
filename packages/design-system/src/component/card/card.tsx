import type { CardProps as VendorCardProps } from '@astryxdesign/core';
import type { CSSProperties, ReactElement } from 'react';

import { Card as VendorCard } from '@astryxdesign/core';

/**
 * 카드 위에서 일어나는 교환.
 *
 * `exchange`는 선이 사라지고 공간이 생기는 것이다 — 테두리를 지우고 그림자를 넣는다.
 * 값 하나가 아니라 상태에 걸린 여러 값이라 프롭으로는 이름만 받고 뜻은 스타일시트가 든다.
 */
export type CardHover = 'none' | 'exchange';

export type { CardVariant } from '@astryxdesign/core';

export interface CardProps extends Omit<VendorCardProps, 'className' | 'padding'> {
  /**
   * CSS 모듈의 클래스는 `string | undefined`로 나온다. 그것을 못 받으면 이 저장소가
   * 스타일을 쓰는 방식과 래퍼가 어긋난다.
   */
  className?: string | undefined;

  /**
   * 안쪽 여백.
   *
   * 벤더 스텝(0 · 0.5 · 1 … 10)을 그대로 받고, **스케일에 칸이 없는 값은 px 수로** 받는다.
   * 카드 패딩 18이 그런 값이다 — 4는 16이고 5는 20이라 사이가 없다.
   *
   * 이것은 모양이 아니라 값이라 프롭이 맞다. 대역마다 달라지는 여백(20 → 18)은 값이 아니라
   * 관계라서 여기 넣지 않는다 — 부르는 쪽이 `className`으로 미디어 쿼리를 쓴다.
   */
  padding?: VendorCardProps['padding'] | number;
  /**
   * 커서가 올라갔을 때.
   * @default 'none'
   */
  hover?: CardHover;
}

/** 스텝인지 px 수인지. 스텝은 벤더에게 넘기고 px는 우리가 든다 */
const STEPS = new Set([0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10]);

/**
 * 카드.
 *
 * 면(배경 · 테두리 · 라운드 · elevation)은 벤더가 든다. 우리는 벤더가 표현하지 못하는
 * 것만 얹는다 — 스케일 밖 여백과 호버 교환.
 *
 * **자손 호버는 프롭으로 만들지 않는다.** 「카드에 커서가 오면 제목에 밑줄」은 값이 아니라
 * 관계이고, 관계는 선택자로만 적힌다. 부르는 쪽이 `className`을 주고 제 스타일시트에
 * `.내카드:hover .제목`을 쓴다 — 이 래퍼는 `className`을 뿌리 엘리먼트에 그대로 넘긴다.
 */
export const Card = ({
  padding,
  hover = 'none',
  className,
  style,
  ...rest
}: CardProps): ReactElement => {
  // 스텝은 전부 수다. 수가 아니면 안 적은 것이다
  const isStep = typeof padding === 'number' && STEPS.has(padding);
  const rawPadding = typeof padding === 'number' && !STEPS.has(padding) ? padding : undefined;

  const merged =
    rawPadding === undefined
      ? style
      : ({ ...style, '--ads-card-padding': `${String(rawPadding)}px` } as CSSProperties);

  /*
   * 프롭을 한 번에 모아 넘긴다.
   *
   * 구조분해하고 다시 펼치면 옵셔널이 `T | undefined`로 넓어져
   * `exactOptionalPropertyTypes`에 걸린다. 확인하지 않은 값에 모양을 주장하는 단언이
   * 아니라, 벤더가 준 제 프롭을 그대로 되돌려주는 자리다 — 그래서 한 번만 단언한다.
   */
  const vendorProps = {
    ...rest,
    className: [
      rawPadding === undefined ? '' : 'ads-card-padding',
      hover === 'exchange' ? 'ads-card-hover-exchange' : '',
      className,
    ]
      .filter(Boolean)
      .join(' '),
    ...(merged === undefined ? {} : { style: merged }),
    ...(isStep ? { padding } : {}),
  } as VendorCardProps;

  return <VendorCard {...vendorProps} />;
};
