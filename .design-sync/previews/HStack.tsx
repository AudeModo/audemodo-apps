import { Card, HStack, Text, VStack } from '@audemodo/design-system';

/** Boxes make the layout axis visible; HStack itself renders no chrome. */
const Box = ({ children }: { children: React.ReactNode }) => (
  <Card padding={2} variant="muted">
    <Text type="label">{children}</Text>
  </Card>
);

/** Spacing steps along the main axis. */
export const Gap = () => (
  <VStack gap={3}>
    {([1, 2, 4, 6] as const).map((gap) => (
      <VStack key={gap} gap={1}>
        <Text color="secondary" type="label">
          gap={gap}
        </Text>

        <HStack gap={gap}>
          <Box>하나</Box>
          <Box>둘</Box>
          <Box>셋</Box>
        </HStack>
      </VStack>
    ))}
  </VStack>
);

/** hAlign distributes items along the horizontal (main) axis. */
export const HorizontalAlign = () => (
  <VStack gap={3} width={360}>
    {(['start', 'center', 'end', 'between'] as const).map((hAlign) => (
      <VStack key={hAlign} gap={1}>
        <Text color="secondary" type="label">
          hAlign={hAlign}
        </Text>

        <HStack gap={2} hAlign={hAlign} width="100%">
          <Box>하나</Box>
          <Box>둘</Box>
        </HStack>
      </VStack>
    ))}
  </VStack>
);

/** vAlign aligns items on the cross axis when they differ in height. */
export const VerticalAlign = () => (
  <VStack gap={3}>
    {(['start', 'center', 'end', 'stretch'] as const).map((vAlign) => (
      <VStack key={vAlign} gap={1}>
        <Text color="secondary" type="label">
          vAlign={vAlign}
        </Text>

        <HStack gap={2} height={64} vAlign={vAlign}>
          <Box>짧은 항목</Box>

          <Card padding={3} variant="blue">
            <Text type="label">
              두 줄이라
              <br />
              더 높은 항목
            </Text>
          </Card>
        </HStack>
      </VStack>
    ))}
  </VStack>
);

/** Wrapping and padding. */
export const WrapAndPadding = () => (
  <VStack gap={3}>
    <VStack gap={1}>
      <Text color="secondary" type="label">
        wrap=&quot;wrap&quot; — 폭이 모자라면 다음 줄로 넘어간다
      </Text>

      <HStack gap={2} width={260} wrap="wrap">
        <Box>디자인</Box>
        <Box>시스템</Box>
        <Box>레이아웃</Box>
        <Box>프리미티브</Box>
      </HStack>
    </VStack>

    <VStack gap={1}>
      <Text color="secondary" type="label">
        padding=3 — 스택 자체의 내부 여백
      </Text>

      <Card padding={0} variant="muted">
        <HStack gap={2} padding={3}>
          <Box>하나</Box>
          <Box>둘</Box>
        </HStack>
      </Card>
    </VStack>
  </VStack>
);
