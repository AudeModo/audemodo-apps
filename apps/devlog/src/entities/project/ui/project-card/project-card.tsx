import type { ProjectSummary } from '../../model/types';
import type { ReactElement } from 'react';

import { IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';

import { StatusDot } from '../status-dot/status-dot';
import styles from './project-card.module.css';

interface ProjectCardProps {
  project: ProjectSummary;
  /** 이 프로젝트에서 나온 글 수. 코퍼스에서 센 값이다 */
  postCount: number;
}

/**
 * 프로젝트 카드.
 *
 * 카드 전체를 링크로 덮지 않는다. 이름만 링크이고 카드 호버는 자손 선택자로 이름에
 * 밑줄을 긋는다 — 겹치는 링크(저장소 · 지표)가 오버레이와 z-index를 다툴 일이 없다.
 */
export const ProjectCard = ({ project, postCount }: ProjectCardProps): ReactElement => {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.nameColumn}>
          <Link className={styles.name} href={`/projects/${project.slug}`}>
            {project.name}
          </Link>
        </div>

        {project.repoUrl !== undefined && (
          <a
            aria-label={`${project.name} 저장소 열기 (새 탭)`}
            className={styles.repo}
            href={project.repoUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <IconExternalLink aria-hidden size={16} />
          </a>
        )}
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.status}>
        <StatusDot tone={project.statusTone} />
        {project.status}
      </div>

      <div className={styles.stack}>{project.stack.join(' · ')}</div>

      <div className={styles.rule} />

      <div className={styles.metrics}>
        {/* 글 수는 코퍼스에서 센다. 손으로 적으면 글이 늘어도 그대로 남는다 */}
        <Link
          className={styles.metricLink}
          href={`/posts?project=${encodeURIComponent(project.name)}`}
        >
          글 {postCount}
        </Link>

        {project.deployUrl !== undefined && (
          <a
            className={`${styles.metricLink} ${styles.deploy}`}
            href={project.deployUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {project.deployLabel ?? '배포'}
            <IconExternalLink aria-hidden size={14} />
          </a>
        )}
      </div>
    </div>
  );
};
