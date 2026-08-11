import { getFrontmatter } from 'next-mdx-remote-client/utils';

/** MDX 원문을 frontmatter와 본문으로 분리한 결과 */
export interface ParsedPost {
  /** 아직 따지지 않은 값. `parsePostFrontmatter`가 확인한다 */
  frontmatter: Record<string, unknown>;
  content: string;
}

/**
 * MDX 원문에서 frontmatter와 본문을 분리한다.
 *
 * **나누기만 한다.** 따지는 것은 `parsePostFrontmatter`의 일이다 — 읽는 것과 따지는 것을
 * 나눠 두면 따지는 쪽이 파일 없이 테스트된다.
 *
 * 그래서 여기서는 `PostFrontmatter`로 좁히지 않는다. 좁혔다고 적으면 그것이 곧 캐스팅이고,
 * 확인하지 않은 것을 확인했다고 적는 셈이 된다.
 */
export const parsePost = (raw: string): ParsedPost => {
  const { frontmatter, strippedSource } = getFrontmatter<Record<string, unknown>>(raw);

  return { frontmatter, content: strippedSource };
};
