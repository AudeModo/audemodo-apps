/**
 * RSS 2.0 피드 만들기.
 *
 * 도메인을 모르게 둔다 — 글이든 프로젝트든 「제목 · 설명 · 주소 · 시각」이 있으면 된다.
 */

export interface FeedChannel {
  title: string;
  description: string;
  /** 사이트의 절대 주소. 끝에 슬래시가 있든 없든 같게 다룬다 */
  siteUrl: string;
  /** 피드 자신의 경로 (`/feed.xml`) */
  feedPath: string;
  /** BCP 47 언어 태그 */
  language: string;
}

export interface FeedItem {
  title: string;
  description: string;
  /** 사이트 기준 경로 (`/posts/어떤글`) */
  path: string;
  /** ISO 8601 */
  publishedAt: string;
}

/**
 * XML에서 뜻을 갖는 다섯 글자를 실체 참조로 바꾼다.
 *
 * 제목에 `&`나 `<`가 하나만 들어가도 피드 전체가 깨진 문서가 되어 리더가 통째로
 * 읽기를 포기한다. 잘라내지 않고 바꾼다 — 글자는 남아야 한다.
 */
const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

/** 앞뒤 슬래시가 겹치거나 빠지지 않게 잇는다 */
const join = (siteUrl: string, path: string): string =>
  `${siteUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

/**
 * RSS가 요구하는 RFC 822 시각.
 *
 * ISO를 그대로 넣으면 리더마다 다르게 읽거나 아예 못 읽는다.
 * `toUTCString()`이 정확히 이 형식을 낸다.
 */
const toRfc822 = (isoDate: string): string => new Date(isoDate).toUTCString();

export const buildRssFeed = (
  channel: FeedChannel,
  items: readonly FeedItem[],
  buildDate: Date,
): string => {
  const feedUrl = join(channel.siteUrl, channel.feedPath);

  const entries = items.map((item) => {
    const url = join(channel.siteUrl, item.path);

    return [
      '    <item>',
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      // 주소가 곧 식별자다. 글을 옮기지 않는 한 바뀌지 않는다
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${toRfc822(item.publishedAt)}</pubDate>`,
      `      <description>${escapeXml(item.description)}</description>`,
      '    </item>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(channel.title)}</title>`,
    `    <link>${escapeXml(channel.siteUrl)}</link>`,
    `    <description>${escapeXml(channel.description)}</description>`,
    `    <language>${escapeXml(channel.language)}</language>`,
    `    <lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>`,
    // 피드가 자기 주소를 알아야 리더가 옮겨진 주소를 따라올 수 있다
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    ...entries,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
};
