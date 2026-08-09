import { getPostSummaries } from '@/entities/post/server';

import { SITE } from '@/shared/config';
import { buildRssFeed } from '@/shared/lib';

/**
 * 피드는 화면이 아니라 파일이다. 빌드 시점에 한 번 만들어 정적으로 내보낸다 —
 * 글이 전부 빌드에 들어가 있어 요청마다 다시 만들 이유가 없다.
 */
export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  const posts = await getPostSummaries();

  const xml = buildRssFeed(
    {
      title: `${SITE.name} · Audemodo`,
      description: SITE.tagline,
      siteUrl: SITE.url,
      feedPath: SITE.feedPath,
      language: 'ko',
    },
    posts.map((post) => ({
      title: post.title,
      description: post.summary,
      path: `/posts/${post.slug}`,
      publishedAt: post.createdAt,
    })),
    new Date(),
  );

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
