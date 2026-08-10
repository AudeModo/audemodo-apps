import type { ReactElement } from 'react';

import { Heading } from '@audemodo/design-system';
import {
  IconArrowRight,
  IconBrandCss3,
  IconBrandGithub,
  IconBrandNextjs,
  IconBrandNpm,
  IconBrandReact,
  IconBrandTypescript,
  IconDownload,
  IconMarkdown,
  IconPackages,
  IconRss,
  IconShieldCheck,
  IconSitemap,
  IconSparkles,
  IconTestPipe,
} from '@tabler/icons-react';
import Link from 'next/link';

import { CareerTimeline } from '@/widgets/career-timeline';

import { ABOUT, SITE } from '@/shared/config';
import { ContactCard, Highlight } from '@/shared/ui';

import styles from './about.module.css';

/**
 * 기술 아이콘.
 *
 * 마크가 없는 둘은 공용 문서가 정한 대체품을 쓴다 — StyleX는 `brand-css3`,
 * FSD는 `sitemap`. 색은 지정하지 않고 부모에서 물려받는다.
 */
const SKILL_ICONS: Record<string, ReactElement> = {
  TypeScript: <IconBrandTypescript aria-hidden size={20} />,
  React: <IconBrandReact aria-hidden size={20} />,
  'Next.js': <IconBrandNextjs aria-hidden size={20} />,
  StyleX: <IconBrandCss3 aria-hidden size={20} />,
  MDX: <IconMarkdown aria-hidden size={20} />,
  pnpm: <IconBrandNpm aria-hidden size={20} />,
  Turborepo: <IconPackages aria-hidden size={20} />,
  'GitHub Actions': <IconBrandGithub aria-hidden size={20} />,
  ESLint: <IconShieldCheck aria-hidden size={20} />,
  Prettier: <IconSparkles aria-hidden size={20} />,
  Vitest: <IconTestPipe aria-hidden size={20} />,
  FSD: <IconSitemap aria-hidden size={20} />,
};

/** 주소에서 스킴을 걷어낸 표기 — 카드에는 눈으로 읽는 주소를 둔다 */
const bare = (url: string): string => url.replace(/^https?:\/\//, '');

/**
 * 소개.
 *
 * 읽는 화면이 아니라 확인하는 화면이다. 30초 스크리너와 면접관 둘 다
 * 「이 사람이 누구인가」를 확인하러 온다.
 */
export const About = (): ReactElement => {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.container}>
          {ABOUT.isOpenToWork && (
            <span className={styles.openToWork}>
              <span aria-hidden className={styles.openToWorkDot} />
              {ABOUT.openToWorkLabel}
            </span>
          )}

          <Heading
            className={styles.headline}
            level={1}
            style={{ letterSpacing: 'var(--devlog-tracking-hero)', lineHeight: 1.35 }}
          >
            {ABOUT.headline.before}
            <span className={styles.accent}>{ABOUT.headline.accent}</span>
            {ABOUT.headline.after}
          </Heading>

          {ABOUT.intro.map((paragraph) => (
            <p className={styles.intro} key={paragraph}>
              {paragraph}
            </p>
          ))}

          <p className={styles.intro}>
            {ABOUT.introHighlighted.before}
            <Highlight>{ABOUT.introHighlighted.highlight}</Highlight>
            {ABOUT.introHighlighted.after}
          </p>

          {/*
            메일 버튼은 아직 없다. 주소가 정해지기 전에는 눌러도 갈 곳이 없고,
            갈 곳 없는 주 행동을 두면 이 화면의 목적이 흐려진다.
            그래서 강조는 검정 채움으로 둔다 — 파랑 채움은 메일이 살아날 때 쓴다.
          */}
          <div className={styles.actions}>
            {ABOUT.resumeUrl !== undefined && (
              <a
                className={`${styles.action} ${styles.actionPrimary}`}
                href={ABOUT.resumeUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconDownload aria-hidden size={18} />
                이력서 PDF
              </a>
            )}

            <a
              className={`${styles.action} ${styles.actionSecondary}`}
              href={SITE.githubUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconBrandGithub aria-hidden size={18} />
              GitHub
            </a>

            {ABOUT.resumeUpdatedAt !== undefined && (
              <span className={styles.resumeAt}>이력서 {ABOUT.resumeUpdatedAt} 갱신</span>
            )}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.muted}`}>
        <div className={styles.container}>
          <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
            지금까지
          </Heading>

          <p className={styles.sectionNote}>{ABOUT.careerNote}</p>

          <CareerTimeline entries={ABOUT.career} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
            쓰는 기술
          </Heading>

          <p className={styles.sectionNote}>
            실제로 프로젝트에 들어간 것만 적는다. 이름을 아는 것과 쓴 것은 다르다.
          </p>

          <div className={styles.skills}>
            {ABOUT.skills.map((skill) => (
              <span className={styles.skill} key={skill}>
                <span className={styles.skillIcon}>{SKILL_ICONS[skill]}</span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.muted}`}>
        <div className={styles.container}>
          <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
            어떻게 일하나
          </Heading>

          <p className={styles.sectionNote}>
            면접에서 자주 나오는 질문을 미리 답한다. 지어낸 원칙이 아니라 실제로 지키고 있는
            것들이다.
          </p>

          <div className={styles.answers}>
            {ABOUT.answers.map((answer, index) => (
              <div className={styles.answer} key={answer.question}>
                <div className={styles.answerHead}>
                  <span className={styles.answerNumber} data-tone={index}>
                    {index + 1}
                  </span>

                  <Heading level={3}>{answer.question}</Heading>
                </div>

                <p className={styles.answerBody}>
                  {answer.body}
                  <Highlight>{answer.highlight}</Highlight>
                  {answer.tail}
                </p>

                {answer.link !== undefined && (
                  <Link className={styles.answerLink} href={answer.link.href}>
                    {answer.link.label}
                    <IconArrowRight aria-hidden size={16} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionLast} id="contact">
        <div className={styles.container}>
          <Heading level={2} style={{ letterSpacing: 'var(--devlog-tracking-title)' }}>
            연락
          </Heading>

          <p className={styles.sectionNote}>
            주소를 그대로 둔다. 눌러보기 전에 어디로 가는지 알 수 있어야 한다.
          </p>

          {/*
            메일 카드는 아직 없다. 도메인이 정해지면 별칭 주소로 들어온다.
          */}
          <div className={styles.contacts}>
            <ContactCard
              address={bare(SITE.githubUrl)}
              context="만든 것과 그 과정이 전부 여기 있다."
              href={SITE.githubUrl}
              icon={<IconBrandGithub aria-hidden size={14} />}
              isExternal
              label="GitHub"
            />

            <ContactCard
              address={bare(SITE.url) + SITE.feedPath}
              context="새 글은 여기로 나간다."
              href={SITE.feedPath}
              icon={<IconRss aria-hidden size={14} />}
              label="글 구독"
            />
          </div>
        </div>
      </section>
    </main>
  );
};
