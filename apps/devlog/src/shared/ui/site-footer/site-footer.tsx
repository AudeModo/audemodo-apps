import type { ReactElement } from 'react';

import { Text, VStack } from '@audemodo/design-system';
import { IconExternalLink } from '@tabler/icons-react';

import { SITE } from '../../config';
import styles from './site-footer.module.css';

/**
 * 저작권 연도는 빌드 시점의 해다.
 *
 * 손으로 적으면 해가 바뀌어도 그대로 남아 거짓이 된다. 정적 사이트라 이 값도 빌드에
 * 굳지만, 굳는 주기가 배포 주기라 사람이 고치는 것보다 늦지 않는다.
 */
const buildYear = (): number => new Date().getFullYear();

/** 아홉 화면 전부에 있는 푸터 */
export const SiteFooter = (): ReactElement => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <VStack gap={1.5}>
            <span className={styles.brand}>{SITE.name}</span>

            <Text color="secondary" type="supporting">
              {SITE.tagline}
            </Text>
          </VStack>

          <div className={styles.links}>
            {/* 외부는 새 탭이고 ↗가 그 신호다. 내부 이동에는 붙이지 않는다 */}
            <a
              className={styles.link}
              href={SITE.githubUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
              <IconExternalLink aria-hidden size={16} />
            </a>

            <a className={styles.link} href={`mailto:${SITE.email}`}>
              메일 보내기
            </a>

            <a className={styles.link} href={SITE.feedPath}>
              글 구독
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <Text color="secondary" hasTabularNumbers type="supporting">
            © {buildYear()} {SITE.name}
          </Text>
        </div>
      </div>
    </footer>
  );
};
