import { Divider, Heading, Text, VStack } from '@audemodo/design-system';

import { getPostDetail } from '@/entities/post';

import { MdxContent } from '@/shared/ui';

/** 게시글 상세 페이지 — slug로 글 하나를 불러와 메타와 본문(MDX)을 렌더한다. */
export const PostDetailPage = async ({ slug }: { slug: string }) => {
  const post = await getPostDetail(slug);

  return (
    <main>
      <article>
        <VStack gap={6}>
          <VStack gap={2}>
            <Heading level={1}>{post.title}</Heading>

            <Text as="p" color="secondary">
              {post.summary}
            </Text>

            <time dateTime={post.createdAt}>
              <Text color="secondary" size="sm">
                {post.createdAt}
              </Text>
            </time>
          </VStack>

          <Divider />

          <MdxContent source={post.content} />
        </VStack>
      </article>
    </main>
  );
};
