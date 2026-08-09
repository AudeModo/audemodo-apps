import type { FeedChannel, FeedItem } from './feed';

import { describe, expect, it } from 'vitest';

import { buildRssFeed } from './feed';

const CHANNEL: FeedChannel = {
  title: 'devlog',
  description: '만들고 기록하는 사람의 작업실',
  siteUrl: 'https://example.test',
  feedPath: '/feed.xml',
  language: 'ko',
};

const item = (overrides: Partial<FeedItem> = {}): FeedItem => ({
  title: '첫 글',
  description: '첫 글의 요약',
  path: '/posts/first',
  publishedAt: '2026-07-01T09:30:00+09:00',
  ...overrides,
});

/** 빌드 시각을 인자로 받으므로 결과가 실행 시각에 흔들리지 않는다 */
const BUILD_DATE = new Date('2026-08-09T00:00:00Z');

const build = (items: FeedItem[] = [item()]) => buildRssFeed(CHANNEL, items, BUILD_DATE);

describe('buildRssFeed', () => {
  it('XML 선언으로 시작한다', () => {
    expect(build().startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });

  it('채널 정보를 싣는다', () => {
    const xml = build();

    expect(xml).toContain('<title>devlog</title>');
    expect(xml).toContain('<link>https://example.test</link>');
    expect(xml).toContain('<language>ko</language>');
  });

  it('피드가 자기 주소를 밝힌다', () => {
    expect(build()).toContain(
      '<atom:link href="https://example.test/feed.xml" rel="self" type="application/rss+xml" />',
    );
  });

  it('항목의 주소를 절대 경로로 만든다', () => {
    // 리더는 이 글이 어느 사이트의 것인지 모른다. 상대 경로면 따라올 수 없다.
    expect(build()).toContain('<link>https://example.test/posts/first</link>');
  });

  it('슬래시가 겹쳐도 주소가 깨지지 않는다', () => {
    const xml = buildRssFeed(
      { ...CHANNEL, siteUrl: 'https://example.test/' },
      [item()],
      BUILD_DATE,
    );

    expect(xml).toContain('<link>https://example.test/posts/first</link>');
    expect(xml).not.toContain('example.test//');
  });

  it('주소를 항목의 식별자로 쓴다', () => {
    expect(build()).toContain('<guid isPermaLink="true">https://example.test/posts/first</guid>');
  });

  it('시각을 RFC 822로 적는다', () => {
    // ISO를 그대로 넣으면 리더마다 다르게 읽는다. 09:30 KST는 00:30 GMT다.
    expect(build()).toContain('<pubDate>Wed, 01 Jul 2026 00:30:00 GMT</pubDate>');
  });

  it('빌드 시각을 lastBuildDate로 적는다', () => {
    expect(build()).toContain('<lastBuildDate>Sun, 09 Aug 2026 00:00:00 GMT</lastBuildDate>');
  });

  it('XML에서 뜻을 갖는 글자를 실체 참조로 바꾼다', () => {
    // 제목에 &가 하나만 들어가도 문서가 깨져 리더가 통째로 읽기를 포기한다
    const xml = build([item({ title: 'a & b < c > d "e" \'f\'' })]);

    expect(xml).toContain('<title>a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;</title>');
  });

  it('바꾼 글자를 잘라내지는 않는다', () => {
    const xml = build([item({ description: 'Steiger & knip' })]);

    expect(xml).toContain('Steiger &amp; knip');
  });

  it('한글을 그대로 싣는다', () => {
    expect(build([item({ title: '회고 · 트러블슈팅' })])).toContain('회고 · 트러블슈팅');
  });

  it('항목 순서를 받은 순서 그대로 둔다', () => {
    const xml = build([
      item({ title: '새 글', path: '/posts/new' }),
      item({ title: '옛 글', path: '/posts/old' }),
    ]);

    expect(xml.indexOf('새 글')).toBeLessThan(xml.indexOf('옛 글'));
  });

  it('글이 없어도 유효한 채널을 낸다', () => {
    const xml = build([]);

    expect(xml).toContain('<channel>');
    expect(xml).toContain('</rss>');
    expect(xml).not.toContain('<item>');
  });
});
