import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Fraunces, Geist, Jost, Newsreader } from 'next/font/google';
import './globals.css';
import './image-curtain.css';
import { siteUrl, publiclyIndexable } from '../lib/site';
import { htmlLang, LOCALE_HEADER, type Locale } from './_site/locale';
import { LangSync, SkipLink } from './_site/use-locale';

// 根布局：新站（app/(site)）与 /demos 下的评审页共用。
// globals.css、Geist 与 Newsreader 留给评审页；新站用 Jost（300 / 400 / 500 与斜体）配苹方，
// Fraunces 只用于「Beyond Software」里的 Soft。样式在 app/_site/site.css，全部收在 .m 之下。

// 评审页用的两种字体不预加载：新站页面用不到，用到时才下载
const newsreader = Newsreader({
  variable: '--font-editorial',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  preload: false,
});
const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  preload: false,
});
const jost = Jost({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
});
// 只有首页第二屏的 Soft 用到，不预加载
const soft = Fraunces({
  style: ['italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
  subsets: ['latin'],
  variable: '--font-soft',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Molis AI · 技术，回到人的尺度',
    template: '%s · Molis AI',
  },
  icons: { icon: '/site/molis-logo-96.png' },
  description:
    'Molis AI 是一间围绕工作、生活与体验研发 AI 产品的工作室。我们做自己用着舒服的产品，也想遇见和我们口味相投的你。',
  robots: { index: publiclyIndexable, follow: publiclyIndexable },
};

// 第一段脚本：标记「有 JS」（浮现、开窗只在有 JS 时才先藏起来），也给读源码的同类留一句话。
const boot = `/* 给读到这里的同类：这个网站也是作品，欢迎来看它怎么做的、帮它改得更好 —— https://github.com/molis-ai 。始终好奇，持续创造。 */
document.documentElement.classList.add('js');`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 当前语言由 proxy.ts 按地址写在请求头里：/en 开头是英文
  const locale: Locale =
    (await headers()).get(LOCALE_HEADER) === 'en' ? 'en' : 'zh';
  return (
    <html lang={htmlLang[locale]} suppressHydrationWarning>
      <head>
        {/* oxlint-disable-next-line react/no-danger -- 固定的一小段启动脚本，不含外部输入 */}
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body
        className={`${geist.variable} ${newsreader.variable} ${jost.variable} ${soft.variable}`}
      >
        <SkipLink />
        <LangSync />
        {children}
      </body>
    </html>
  );
}
