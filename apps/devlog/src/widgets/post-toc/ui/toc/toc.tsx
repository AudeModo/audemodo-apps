'use client';

import type { ReactElement } from 'react';

import { Text } from '@audemodo/design-system';

import type { Heading } from '@/shared/lib';
import { Details } from '@/shared/ui';

import { useActiveHeading } from '../../model/use-active-heading';
import styles from './toc.module.css';

interface TocProps {
  headings: Heading[];
  /**
   * `side`는 본문 오른쪽에 붙어 따라오고 `inline`은 본문 위에 접힌 채 앉는다.
   * 자리가 다르므로 마크업 위치도 달라야 한다 — 어느 쪽을 보일지는 CSS가 정한다.
   */
  placement: 'side' | 'inline';
}

/**
 * 목차.
 *
 * 소제목이 없으면 아무것도 그리지 않는다 — 빈 목차는 자리만 차지하고,
 * 넓은 화면에서는 본문 옆에 빈 칸을 남긴다.
 */
export const Toc = ({ headings, placement }: TocProps): ReactElement | null => {
  const active = useActiveHeading(headings.map((heading) => heading.id));

  if (headings.length === 0) {
    return null;
  }

  const list = (
    <ul className={styles.list}>
      {headings.map((heading) => (
        <li key={heading.id}>
          <a aria-current={heading.id === active} className={styles.link} href={`#${heading.id}`}>
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (placement === 'inline') {
    return (
      <nav aria-label="목차" className={styles.inline}>
        <Details summary="목차">{list}</Details>
      </nav>
    );
  }

  return (
    <nav aria-label="목차" className={styles.side}>
      <div className={styles.label}>
        <Text color="secondary" type="supporting">
          목차
        </Text>
      </div>

      {list}
    </nav>
  );
};
