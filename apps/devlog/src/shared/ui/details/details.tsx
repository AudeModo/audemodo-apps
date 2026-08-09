import type { ReactElement, ReactNode } from 'react';

import { IconMinus, IconPlus } from '@tabler/icons-react';

import styles from './details.module.css';

interface DetailsProps {
  /** 접혀 있을 때 보이는 한 줄 */
  summary: string;
  children: ReactNode;
}

/**
 * 곁가지 설명. 기본은 접혀 있다.
 *
 * 시맨틱은 네이티브를 쓴다 — 여는 상태도, 키보드 조작도, 낭독기 안내도 브라우저가
 * 이미 한다. 페이지 안 검색(Ctrl+F)이 접힌 내용을 찾아 펴주는 것도 네이티브만의 것이다.
 */
export const Details = ({ summary, children }: DetailsProps): ReactElement => {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        <span className={`${styles.marker} ${styles.markerClosed}`}>
          <IconPlus aria-hidden size={16} />
        </span>

        <span className={`${styles.marker} ${styles.markerOpen}`}>
          <IconMinus aria-hidden size={16} />
        </span>

        {summary}
      </summary>

      <div className={styles.body}>{children}</div>
    </details>
  );
};
