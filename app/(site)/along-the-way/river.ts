import {
  alongGroups,
  flowOf,
  flows,
  type AlongItem,
  type Flow,
} from '../../../content/site/along';

// 沿途河图的版面：纯计算，服务端渲染与浏览器里的动画共用。
// 左边八个源头（附录 A 的八组），右边七个去处；每件尝试一条线，从它所在的组流到它的去处。
// 同一个去处里按源头的顺序排，线尽量不交叉。

export type Size = {
  /** 视框宽高 */
  w: number;
  h: number;
  /** 源头与去处那两根竖条的 x */
  from: number;
  to: number;
  /** 上下留白、组与组之间的空隙 */
  pad: number;
  gapFrom: number;
  gapTo: number;
};

export const wide: Size = {
  w: 1200,
  h: 600,
  from: 230,
  to: 960,
  pad: 18,
  gapFrom: 16,
  gapTo: 20,
};
export const narrow: Size = {
  w: 360,
  h: 640,
  from: 92,
  to: 248,
  pad: 14,
  gapFrom: 14,
  gapTo: 16,
};

export type Thread = {
  item: AlongItem;
  /** 整页连续编号（与索引一致） */
  no: number;
  group: number;
  flow: Flow;
  /** 起点、终点的 y */
  y0: number;
  y1: number;
  d: string;
};

export type Band = { y0: number; y1: number; count: number };

export type Layout = {
  size: Size;
  threads: Thread[];
  sources: Band[];
  sinks: Record<Flow, Band>;
};

const all = alongGroups.flatMap((group, g) =>
  group.items.map((item) => ({ item, group: g, flow: flowOf(item) })),
);
export const total = all.length;

export function layout(size: Size): Layout {
  const usable = (gap: number, groups: number) =>
    (size.h - 2 * size.pad - gap * (groups - 1)) / total;

  // 源头：按组依次排
  const slotFrom = usable(size.gapFrom, alongGroups.length);
  const sources: Band[] = [];
  let y = size.pad;
  const startY = new Map<AlongItem, number>();
  alongGroups.forEach((group, g) => {
    const y0 = y;
    group.items.forEach((item) => {
      startY.set(item, y + slotFrom / 2);
      y += slotFrom;
    });
    sources.push({ y0, y1: y, count: group.items.length });
    y += g < alongGroups.length - 1 ? size.gapFrom : 0;
  });

  // 去处：按 flows 的顺序排，每个去处里按源头顺序
  const used = flows.filter((flow) => all.some((row) => row.flow === flow));
  const slotTo = usable(size.gapTo, used.length);
  const sinks = {} as Record<Flow, Band>;
  const endY = new Map<AlongItem, number>();
  y = size.pad;
  used.forEach((flow, index) => {
    const rows = all.filter((row) => row.flow === flow);
    const y0 = y;
    rows.forEach(({ item }) => {
      endY.set(item, y + slotTo / 2);
      y += slotTo;
    });
    sinks[flow] = { y0, y1: y, count: rows.length };
    y += index < used.length - 1 ? size.gapTo : 0;
  });

  const mid = (size.from + size.to) / 2;
  const threads = all.map(({ item, group, flow }, index) => {
    const y0 = startY.get(item)!;
    const y1 = endY.get(item)!;
    return {
      item,
      no: index + 1,
      group,
      flow,
      y0,
      y1,
      d: `M${size.from} ${y0.toFixed(1)} C${mid} ${y0.toFixed(1)} ${mid} ${y1.toFixed(1)} ${size.to} ${y1.toFixed(1)}`,
    };
  });
  return { size, threads, sources, sinks };
}

/** 三次贝塞尔上 t 处的点（动画里让点沿线走） */
export function pointAt(size: Size, y0: number, y1: number, t: number) {
  const mid = (size.from + size.to) / 2;
  const u = 1 - t;
  const x =
    u * u * u * size.from +
    3 * u * u * t * mid +
    3 * u * t * t * mid +
    t * t * t * size.to;
  const yy =
    u * u * u * y0 + 3 * u * u * t * y0 + 3 * u * t * t * y1 + t * t * t * y1;
  return { x, y: yy };
}
