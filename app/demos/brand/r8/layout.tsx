import { Fraunces, Jost } from 'next/font/google';
import { folioHomeCopy } from '../../../../content/folio';

// 第八轮首页：白盒子美术馆的底子，换成真实的光和风景。字体已定为「留白」：
// Jost（300 / 400 / 500 与斜体）配系统苹方，几个方向共用。
// 唯一的例外是「Beyond Software」里的 Soft：用 Fraunces 的柔边斜体（SOFT 轴拉满），字面上就是「软」。
const jost = Jost({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-r8-jost',
  display: 'swap',
});

const soft = Fraunces({
  style: ['italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  subsets: ['latin'],
  variable: '--font-r8-soft',
  display: 'swap',
});

export const metadata = {
  title: { absolute: 'Molis AI · 第八轮首页方向' },
  description: folioHomeCopy.description,
  robots: { index: false, follow: false },
};

export default function R8Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${jost.variable} ${soft.variable}`}>{children}</div>;
}
