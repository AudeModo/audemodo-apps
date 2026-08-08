'use client';

import type { AxisView } from '../../model/use-post-filters';
import type { ReactElement } from 'react';

import { HStack, Text, VStack } from '@audemodo/design-system';
import { IconAdjustmentsHorizontal, IconCheck, IconChevronDown, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { AxisKey } from '@/shared/config';
import type { FacetOption } from '@/shared/lib';

import styles from './axis-filters.module.css';

/** 좁은 화면에서 한 축이 접힌 채 보여주는 옵션 수 */
const COLLAPSED_OPTIONS = 4;

interface AxisFiltersProps {
  axes: AxisView[];
  /** 좁은 화면 패널의 「N편 보기」에 쓴다 */
  resultCount: number;
  onToggleValue: (key: AxisKey, value: string) => void;
  onClearAxis: (key: AxisKey) => void;
  onClearAll: () => void;
}

interface OptionRowProps {
  option: FacetOption;
  onPick: () => void;
}

/**
 * 옵션 한 줄.
 *
 * 실제 checkbox 대신 role을 쓴다 — 행 전체가 히트 영역이고 카운트까지 한 줄에 들어가야
 * 하는데, 네이티브 입력을 숨기고 라벨로 감싸면 비활성 상태의 커서와 포커스가 갈라진다.
 */
const OptionRow = ({ option, onPick }: OptionRowProps): ReactElement => {
  return (
    <button
      aria-checked={option.isChecked}
      className={styles.option}
      disabled={option.isDisabled}
      onClick={onPick}
      role="checkbox"
      type="button"
    >
      <span className={styles.checkbox}>
        {option.isChecked && <IconCheck aria-hidden size={12} stroke={2.5} />}
      </span>

      <span>{option.value}</span>

      <span className={styles.count}>{option.count}</span>
    </button>
  );
};

/**
 * 다섯 축을 좁히는 손잡이.
 *
 * 넓은 화면은 축마다 팝오버, 좁은 화면은 전체 화면 패널이다. 두 대역을 자바스크립트로
 * 갈라내면 첫 렌더에서 서버와 브라우저가 다른 것을 그리므로, 둘 다 그려두고 CSS가 고른다.
 */
export const AxisFilters = ({
  axes,
  resultCount,
  onToggleValue,
  onClearAxis,
  onClearAll,
}: AxisFiltersProps): ReactElement => {
  const [openKey, setOpenKey] = useState<AxisKey | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [expanded, setExpanded] = useState<AxisKey[]>([]);
  const desktopRef = useRef<HTMLDivElement>(null);

  const pickedTotal = axes.reduce((sum, axis) => sum + axis.pickedCount, 0);

  const closePopover = useCallback(() => {
    setOpenKey(null);
  }, []);

  // 하나만 열리고 바깥을 누르면 닫힌다
  useEffect(() => {
    if (openKey === null) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || desktopRef.current?.contains(event.target) !== true) {
        closePopover();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopover();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openKey, closePopover]);

  return (
    <>
      <div className={styles.desktop} ref={desktopRef}>
        {axes.map((axis) => (
          <div className={styles.axis} key={axis.key}>
            <button
              aria-expanded={openKey === axis.key}
              aria-haspopup="true"
              aria-pressed={axis.pickedCount > 0}
              className={styles.trigger}
              onClick={() => {
                setOpenKey((current) => (current === axis.key ? null : axis.key));
              }}
              type="button"
            >
              {axis.label}

              {axis.pickedCount > 0 && <span className={styles.badge}>{axis.pickedCount}</span>}

              <IconChevronDown aria-hidden className={styles.chevron} size={16} />
            </button>

            {openKey === axis.key && (
              <div className={styles.popover}>
                {axis.options.map((option) => (
                  <OptionRow
                    key={option.value}
                    onPick={() => {
                      onToggleValue(axis.key, option.value);
                    }}
                    option={option}
                  />
                ))}

                <button
                  className={styles.axisClear}
                  onClick={() => {
                    onClearAxis(axis.key);
                  }}
                  type="button"
                >
                  이 축만 지우기
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.mobile}>
        <button
          aria-expanded={isPanelOpen}
          aria-pressed={pickedTotal > 0}
          className={styles.trigger}
          onClick={() => {
            setIsPanelOpen(true);
          }}
          type="button"
        >
          <IconAdjustmentsHorizontal aria-hidden size={16} />
          필터
          {pickedTotal > 0 && <span className={styles.badge}>{pickedTotal}</span>}
        </button>
      </div>

      {isPanelOpen && (
        <div aria-label="필터" aria-modal className={styles.panel} role="dialog">
          <div className={styles.panelHead}>
            <Text style={{ letterSpacing: 'var(--devlog-tracking-heading)' }} type="large">
              필터
            </Text>

            <button className={styles.textButton} onClick={onClearAll} type="button">
              모두 지우기
            </button>

            <button
              aria-label="필터 닫기"
              className={styles.iconButton}
              onClick={() => {
                setIsPanelOpen(false);
              }}
              type="button"
            >
              <IconX aria-hidden size={20} />
            </button>
          </div>

          <div className={styles.panelBody}>
            {axes.map((axis) => {
              const isExpanded = expanded.includes(axis.key);
              const shown = isExpanded ? axis.options : axis.options.slice(0, COLLAPSED_OPTIONS);
              const hidden = axis.options.length - shown.length;

              return (
                <div className={styles.panelSection} key={axis.key}>
                  <VStack gap={2}>
                    <Text color="secondary" type="supporting">
                      {axis.label}
                    </Text>

                    <VStack gap={0}>
                      {shown.map((option) => (
                        <OptionRow
                          key={option.value}
                          onPick={() => {
                            onToggleValue(axis.key, option.value);
                          }}
                          option={option}
                        />
                      ))}
                    </VStack>

                    {hidden > 0 && (
                      <HStack>
                        <button
                          className={styles.textButton}
                          onClick={() => {
                            setExpanded((keys) => [...keys, axis.key]);
                          }}
                          type="button"
                        >
                          {hidden}개 더 보기
                        </button>
                      </HStack>
                    )}
                  </VStack>
                </div>
              );
            })}
          </div>

          <div className={styles.panelFoot}>
            <button
              className={styles.apply}
              onClick={() => {
                setIsPanelOpen(false);
              }}
              type="button"
            >
              {resultCount}편 보기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
