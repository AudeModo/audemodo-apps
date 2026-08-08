import { Divider, Heading, Text, VStack } from '@audemodo/design-system';

import { formatPostDate, getPostDetail } from '@/entities/post';

import { MdxContent } from '@/shared/ui';

/** 게시글 상세 페이지 */
export const PostDetail = async ({ slug }: { slug: string }) => {
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
              <Text color="secondary" type="supporting">
                {formatPostDate(post.createdAt)}
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
