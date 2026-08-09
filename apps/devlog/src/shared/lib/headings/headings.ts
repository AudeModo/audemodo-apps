/**
 * 본문에서 소제목을 뽑는다.
 *
 * 목차와 본문의 번호 배지가 같은 목록에서 나와야 한다. 각자 세면 언젠가 어긋나고,
 * 그때 목차의 세 번째와 본문의 세 번째가 다른 곳을 가리킨다.
 *
 * 지금은 h2만 센다. 목차 깊이(h2만 vs h2+h3)는 아직 정해지지 않았다.
 */

export interface Heading {
  /** 앵커에 쓰는 식별자 */
  id: string;
  text: string;
  /** 1부터. 번호 배지에 그대로 쓴다 */
  order: number;
}

/**
 * 한글을 살리는 슬러그.
 *
 * 한글을 버리면 제목이 전부 빈 문자열이 되어 앵커가 서로 겹친다.
 */
const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^0-9a-z가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

/**
 * 소제목 목록.
 *
 * 코드블록 안의 `## `은 소제목이 아니다 — 셈에서 뺀다. 울타리 안을 세면
 * 목차에 코드 조각이 올라온다.
 */
export const extractHeadings = (source: string): Heading[] => {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  let inFence = false;

  for (const line of source.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = /^##\s+(.+?)\s*$/.exec(line);

    if (match === null) {
      continue;
    }

    const text = match[1] ?? '';
    const base = slugify(text) || `section-${String(headings.length + 1)}`;
    const seen = used.get(base) ?? 0;

    used.set(base, seen + 1);

    headings.push({
      // 같은 제목이 두 번 나오면 뒤엣것에 번호를 붙인다. 앵커가 겹치면 앞으로만 이동한다
      id: seen === 0 ? base : `${base}-${String(seen + 1)}`,
      text,
      order: headings.length + 1,
    });
  }

  return headings;
};
