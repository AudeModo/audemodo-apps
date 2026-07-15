import type { PostFrontmatter } from '../model/types';

import { describe, expect, it } from 'vitest';

import { parsePost } from './parse-post';

describe('parsePost', () => {
  it('frontmatter와 본문을 분리한다', () => {
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

  it('옵셔널 필드(updatedAt)가 없으면 키 자체가 존재하지 않는다', () => {
    const raw = '---\ntitle: T\nsummary: S\ncreatedAt: "2026-01-01"\n---\nBody.';

    const { frontmatter } = parsePost(raw);

    expect('updatedAt' in frontmatter).toBe(false);
  });

  it('인용 없는 날짜도 Date가 아니라 문자열로 유지한다', () => {
    const raw = '---\ncreatedAt: 2026-01-01\n---\nx';

    const { frontmatter } = parsePost(raw);

    expect(typeof frontmatter.createdAt).toBe('string');
    expect(frontmatter.createdAt).toBe('2026-01-01');
  });

  it('frontmatter가 없으면 빈 객체를 주고 본문을 그대로 둔다', () => {
    const raw = '# Just heading\nNo frontmatter.';

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter).toEqual({});
    expect(content).toBe('# Just heading\nNo frontmatter.');
  });

  it('빈 frontmatter 블록도 빈 객체로 처리한다', () => {
    const raw = '---\n---\nBody only.';

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter).toEqual({});
    expect(content).toBe('Body only.');
  });

  it('본문 안의 수평선(---)은 건드리지 않는다', () => {
    const raw = '---\ntitle: T\n---\nIntro.\n\n---\n\nAfter.';

    const { frontmatter, content } = parsePost(raw);

    expect(frontmatter.title).toBe('T');
    expect(content).toBe('Intro.\n\n---\n\nAfter.');
  });

  it('정의되지 않은 추가 필드도 YAML 타입 그대로 통과시킨다', () => {
    const raw = '---\ntitle: T\ntags: [a, b]\ndraft: true\n---\nx';

    const { frontmatter } = parsePost(raw);
    const extra = frontmatter as PostFrontmatter & Record<string, unknown>;

    expect(extra.tags).toEqual(['a', 'b']);
    expect(extra.draft).toBe(true);
  });

  it('잘못된 YAML은 에러를 던진다', () => {
    const raw = '---\ntitle: "unclosed\n---\nx';

    expect(() => parsePost(raw)).toThrow();
  });

  it('빈 문자열이면 빈 객체와 빈 본문을 준다', () => {
    const { frontmatter, content } = parsePost('');

    expect(frontmatter).toEqual({});
    expect(content).toBe('');
  });
});
