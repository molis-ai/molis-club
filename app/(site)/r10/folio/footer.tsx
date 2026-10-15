import Link from 'next/link';
import { footer, nav } from '../../../../content/site/nav';
import { productIds, products } from '../../../../content/site/products';
import { studio } from '../../../../content/site/studio';
import {
  ABOUT,
  ALONG,
  COMMUNITY,
  CONTACT,
  ENTERPRISE,
  ESSAYS,
  GITHUB,
  PRIVACY,
  TEAM,
  productHref,
} from '../../../_site/routes';
import { FOLIO_WORK } from './paths';

// 页尾：像作品集最后一页的版权页。三列小号大写的目录，下面一行出处。

const productLink = (id: (typeof productIds)[number]) =>
  id === 'work' ? FOLIO_WORK : productHref[id];

export function FolioFooter() {
  return (
    <footer className="fo-footer" data-folio="COLOPHON" data-tone="paper">
      <div className="fo-footer-top">
        <p className="fo-footer-mark" lang="en">
          Molis AI
        </p>
        <p className="fo-footer-line">
          {studio.vision}
          <br />
          {studio.signature}
        </p>
      </div>
      <div className="fo-footer-cols">
        <nav aria-label={footer.columns.products}>
          <p className="fo-caps">{footer.columns.products}</p>
          {productIds.map((id) => (
            <Link key={id} href={productLink(id)} lang="en">
              {products[id].name}
            </Link>
          ))}
        </nav>
        <nav aria-label={footer.columns.studio}>
          <p className="fo-caps">{footer.columns.studio}</p>
          <Link href={ENTERPRISE}>{nav.enterprise}</Link>
          <Link href={COMMUNITY}>{nav.community}</Link>
          <Link href={ABOUT}>{nav.aboutItems.about}</Link>
          <Link href={TEAM}>{nav.aboutItems.team}</Link>
        </nav>
        <nav aria-label={footer.columns.elsewhere}>
          <p className="fo-caps">{footer.columns.elsewhere}</p>
          <Link href={ESSAYS}>{nav.aboutItems.essays}</Link>
          <Link href={ALONG}>{nav.aboutItems.along}</Link>
          <Link href={CONTACT}>{nav.chat}</Link>
          <a href={GITHUB} target="_blank" rel="noreferrer">
            {footer.github}
          </a>
          <Link href={PRIVACY}>{footer.privacy}</Link>
        </nav>
      </div>
      <div className="fo-footer-fine">
        <p>{footer.fonts}</p>
        <p>
          {footer.images}
          标着「品牌概念图」的照片由 AI 生成，不是真实的办公室、团队、客户案例或产品界面；Molis
          Work 的界面是开发中版本的截图，画面里是演示数据。
        </p>
        <p>
          {footer.copyright}
          <span aria-hidden="true"> · </span>
          第十轮视觉稿 · 作品集（样稿，不进导航）
        </p>
      </div>
    </footer>
  );
}
