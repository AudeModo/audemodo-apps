import type { ReactElement } from 'react';

import { Heading, HStack, Text, VStack } from '@audemodo/design-system';

import { ActionButton } from '../action-button/action-button';
import styles from './empty-state.module.css';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title: string;
  description: string;
  /**
   * 강조는 항상 최소 개입 쪽이다. 받아든 상태의 의도를 가장 많이 지키는 행동이
   * 검정 채움을 가져간다 — 어느 쪽인지는 부르는 쪽이 정한다.
   */
  primaryAction: EmptyStateAction;
  /** 대안이 없으면 null. 그때는 강조 하나만 남는다. */
  secondaryAction: EmptyStateAction | null;
}

/**
 * 읽을 것이 없을 때의 화면.
 *
 * 말투는 평서형으로 담백하게 둔다. 존댓말이나 느낌표를 쓰지 않는다 —
 * 빈 화면은 사과할 일이 아니라 상태를 알리는 자리다.
 */
export const EmptyState = ({
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps): ReactElement => {
  return (
    <div className={styles.frame}>
      <VStack gap={6} hAlign="center">
        <VStack gap={3} hAlign="center" maxWidth={520}>
          <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
            {title}
          </Heading>

          <Text as="p" color="secondary">
            {description}
          </Text>
        </VStack>

        <HStack gap={2} justify="center" wrap="wrap">
          <ActionButton onClick={primaryAction.onClick} variant="solid">
            {primaryAction.label}
          </ActionButton>

          {secondaryAction !== null && (
            <ActionButton onClick={secondaryAction.onClick} variant="outline">
              {secondaryAction.label}
            </ActionButton>
          )}
        </HStack>
      </VStack>
    </div>
  );
};
