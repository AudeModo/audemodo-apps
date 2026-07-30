'use client';

import type { LinkComponentType } from '@astryxdesign/core/Link';
import type { ReactNode } from 'react';

import { LinkProvider } from '@astryxdesign/core/Link';
import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

interface DesignSystemProviderProps {
  children: ReactNode;

  /**
   * 링크 렌더에 쓸 라우팅 컴포넌트(예: next/link).
   *
   * 이 패키지는 프레임워크를 몰라야 하므로 직접 import하지 않고 소비자에게 받는다.
   * 주입하지 않으면 Astryx가 기본 <a>로 렌더한다.
   */
  linkComponent?: LinkComponentType;
}

/**
 * 디자인 시스템의 테마와 라우팅 배선을 공급하는 프로바이더.
 *
 * Astryx 컴포넌트는 대부분 클라이언트 컴포넌트라 테마·링크 주입에 클라이언트 경계가
 * 필요하다. 그 경계를 이 파일이 소유해 앱이 벤더의 경계 규칙을 알 필요가 없게 한다.
 *
 * 테마는 기본(neutral)으로 시작한다. 브랜드 테마는 필요해질 때 CSS 커스텀
 * 프로퍼티 오버라이드로 대체한다.
 */
export const DesignSystemProvider = ({ children, linkComponent }: DesignSystemProviderProps) => {
  const themedChildren = <Theme theme={neutralTheme}>{children}</Theme>;

  if (linkComponent === undefined) {
    return themedChildren;
  }

  return <LinkProvider component={linkComponent}>{themedChildren}</LinkProvider>;
};
