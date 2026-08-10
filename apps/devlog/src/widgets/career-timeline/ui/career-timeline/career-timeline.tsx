import type { ReactElement } from 'react';

import type { CareerEntry } from '@/shared/config';

import { splitPeriod } from '../../model/split-period';
import styles from './career-timeline.module.css';

interface CareerTimelineProps {
  entries: readonly CareerEntry[];
}

/**
 * 지금까지.
 *
 * 넓은 화면은 왼쪽에 날짜 열을 두고, 좁은 화면에서는 날짜가 제목 위로 올라간다 —
 * 390px에서 82px 열을 빼면 내용이 들어갈 폭이 남지 않는다.
 *
 * 점과 선은 장식이 아니라 순서를 나르므로 낭독기에서 빼고 글로 남긴다.
 */
export const CareerTimeline = ({ entries }: CareerTimelineProps): ReactElement => {
  return (
    <div className={styles.list}>
      {entries.map((entry, index) => (
        <div className={styles.entry} key={`${entry.at}:${entry.title}`}>
          {/*
            기간은 두 줄로 쪼갠다. 82px 열은 `YYYY.MM` 기준으로 나온 값이라
            넓히면 시점 하나뿐인 나머지가 다 헐거워진다.
          */}
          <div className={styles.at}>
            {splitPeriod(entry.at).map((part) => (
              <span className={styles.atLine} key={part}>
                {part}
              </span>
            ))}
          </div>

          <div aria-hidden className={styles.rail}>
            <span className={styles.dot} data-tone={entry.tone} />
            {/* 마지막 항목에는 선이 없다. 선은 다음으로 이어진다는 표시다 */}
            {index < entries.length - 1 && <span className={styles.line} />}
          </div>

          <div className={styles.body}>
            <div className={styles.atInline}>{entry.at}</div>
            <div className={styles.title}>{entry.title}</div>
            <p className={styles.text}>{entry.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
