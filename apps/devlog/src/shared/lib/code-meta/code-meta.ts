/**
 * 코드 울타리의 메타 문자열을 읽는다.
 *
 *     ```ts title="steiger.config.ts" {4,5}
 *
 * 파일명과 강조할 줄을 마크다운 문법으로는 실을 수 없어 메타에 싣는다.
 * 마크다운이 무시하고 넘기는 자리이므로 다른 도구를 깨뜨리지 않는다.
 */

export interface CodeMeta {
  /** 헤더에 적을 파일명. 없으면 헤더도 없다 */
  title: string | null;
  /** 1부터 세는 줄 번호. 오름차순 · 중복 없음 */
  highlighted: number[];
}

/** `{4,5}` · `{4-6}` · `{1,4-6}` 를 줄 번호 목록으로 편다 */
const parseRanges = (spec: string): number[] => {
  const lines = new Set<number>();

  for (const part of spec.split(',')) {
    const range = /^\s*(\d+)\s*-\s*(\d+)\s*$/.exec(part);

    if (range !== null) {
      const from = Number(range[1]);
      const to = Number(range[2]);

      // 거꾸로 적어도 같게 다룬다. 사람이 적는 값이다
      for (let line = Math.min(from, to); line <= Math.max(from, to); line += 1) {
        lines.add(line);
      }

      continue;
    }

    const single = /^\s*(\d+)\s*$/.exec(part);

    if (single !== null) {
      lines.add(Number(single[1]));
    }
  }

  return [...lines].filter((line) => line > 0).sort((a, b) => a - b);
};

export const parseCodeMeta = (meta: string | undefined): CodeMeta => {
  if (meta === undefined || meta === '') {
    return { title: null, highlighted: [] };
  }

  const title = /title="([^"]*)"/.exec(meta)?.[1] ?? /title='([^']*)'/.exec(meta)?.[1] ?? null;
  const ranges = /\{([\d,\s-]+)\}/.exec(meta)?.[1];

  return {
    title: title === '' ? null : title,
    highlighted: ranges === undefined ? [] : parseRanges(ranges),
  };
};
