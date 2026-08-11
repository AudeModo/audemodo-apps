import type { ReactElement } from 'react';

import type { IdeaItem } from '@/entities/dashboard';

import styles from './idea-list.module.css';

interface IdeaListProps {
  items: IdeaItem[];
}

/**
 * 글감.
 *
 * 이 위젯의 자리는 원래 「초안 · 글감」이고 초안은 글 frontmatter에서 온다.
 * **초안 필드가 아직 없어 글감만 그린다.** 없는 것을 지어내는 대신 반만 채운다.
 */
export const IdeaList = ({ items }: IdeaListProps): ReactElement => {
  if (items.length === 0) {
    return <p className={styles.empty}>글감이 아직 없다.</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li className={styles.row} key={item.title}>
          <div className={styles.head}>
            <span className={styles.label}>글감</span>
            <span className={styles.title}>{item.title}</span>
          </div>

          {item.note !== undefined && <span className={styles.note}>{item.note}</span>}
        </li>
      ))}
    </ul>
  );
};
