import type { ReactElement } from 'react';

import { VENDOR_NAME } from '@audemodo/design-system';
import { IconChevronDown, IconChevronRight, IconShieldCheck } from '@tabler/icons-react';

import type { ProjectArchitecture } from '@/entities/project';

import styles from './architecture-diagram.module.css';

interface ArchitectureDiagramProps {
  architecture: ProjectArchitecture;
}

const Badge = ({ children }: { children: string }): ReactElement => (
  <span className={styles.badge}>
    <IconShieldCheck aria-hidden size={13} />
    {children}
  </span>
);

/**
 * 의존 방향 도형.
 *
 * 벤더 이름을 여기 리터럴로 적지 않는다. 화면에 그 문자열이 나오는 것이 이 도형의
 * 목적이지만, 앱 소스에 적으면 저장소 전체 grep에 걸려 격리 검사가 무뎌진다 —
 * 검사가 잡아야 하는 「앱이 벤더를 부르는가」와 구별되지 않는다. 래퍼가 내보내는
 * 상수를 값으로 받아 쓴다.
 *
 * 앱에서 벤더로 가는 화살표가 없다는 것이 이 도형의 내용이다.
 */
export const ArchitectureDiagram = ({ architecture }: ArchitectureDiagramProps): ReactElement => {
  const consumers = architecture.consumers.map((name) => (
    <div className={styles.box} key={name}>
      {name}
    </div>
  ));

  const wrapper = (
    <div className={styles.wrapperColumn}>
      <div className={`${styles.box} ${styles.wrapperBox}`}>{architecture.wrapper}</div>
      <Badge>{architecture.badge}</Badge>
    </div>
  );

  const vendor = <div className={`${styles.box} ${styles.vendorBox}`}>{VENDOR_NAME}</div>;

  return (
    <div className={styles.frame}>
      <div className={styles.label}>의존 방향</div>

      <div className={styles.flow}>
        <div className={styles.consumers}>{consumers}</div>

        <span aria-hidden className={styles.arrow}>
          <span className={styles.arrowLine} />
          <IconChevronRight className={styles.arrowHead} size={18} />
        </span>

        {wrapper}

        <span aria-hidden className={styles.arrow}>
          <span className={styles.arrowLine} />
          <IconChevronRight className={styles.arrowHead} size={18} />
        </span>

        {vendor}
      </div>

      {/* 좁은 화면 — 의존 방향이 원래 세로다 */}
      <div className={styles.flowVertical}>
        <div className={styles.consumers}>{consumers}</div>

        <span aria-hidden className={styles.arrowVertical}>
          <span className={styles.arrowLineVertical} />
          <IconChevronDown className={styles.arrowHeadVertical} size={18} />
        </span>

        {wrapper}

        <span aria-hidden className={styles.arrowVertical}>
          <span className={styles.arrowLineVertical} />
          <IconChevronDown className={styles.arrowHeadVertical} size={18} />
        </span>

        {vendor}
      </div>

      <p className={styles.note}>{architecture.note}</p>
    </div>
  );
};
