import { Heading, Link, List, ListItem, VStack } from '@audemodo/design-system';

import { getPostSummaries } from '@/entities/post';

/** 게시글 목록 페이지 */
export const PostsListPage = async () => {
  const summaries = await getPostSummaries();

  return (
    <main>
      <VStack gap={6}>
        <Heading level={1}>글 목록</Heading>

        <List hasDividers>
          {summaries.map((post) => (
            <ListItem
              key={post.slug}
              description={post.summary}
              label={<Link href={`/posts/${post.slug}`}>{post.title}</Link>}
            />
          ))}
        </List>
      </VStack>
    </main>
  );
};
