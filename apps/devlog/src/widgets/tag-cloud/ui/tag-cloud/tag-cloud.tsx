import type { ReactElement } from 'react';

import Link from 'next/link';

import type { Frequency } from '@/shared/lib';

import styles from './tag-cloud.module.css';

/** 가장 적게 쓴 것과 가장 많이 쓴 것의 글자 크기 */
const MIN_SIZE = 12;
const MAX_SIZE = 27;

interface TagCloudProps {
  items: Frequency[];
  /** 태그와 스택은 다른 축이라 링크가 다르다 */
  axisOf: (value: string) => string;
}

/**
 * 자주 쓴 것.
 *
 * 빈도를 글자 크기로 선형 매핑한다. 전부 같은 빈도면 모두 가장 작은 크기가 되는데,
 * 그때 크기 차이는 정보가 없으므로 크기로 말하지 않는 것이 맞다.
 */
export const TagCloud = ({ items, axisOf }: TagCloudProps): ReactElement => {
  const counts = items.map((item) => item.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const span = max - min;

  return (
    <div className={styles.cloud}>
      {items.map((item) => {
        const ratio = span === 0 ? 0 : (item.count - min) / span;
        const size = MIN_SIZE + ratio * (MAX_SIZE - MIN_SIZE);

        return (
          <Link
            className={styles.tag}
            href={`/posts?${axisOf(item.value)}=${encodeURIComponent(item.value)}`}
            key={item.value}
            style={{ fontSize: `${String(Math.round(size))}px` }}
          >
            {item.value}
            <span className={styles.count}>{item.count}</span>
          </Link>
        );
      })}
    </div>
  );
};
