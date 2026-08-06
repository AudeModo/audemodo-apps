import { Card, Heading, Link, Text, VStack } from '@audemodo/design-system';

const Box = ({ children }: { children: React.ReactNode }) => (
  <Card padding={2} variant="muted">
    <Text type="label">{children}</Text>
  </Card>
);

/** Ported from apps/devlog not-found.tsx — VStack is the page-level layout primitive. */
export const PageLayout = () => (
  <VStack gap={4} maxWidth={420}>
    <Heading level={1}>페이지를 찾을 수 없습니다</Heading>

    <Text as="p" color="secondary">
      주소가 바뀌었거나 삭제된 글일 수 있습니다.
    </Text>

    <Link href="/posts">글 목록으로 가기</Link>
  </VStack>
);

/** Spacing steps along the main axis. */
export const Gap = () => (
  <VStack gap={4}>
    {([1, 2, 4, 6] as const).map((gap) => (
      <VStack key={gap} gap={1}>
        <Text color="secondary" type="label">
          gap={gap}
        </Text>

        <VStack gap={gap}>
          <Box>하나</Box>
          <Box>둘</Box>
          <Box>셋</Box>
        </VStack>
      </VStack>
    ))}
  </VStack>
);

/** hAlign is the cross axis on a vertical stack. */
export const HorizontalAlign = () => (
  <VStack gap={3} width={300}>
    {(['start', 'center', 'end', 'stretch'] as const).map((hAlign) => (
      <VStack key={hAlign} gap={1}>
        <Text color="secondary" type="label">
          hAlign={hAlign}
        </Text>

        <VStack gap={2} hAlign={hAlign} width="100%">
          <Box>하나</Box>
          <Box>조금 더 긴 항목</Box>
        </VStack>
      </VStack>
    ))}
  </VStack>
);

/** vAlign distributes items along the vertical (main) axis within a fixed height. */
export const VerticalAlign = () => (
  <VStack gap={3}>
    {(['start', 'center', 'between'] as const).map((vAlign) => (
      <VStack key={vAlign} gap={1}>
        <Text color="secondary" type="label">
          vAlign={vAlign}
        </Text>

        <Card padding={0} variant="muted">
          <VStack gap={2} height={120} padding={2} vAlign={vAlign}>
            <Box>위</Box>
            <Box>아래</Box>
          </VStack>
        </Card>
      </VStack>
    ))}
  </VStack>
);
