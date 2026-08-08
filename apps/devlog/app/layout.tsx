import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Audemodo devlog',
    template: '%s · Audemodo devlog',
  },
  description: '개발 블로그 — Audemodo 진화 궤적의 1단계',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /*
     * data-theme을 서버에서 박아둔다. 디자인 시스템의 색은 이 속성으로 갈리고,
     * 비워두면 OS 설정이 벤더 기본값만 다크로 뒤집어 브랜드 색과 어긋난다.
     * 다크로 바꾸는 경로는 나중에 들어올 전역 도구 버튼 하나뿐이다.
     */
    <html data-theme="light" lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
