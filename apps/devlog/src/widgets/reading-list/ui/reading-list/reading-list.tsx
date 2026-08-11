import type { ReactElement } from 'react';

import { IconExternalLink } from '@tabler/icons-react';

import type { ReadingLink } from '@/entities/dashboard';

import styles from './reading-list.module.css';

interface ReadingListProps {
  items: ReadingLink[];
}

/**
 * 출처.
 *
 * 적어두지 않으면 주소의 호스트를 쓴다 — 같은 값을 두 번 적게 두지 않는다.
 * `www.`는 뗀다. 화면에서 아무것도 알려주지 않는 네 글자다.
 */
const sourceOf = (item: ReadingLink): string => {
  if (item.source !== undefined) {
    return item.source;
  }

  return new URL(item.url).hostname.replace(/^www\./, '');
};

/** 읽을거리. 남이 쓴 것으로 나가는 목록이라 항목이 모두 바깥으로 간다 */
export const ReadingList = ({ items }: ReadingListProps): ReactElement => {
  if (items.length === 0) {
    return <p className={styles.empty}>읽을거리가 아직 없다.</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li className={styles.row} key={item.url}>
          <a className={styles.link} href={item.url} rel="noreferrer noopener" target="_blank">
            {item.title}
            <IconExternalLink aria-hidden size={13} />
          </a>

          <span className={styles.meta}>
            {sourceOf(item)}
            {item.note !== undefined && ` · ${item.note}`}
          </span>
        </li>
      ))}
    </ul>
  );
};
