import type { NowItem } from '@/entities/dashboard';
import type { ProjectSummary } from '@/entities/project';

/** 진행. 세는 단위가 종류마다 달라 함께 들고 다닌다 */
export interface NowProgress {
  done: number;
  total: number;
  unit: string;
}

/** 화면에 놓이는 한 줄. 종류마다 다른 출처를 여기서 하나로 만든다 */
export interface NowRow {
  key: string;
  kind: NowItem['kind'];
  title: string;
  /** 한 줄 덧말. 프로젝트는 진행 중인 마일스톤 이름이 여기 온다 */
  note: string | null;
  progress: NowProgress | null;
}

/**
 * 진행 막대를 칸으로 그릴지 이어서 그릴지.
 *
 * **가르는 것은 수가 아니라 종류다.** 마일스톤 단계와 연작 편 수는 하나씩 끝나는
 * 것이라 칸이 곧 뜻을 가진다. 책 장 수는 어디까지 왔는가만 말하므로 이어 그린다.
 *
 * `total`이 작으면 칸으로 두는 규칙도 되지만 그러면 9단계짜리가 연속으로 넘어간다 —
 * 세는 것이 달라진 게 아니라 개수만 늘었을 뿐인데 그림이 바뀐다.
 */
export const barStyleOf = (kind: NowItem['kind']): 'cells' | 'continuous' =>
  kind === 'project' || kind === 'series' ? 'cells' : 'continuous';

/**
 * 「지금 하는 것」의 줄을 만든다.
 *
 * 종류마다 **진행 수치의 출처가 다르다.** 프로젝트는 그 프로젝트의 마일스톤에서,
 * 연작은 쓴 글 수에서 나온다. 학습과 읽는 중만 JSON에 적힌 값을 그대로 쓴다 —
 * 그 둘은 저장소 안에 출처가 없다.
 *
 * 이 갈림을 화면이 아니라 여기서 처리한다. 화면은 줄을 받아 그리기만 한다.
 */
export const toNowRows = (
  items: NowItem[],
  projects: ProjectSummary[],
  seriesCount: (series: string) => number,
): NowRow[] =>
  items.map((item): NowRow => {
    if (item.kind === 'project') {
      const project = projects.find((candidate) => candidate.slug === item.slug);

      // 검증을 통과했어도 가리키는 곳이 없을 수 있다. 조용히 빈 줄을 그리지 않는다
      if (project === undefined) {
        throw new Error(`now.json — 「${item.slug}」 프로젝트가 없다`);
      }

      const active = project.milestones?.find((milestone) => milestone.state === 'active');
      const steps = active?.steps;

      return {
        key: `project:${item.slug}`,
        kind: item.kind,
        title: project.name,
        note: active?.title ?? null,
        progress: steps === undefined ? null : { ...steps, unit: '단계' },
      };
    }

    if (item.kind === 'series') {
      return {
        key: `series:${item.series}`,
        kind: item.kind,
        title: item.series,
        note: null,
        progress: { done: seriesCount(item.series), total: item.total, unit: '편' },
      };
    }

    return {
      key: `${item.kind}:${item.title}`,
      kind: item.kind,
      title: item.title,
      note: null,
      progress: { done: item.done, total: item.total, unit: item.unit },
    };
  });
