import { Heading, Link, Text, VStack } from '@audemodo/design-system';

/** 404 페이지 — 존재하지 않는 경로로 들어왔을 때 보여준다. */
export default function NotFound() {
  return (
    <main>
      <VStack gap={4}>
        <Heading level={1}>페이지를 찾을 수 없습니다</Heading>

        <Text as="p" color="secondary">
          주소가 바뀌었거나 삭제된 글일 수 있습니다.
        </Text>

        <Link href="/posts">글 목록으로 가기</Link>
      </VStack>
    </main>
  );
}
