import type { Pulse } from './pulse';

// 服务端和浏览器都能用的几样格式：周几、构建状态、千位分隔。

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

/** 周几：用在七天的刻度下面 */
export function weekdayOf(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

/** 构建状态写成中文 */
export function buildText(build: NonNullable<Pulse['build']>) {
  if (build.status !== 'completed') return '构建进行中';
  switch (build.conclusion) {
    case 'success':
      return '构建通过';
    case 'failure':
      return '构建没通过';
    case 'cancelled':
      return '构建已取消';
    default:
      return '构建已结束';
  }
}

export const grouped = (n: number) => n.toLocaleString('en-US');

/** 北京时间的钟点：15:36 */
export function cstClock(iso: string) {
  const d = new Date(Date.parse(iso) + 8 * 3_600_000);
  const two = (n: number) => String(n).padStart(2, '0');
  return `${two(d.getUTCHours())}:${two(d.getUTCMinutes())}`;
}
