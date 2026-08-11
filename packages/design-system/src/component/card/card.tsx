import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactElement } from 'react';

/**
 * 카드 위에서 일어나는 교환.
 *
 * `exchange`는 선이 사라지고 공간이 생기는 것이다 — 테두리를 지우고 그림자를 넣는다.
 * 값 하나가 아니라 상태에 걸린 여러 값이라 프롭으로는 이름만 받고 뜻은 스타일시트가 든다.
 */
export type CardHover = 'none' | 'exchange';

interface CardOwnProps {
  /**
   * 안쪽 여백(px).
   *
   * 적지 않으면 여백을 걸지 않는다 — 대역마다 달라지는 여백(20 → 18)은 값이 아니라
   * 관계라서 부르는 쪽 스타일시트가 든다.
   */
  padding?: number;
  /** @default 'none' */
  hover?: CardHover;
  /** CSS 모듈의 클래스는 `string | undefined`로 나온다 */
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

/**
 * `as`를 제네릭에 묶는다. 묶지 않으면 `as="a"`를 줘도 `href`가 타입에 없다 —
 * 다형성이 이름만 있고 실제로는 `div`인 셈이 된다.
 *
 * **이 프롭 하나 때문에 면을 우리가 그린다.** 벤더 Card는 늘 `div`라 링크 카드를
 * 만들면 링크가 아니게 되고 위젯을 만들면 랜드마크를 잃는다. 다형성에는 우회로가
 * 없다 — 시맨틱을 잃거나 렌더 경로를 둘로 가르거나 둘뿐이다.
 */
export type CardProps<T extends ElementType = 'div'> = { as?: T } & CardOwnProps &
  Omit<ComponentPropsWithoutRef<T>, 'as' | keyof CardOwnProps>;

/**
 * 카드.
 *
 * **면을 우리가 그린다.** 벤더 Card에 위임하지 않는 이유는 다형성 하나다 — 그것 말고
 * 벤더가 주던 것은 면 하나였고, 그 면은 스타일시트 세 줄이며 같은 토큰을 쓴다.
 * 벤더가 토큰 값을 바꾸면 우리 면도 따라간다.
 *
 * 격리는 그대로다. 앱은 여전히 이 패키지에서 `Card`를 부르고, 안에서 위임하는지
 * 직접 그리는지는 이 래퍼의 구현 세부다.
 *
 * **자손 호버를 위해서는 아무것도 하지 않는다.** `className`을 뿌리에 그대로 넘기면
 * 부르는 쪽이 제 스타일시트에 `.내카드:hover .제목`을 쓴다. 프롭을 만들려 드는 것은
 * 만들 수 없는 것을 만들려는 것이다.
 */
export const Card = <T extends ElementType = 'div'>({
  as,
  padding,
  hover = 'none',
  className,
  style,
  ...rest
}: CardProps<T>): ReactElement => {
  const Component: ElementType = as ?? 'div';

  const merged =
    padding === undefined
      ? style
      : ({ ...style, '--ads-card-padding': `${String(padding)}px` } as CSSProperties);

  const props = {
    ...rest,
    className: [
      'ads-card',
      padding === undefined ? '' : 'ads-card-padding',
      hover === 'exchange' ? 'ads-card-hover-exchange' : '',
      className,
    ]
      .filter(Boolean)
      .join(' '),
    ...(merged === undefined ? {} : { style: merged }),
  };

  return <Component {...props} />;
};
