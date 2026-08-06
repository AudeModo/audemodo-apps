import { Card, Divider, Heading, Link, Text, VStack } from '@audemodo/design-system';

/** The canonical use: a post summary card built from the DS's own primitives. */
export const PostSummary = () => (
  <Card padding={4} maxWidth={300}>
    <VStack gap={2}>
      <Heading level={3}>createdAt을 시각 단위로 바꾸고 비교·표시를 맞춘다</Heading>

      <Text as="p" color="secondary">
        날짜만 저장하던 필드를 시각까지 담도록 바꾸면서, 정렬 비교와 화면 표시가 같은 기준을
        쓰도록 정리했다.
      </Text>

      <Divider />

      <Link href="/posts/created-at-to-datetime">이어서 읽기</Link>
    </VStack>
  </Card>
);

/** The primary variant axis — background colour. */
export const Variants = () => (
  <>
    {(
      ['default', 'muted', 'transparent', 'blue', 'green', 'orange', 'red', 'purple'] as const
    ).map((variant) => (
      <Card key={variant} variant={variant} padding={3} width={160}>
        <Text type="label">{variant}</Text>
      </Card>
    ))}
  </>
);

/** Resting shadow depth, from flat to lifted. */
export const Elevations = () => (
  <>
    {(['none', 'low', 'med', 'high'] as const).map((elevation) => (
      <Card key={elevation} elevation={elevation} padding={3} width={140}>
        <Text type="label">elevation={elevation}</Text>
      </Card>
    ))}
  </>
);

/** Internal padding from the spacing scale. */
export const Padding = () => (
  <>
    {([0, 2, 4, 6] as const).map((padding) => (
      <Card key={padding} padding={padding} width={140} variant="muted">
        <Text type="label">padding={padding}</Text>
      </Card>
    ))}
  </>
);
