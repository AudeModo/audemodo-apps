// ListItem is only meaningful inside a List — every export composes it in its
// parent, which is the only render that is true anyway.
import { Link, List, ListItem, Text } from '@audemodo/design-system';

/** Label + description, the shape apps/devlog posts-list-page uses. */
export const LabelAndDescription = () => (
  <List hasDividers>
    <ListItem
      description="날짜만 저장하던 필드를 시각까지 담도록 바꾸면서 정렬과 표시를 맞췄다."
      label={<Link href="/posts/created-at-to-datetime">createdAt을 시각 단위로 바꾸다</Link>}
    />

    <ListItem
      description="벤더 컴포넌트를 그대로 노출하지 않고 경계를 두면 무엇이 좋아지는가."
      label={<Link href="/posts/design-system-boundary">디자인 시스템의 경계 설계</Link>}
    />
  </List>
);

/** startContent and endContent fill the leading and trailing slots. */
export const Slots = () => (
  <List hasDividers>
    <ListItem
      description="startContent에 순번, endContent에 개수를 넣었다"
      endContent={
        <Text color="secondary" hasTabularNumbers type="label">
          12
        </Text>
      }
      label="앞뒤 슬롯을 모두 채운 항목"
      startContent={
        <Text color="secondary" hasTabularNumbers type="label">
          01
        </Text>
      }
    />

    <ListItem
      endContent={<Text color="secondary">›</Text>}
      label="트레일링 셰브런만 있는 항목"
      startContent={
        <Text color="secondary" hasTabularNumbers type="label">
          02
        </Text>
      }
    />
  </List>
);

/** Selection and disabled — the statically renderable states. */
export const States = () => (
  <List hasDividers>
    <ListItem description="기본 상태" label="기본 항목" />

    <ListItem isSelected description="isSelected가 켜진 항목" label="선택된 항목" />

    <ListItem isDisabled description="isDisabled가 켜진 항목" label="비활성 항목" />
  </List>
);

/** href turns the whole row into a link and enables hover/press styling. */
export const AsLink = () => (
  <List hasDividers>
    <ListItem description="행 전체가 링크가 된다" href="/posts" label="글 목록" />

    <ListItem
      description="target=_blank이면 rel이 자동으로 붙는다"
      href="https://github.com/facebook/astryx"
      label="Astryx 저장소"
      target="_blank"
    />
  </List>
);
