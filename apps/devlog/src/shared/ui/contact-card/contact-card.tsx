import type { ReactElement, ReactNode } from 'react';

import { IconExternalLink } from '@tabler/icons-react';

import styles from './contact-card.module.css';

interface ContactCardProps {
  label: string;
  /** 모노스페이스로 그대로 노출하는 주소 */
  address: string;
  /** 주소 아래 한 줄 */
  context: string;
  href: string;
  /** 외부로 나가면 새 탭이고 ↗가 그 신호다 */
  isExternal?: boolean;
  icon: ReactNode;
}

/** 연락처 카드. 주소가 곧 내용이라 버튼처럼 감추지 않는다 */
export const ContactCard = ({
  label,
  address,
  context,
  href,
  isExternal = false,
  icon,
}: ContactCardProps): ReactElement => {
  const external = isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {};

  return (
    <a className={styles.card} href={href} {...external}>
      <span className={styles.label}>
        {icon}
        {label}
        {isExternal && <IconExternalLink aria-hidden size={14} />}
      </span>

      <div className={styles.address}>{address}</div>

      <p className={styles.context}>{context}</p>
    </a>
  );
};
