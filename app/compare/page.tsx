import Link from 'next/link';
import { pageMetadata } from '../../lib/site';
import './compare.css';
export const metadata = pageMetadata(
  '两种工作室',
  'Molis AI 的两套完整设计。',
  '/compare',
);
const pages = [
  ['首页', '/'],
  ['社区', '/community'],
  ['百科', '/wiki'],
  ['艺术家 Skill', '/wiki/artists'],
  ['产品', '/products'],
  ['解决方案', '/solutions'],
  ['观点', '/perspectives'],
  ['团队', '/community/adeptify'],
  ['创作者', '/community/yijun'],
  ['产品详情', '/works/elsewhere'],
  ['方案详情', '/works/aether'],
  ['动效与 Prompt', '/wiki/stagger'],
  ['艺术家方法', '/wiki/artists/monet-impressionism'],
  ['观点阅读', '/story/human-scale'],
  ['登录', '/login'],
  ['联系', '/join'],
  ['账号', '/account'],
  ['隐私', '/privacy'],
];
export default function Compare() {
  return (
    <main id="main" className="compare-page">
      <header>
        <Link href="/">Molis AI</Link>
        <span>设计对比</span>
      </header>
      <h1>
        两种工作室，
        <br />
        同一份好奇。
      </h1>
      <div className="compare-editions">
        <Link href="/" className="compare-a">
          <span>A</span>
          <h2>流动与留白</h2>
          <p>水光、插画与纸面阅读。</p>
        </Link>
        <Link href="/atelier" className="compare-b">
          <img
            src="/images/atelier/makers-conversation.jpg"
            width="1920"
            height="1080"
            alt="围桌交流的四位创作者插画"
          />
          <div>
            <span>B</span>
            <h2>日常里的创作</h2>
            <p>围桌的人、自然光与成组的画面。</p>
          </div>
        </Link>
      </div>
      <section>
        <h2>逐页看看</h2>
        <div className="compare-routes">
          {pages.map(([label, path]) => (
            <div key={path}>
              <span>{label}</span>
              <Link href={path} aria-label={`A 版${label}`}>
                A
              </Link>
              <Link
                href={path === '/' ? '/atelier' : '/atelier' + path}
                aria-label={`B 版${label}`}
              >
                B
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
