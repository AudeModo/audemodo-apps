'use client';

import type { FilterChip } from '../../model/use-post-filters';
import type { ReactElement } from 'react';

import { Text } from '@audemodo/design-system';
import { IconX } from '@tabler/icons-react';

import type { AxisKey } from '@/shared/config';

import styles from './active-filter-strip.module.css';

interface ActiveFilterStripProps {
  chips: FilterChip[];
  resultCount: number;
  /** 빈 상태에서 빼자고 권하는 축. 그 축의 칩만 테두리가 진해진다 */
  culprit: AxisKey | null;
  onRemoveChip: (key: AxisKey, value: string) => void;
  onClearAll: () => void;
}

/** 지금 무엇으로 좁혀져 있고 몇 편이 남았는지 */
export const ActiveFilterStrip = ({
  chips,
  resultCount,
  culprit,
  onRemoveChip,
  onClearAll,
}: ActiveFilterStripProps): ReactElement => {
  return (
    <div className={styles.strip}>
      {chips.length === 0 ? (
        <Text color="secondary" type="supporting">
          축을 골라 좁힌다
        </Text>
      ) : (
        <>
          <Text color="secondary" type="supporting">
            적용됨
          </Text>

          {chips.map((chip) => (
            <span
              className={styles.chip}
              data-culprit={chip.key === culprit}
              key={`${chip.key}:${chip.value}`}
            >
              <Text color="inherit" type="inherit">
                {chip.value}
              </Text>

              <button
                aria-label={`${chip.value} 필터 빼기`}
                className={styles.remove}
                onClick={() => {
                  onRemoveChip(chip.key, chip.value);
                }}
                type="button"
              >
                <IconX aria-hidden size={14} />
              </button>
            </span>
          ))}

          <button className={styles.clearAll} onClick={onClearAll} type="button">
            모두 지우기
          </button>
        </>
      )}

      <span className={styles.result}>
        <Text color="secondary" hasTabularNumbers type="supporting">
          {resultCount}편 · 최신순
        </Text>
      </span>
    </div>
  );
};
