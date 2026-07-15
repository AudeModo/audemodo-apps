import { describe, expect, it } from 'vitest';

import { parsePost } from './parse-post';

/**
 * parsePost는 MDX 원문에서 frontmatter와 본문을 분리한다.
 * 이 테스트는 getFrontmatter(next-mdx-remote-client)와의 통합 동작을 박제한다 —
 * 실제 라이브러리를 그대로 쓰며(순수 함수라 모킹 불필요), 앱이 의존하는 동작을 고정한다.
 */
describe('parsePost', () => {
  // ── 정상 분리 ──
  it('frontmatter와 본문을 각각 메타와 content로 나눈다', () => {
    const raw = [
      '---',
      'title: "Hello World"',
      'summary: "A short summary"',
      'createdAt: "2026-01-01"',
      'updatedAt: "2026-02-15"',
      '---',
      '# Heading',
      '',
      'Body paragraph.',
    ].join('\n');

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter).toEqual({
      title: 'Hello World',
      summary: 'A short summary',
      createdAt: '2026-01-01',
      updatedAt: '2026-02-15',
    });
    expect(content).toBe('# Heading\n\nBody paragraph.');
  });

  // ── frontmatter 파싱 ──
  it('옵셔널 필드가 없으면 해당 키를 만들지 않는다', () => {
    const raw = '---\ntitle: T\nsummary: S\ncreatedAt: "2026-01-01"\n---\nBody.';

    const { frontmatter } = parsePost(raw);

    expect('updatedAt' in frontmatter).toBe(false);
  });

  it('인용 없는 날짜도 문자열로 유지한다', () => {
    const raw = '---\ncreatedAt: 2026-01-01\n---\nx';

    const { frontmatter } = parsePost(raw);

    expect(typeof frontmatter.createdAt).toBe('string');
    expect(frontmatter.createdAt).toBe('2026-01-01');
  });

  it('타입에 정의되지 않은 추가 필드도 그대로 통과시킨다', () => {
    const raw = '---\ntitle: T\ntags: [a, b]\ndraft: true\n---\nx';

    const { frontmatter } = parsePost(raw);

    expect(frontmatter.tags).toEqual(['a', 'b']);
    expect(frontmatter.draft).toBe(true);
  });

  // ── 본문 처리 ──
  it('frontmatter가 없으면 전체를 본문으로 두고 메타는 빈 객체다', () => {
    const raw = '# Just heading\nNo frontmatter.';

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter).toEqual({});
    expect(content).toBe('# Just heading\nNo frontmatter.');
  });

  it('빈 frontmatter 블록이면 메타는 빈 객체이고 본문만 남긴다', () => {
    const raw = '---\n---\nBody only.';

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter).toEqual({});
    expect(content).toBe('Body only.');
  });

  it('본문이 없으면 content를 빈 문자열로 둔다', () => {
    const raw = '---\ntitle: T\nsummary: S\ncreatedAt: "2026-01-01"\n---';

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter.title).toBe('T');
    expect(content).toBe('');
  });

  it('본문 앞의 빈 줄을 그대로 보존한다', () => {
    const raw = '---\ntitle: T\n---\n\n\nBody after blanks.';

    const { content } = parsePost(raw);

    expect(content).toBe('\n\nBody after blanks.');
  });

  it('본문 안의 수평선(---)을 frontmatter로 오인하지 않는다', () => {
    const raw = '---\ntitle: T\n---\nIntro.\n\n---\n\nAfter.';

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter.title).toBe('T');
    expect(content).toBe('Intro.\n\n---\n\nAfter.');
  });

  // ── 경계·에러 ──
  it('빈 문자열이면 메타는 빈 객체, content는 빈 문자열이다', () => {
    const { frontmatter, content } = parsePost('');

    expect(frontmatter).toEqual({});
    expect(content).toBe('');
  });

  it('잘못된 YAML은 에러를 던진다', () => {
    const raw = '---\ntitle: "unclosed\n---\nx';

    expect(() => parsePost(raw)).toThrow();
  });
});
