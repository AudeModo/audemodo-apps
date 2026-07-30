'use client';

import type { ReactNode } from 'react';

import { DesignSystemProvider } from '@audemodo/design-system';
import NextLink from 'next/link';

/**
 * 앱의 클라이언트 경계.
 *
 * next/link를 디자인 시스템에 주입한다. 서버 컴포넌트(layout)에서 컴포넌트를
 * prop으로 넘기면 RSC 직렬화 규칙에 걸려 프리렌더가 실패하므로, 주입은 반드시
 * 클라이언트 경계 안에서 일어나야 한다.
 *
 * 이 파일이 앱에 있는 이유: 라우팅은 앱의 관심사다. 디자인 시스템 패키지가
 * next/link를 직접 import하면 패키지가 Next에 종속되어, 다른 프레임워크 앱이
 * 생겼을 때 그대로 쓸 수 없게 된다.
 */
export const Providers = ({ children }: { children: ReactNode }) => {
  return <DesignSystemProvider linkComponent={NextLink}>{children}</DesignSystemProvider>;
};
