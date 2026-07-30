'use client';

import type { ReactNode } from 'react';

import { Theme } from '@astryxdesign/core/theme';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

interface DesignSystemProviderProps {
  children: ReactNode;
}

/**
 * 디자인 시스템 테마를 공급하는 프로바이더.
 *
 * Astryx 컴포넌트는 전부 클라이언트 컴포넌트라 테마 주입에 클라이언트 경계가 필요하다.
 * 그 경계를 이 파일이 소유해서, 앱은 'use client'를 직접 다룰 필요 없이
 * 서버 컴포넌트에서 그대로 렌더할 수 있다.
 *
 * 테마는 기본(neutral)으로 시작한다. 브랜드 테마는 필요해질 때 CSS 커스텀
 * 프로퍼티 오버라이드로 대체한다.
 */
export const DesignSystemProvider = ({ children }: DesignSystemProviderProps) => {
  return <Theme theme={neutralTheme}>{children}</Theme>;
};
