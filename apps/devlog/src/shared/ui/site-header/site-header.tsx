'use client';

import type { ReactElement } from 'react';

import { IconBrandGithub, IconMail, IconMenu2, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { NAV_LINKS, SITE } from '../../config';
import styles from './site-header.module.css';

/**
 * 현재 화면인가.
 *
 * 글 상세(`/posts/어떤글`)에서도 「글」이 현재 화면이어야 한다. 목록에서 상세로 들어간
 * 순간 표시가 꺼지면 자기가 어느 갈래에 있는지 알 수 없다.
 */
const isCurrent = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

/** 아홉 화면 전부에 있는 네비 */
export const SiteHeader = (): ReactElement => {
  const pathname = usePathname();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  /*
   * 화면이 바뀌면 패널을 닫는다. 링크를 눌러 이동했는데 패널이 남아 있으면 안 된다.
   * 렌더 중에 맞추는 이유는, effect로 미루면 새 화면이 패널에 덮인 채로 한 번 그려지기
   * 때문이다.
   */
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsPanelOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link className={styles.logo} href="/">
          {SITE.name}
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map((item) => (
            <Link
              aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
              className={styles.link}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {/* 외부는 새 탭. 그 신호를 아이콘 하나로 대신하므로 라벨을 따로 준다 */}
          <a
            aria-label="GitHub 저장소 (새 탭)"
            className={`${styles.iconLink} ${styles.desktopOnly}`}
            href={SITE.githubUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconBrandGithub aria-hidden size={20} />
          </a>

          <a
            aria-label="메일 보내기"
            className={`${styles.iconLink} ${styles.desktopOnly}`}
            href={`mailto:${SITE.email}`}
          >
            <IconMail aria-hidden size={20} />
          </a>

          <button
            aria-expanded={isPanelOpen}
            aria-label={isPanelOpen ? '메뉴 닫기' : '메뉴 열기'}
            className={`${styles.iconLink} ${styles.menuButton}`}
            onClick={() => {
              setIsPanelOpen((open) => !open);
            }}
            type="button"
          >
            {isPanelOpen ? <IconX aria-hidden size={22} /> : <IconMenu2 aria-hidden size={22} />}
          </button>
        </div>
      </div>

      {isPanelOpen && (
        <div className={styles.panel}>
          {NAV_LINKS.map((item) => (
            <Link
              aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
              className={styles.panelLink}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}

          <a
            className={styles.panelExternal}
            href={SITE.githubUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
            <IconBrandGithub aria-hidden size={16} />
          </a>

          <a className={styles.panelExternal} href={`mailto:${SITE.email}`}>
            메일 보내기
            <IconMail aria-hidden size={16} />
          </a>
        </div>
      )}
    </header>
  );
};
