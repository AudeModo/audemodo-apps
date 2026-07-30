import './globals.css';

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { DesignSystemProvider } from '@audemodo/design-system';

export const metadata: Metadata = {
  title: 'Audemodo devlog',
  description: '개발 블로그 — Audemodo 진화 궁적의 1단계',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </body>
    </html>
  );
}
