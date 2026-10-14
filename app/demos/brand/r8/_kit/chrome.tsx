'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { footer, navLabels, signature } from '../../../../../content/studio';
import { folioStudio } from '../../../../../content/folio';
import { productHref, productName, productIds } from '../../gallery/routes';
import { ABOUT, COMMUNITY, CONTACT, ESSAYS, SOLUTIONS } from './data';
import { directions, R8, type DirectionId } from './directions';
import { useR8Motion } from './motion';

// 顶栏、页尾和右下角的「方向」切换。顶栏在首屏上透明，滚动后换成纸色加模糊、下面一道细线。

function Header() {
  const links = [
    { href: '#products', label: navLabels.products },
    { href: SOLUTIONS, label: navLabels.solutions },
    { href: COMMUNITY, label: navLabels.community },
    { href: ESSAYS, label: folioStudio.nav.essays },
    { href: ABOUT, label: folioStudio.labels.team.zh },
  ];
  return (
    <header className="r8-header">
      <Link href={R8} className="r8-logo" aria-label="Molis AI 首页方向">
        <img src="/images/molis-logo.png" width="30" height="30" alt="" />
        <span lang="en">Molis AI</span>
      </Link>
      <nav className="r8-nav" aria-label="主导航">
        {links.map((link) => (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Link className="r8-header-cta" href={CONTACT}>
        {navLabels.contact}
      </Link>
    </header>
  );
}

function Footer() {
  return (
    <footer className="r8-footer">
      <div className="r8-footer-lead">
        <span className="r8-footer-brand">
          <img
            src="/images/molis-logo.png"
            width="28"
            height="28"
            alt=""
            loading="lazy"
          />
          <span lang="en">Molis AI</span>
        </span>
        <p>{signature}</p>
      </div>
      <nav className="r8-footer-links" aria-label="页尾导航">
        <div>
          <h2>{footer.productsLabel}</h2>
          <ul>
            {productIds.map((id) => (
              <li key={id}>
                <Link href={productHref[id]} lang="en">
                  {productName[id]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{footer.studioLabel}</h2>
          <ul>
            <li>
              <Link href={SOLUTIONS}>{footer.studio.solutions}</Link>
            </li>
            <li>
              <Link href={ESSAYS}>{folioStudio.nav.essays}</Link>
            </li>
            <li>
              <Link href={COMMUNITY}>{footer.studio.community}</Link>
            </li>
            <li>
              <Link href={ABOUT}>{folioStudio.labels.team.zh}</Link>
            </li>
            <li>
              <Link href={CONTACT}>{footer.studio.contact}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>GitHub</h2>
          <ul>
            <li>
              <a href={footer.github} target="_blank" rel="noreferrer">
                github.com/molis-ai
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <p className="r8-footer-base">
        <span>{footer.copyright}</span>
        <span>
          影像来自{' '}
          <a href="https://mixkit.co/" target="_blank" rel="noreferrer">
            Mixkit
          </a>{' '}
          与{' '}
          <a href="https://unsplash.com/" target="_blank" rel="noreferrer">
            Unsplash
          </a>
          （免费授权素材，仅作评审样张）
        </span>
      </p>
      <p className="r8-footer-mark" aria-hidden="true" lang="en">
        Molis AI
      </p>
    </footer>
  );
}

/** 评审用：右下角一枚小切换，在三个方向之间跳，不属于设计本身 */
function DirectionDock({ current }: { current: DirectionId }) {
  return (
    <nav className="r8-dock" aria-label="切换方向">
      <Link href={R8} className="r8-dock-all">
        第八轮
      </Link>
      {directions.map((direction, index) => (
        <Link
          key={direction.id}
          href={`${R8}/${direction.id}`}
          aria-current={direction.id === current ? 'page' : undefined}
        >
          <b>{index + 1}</b>
          <span>{direction.name}</span>
        </Link>
      ))}
    </nav>
  );
}

/** 一个方向的整页外壳：根节点带方向的类名（换颜色、光与场景），里面是顶栏、正文、页尾 */
export function Page({
  direction,
  style,
  children,
}: {
  direction: DirectionId;
  /** 方向自己要的根变量（例如程序画好的树影位图） */
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const ref = useR8Motion<HTMLDivElement>();
  return (
    <div className={`r8 r8-${direction}`} ref={ref} style={style}>
      <a className="r8-skip" href="#main">
        跳到正文
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <DirectionDock current={direction} />
    </div>
  );
}
