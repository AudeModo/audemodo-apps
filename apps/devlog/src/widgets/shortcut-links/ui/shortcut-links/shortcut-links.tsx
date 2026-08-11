import type { ReactElement } from 'react';

import { IconArrowUpRight } from '@tabler/icons-react';

import type { ShortcutLink } from '@/entities/dashboard';

import styles from './shortcut-links.module.css';

interface ShortcutLinksProps {
  items: ShortcutLink[];
}

/**
 * 바깥으로 나가는가.
 *
 * 저장소가 이미 쓰는 판단이다(MDX 링크도 같다). 이 하나로 새 탭 여부와 ↗가 함께 정해진다 —
 * 데이터에 `isExternal`을 두면 주소와 어긋날 수 있는 두 번째 진실이 생긴다.
 */
const isExternal = (url: string): boolean => /^https?:\/\//.test(url);

/** 바로가기 */
export const ShortcutLinks = ({ items }: ShortcutLinksProps): ReactElement => {
  if (items.length === 0) {
    return <p className={styles.empty}>바로가기가 아직 없다.</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const external = isExternal(item.url);

        return (
          <li className={styles.row} key={item.url}>
            <a
              className={styles.link}
              href={item.url}
              {...(external ? { rel: 'noreferrer noopener', target: '_blank' } : {})}
            >
              {item.label}
              {external && <IconArrowUpRight aria-hidden size={13} />}
            </a>

            {item.note !== undefined && <span className={styles.note}>{item.note}</span>}
          </li>
        );
      })}
    </ul>
  );
};
