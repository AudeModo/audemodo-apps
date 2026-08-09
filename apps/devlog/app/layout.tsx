import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { THEME_INIT_SCRIPT } from '@/shared/lib';
import { FloatingTools, SiteFooter, SiteHeader } from '@/shared/ui';

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

/**
 * 아홉 화면이 앉는 껍데기.
 *
 * 네비 · 푸터 · 플로팅 도구는 화면마다 만들지 않고 여기 한 번만 둔다.
 * 화면마다 만들면 아홉 벌이 조금씩 어긋난다.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /*
     * data-theme을 서버에서 light로 박아둔다. 브랜드 색이 이 속성으로 갈리는데
     * 비워두면 OS 설정이 벤더 기본값만 다크로 뒤집어 브랜드 색과 어긋난다.
     * 자바스크립트가 꺼져 있어도 이 값이 남아 화면이 온전하다.
     *
     * 아래 스크립트가 저장된 선택을 첫 페인트 전에 덮으므로 서버가 그린 값과
     * 브라우저의 값이 다를 수 있다. 의도한 차이라 경고를 끈다.
     */
    <html data-theme="light" lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <SiteHeader />

          {children}

          <SiteFooter />

          <FloatingTools />
        </Providers>
      </body>
    </html>
  );
}
