import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  isSoon,
  products,
  soon,
  stageOf,
  type ProductId,
} from '../../../content/site/products';
import { essayHref, productHref } from '../../_site/routes';
import { More, Status } from '../../_site/ui';

// 「关于」两版一整页共用的正文写法：原句里的书名、产品名换成行内链接；只有一句的短段当作节拍；
// 先不开放的产品第一次出现时下面写一行「探索中，敬请期待」；有标题和说明的去处只留圆形箭头。

/** 按句号、问号切句 */
export const sentences = (text: string) =>
  text.match(/[^。？！]+[。？！]?/g) ?? [text];

/** 把原句里的书名、产品名换成行内链接（每个只链第一次出现），其余一字不动 */
export function Linked({
  text,
  links,
}: {
  text: string;
  links: Array<[string, string]>;
}) {
  const out: ReactNode[] = [];
  const pending = [...links];
  let rest = text;
  while (pending.length) {
    let at = -1;
    let pick = -1;
    pending.forEach(([term], index) => {
      const found = rest.indexOf(term);
      if (found >= 0 && (at < 0 || found < at)) {
        at = found;
        pick = index;
      }
    });
    if (pick < 0) break;
    const [term, href] = pending.splice(pick, 1)[0];
    out.push(rest.slice(0, at));
    out.push(
      <Link key={term} className="m-inline" href={href}>
        {term}
      </Link>,
    );
    rest = rest.slice(at + term.length);
  }
  out.push(rest);
  return <>{out}</>;
}

/** 底稿句子里怎样称呼每件产品（行内链接、找第一次出现都按这个） */
export const TERMS: Record<ProductId, string> = {
  work: 'Molis Work',
  tool: 'Molis Tool',
  life: 'Life',
  story: 'Story',
  world: 'Molis World',
};
/**
 * 先不开放的产品（负责人 2026-10-18，全站统一读 products.ts 的 soon / stageOf）：
 * 句子里只留名字，不链；第一次说到它的那段下面一行写名字和「探索中，敬请期待」。
 */
const SOON = soon.ids.map((id) => [TERMS[id], id] as const);

/** 一段正文：只有一句的短段当作节拍，字大一点、墨色 */
export function Para({
  text,
  links = [],
  lead = false,
  later = [],
}: {
  text: string;
  links?: Array<[string, string]>;
  /** 一章开头那句，也当作节拍 */
  lead?: boolean;
  /** 这一段第一次说到的、先不开放的产品 */
  later?: ProductId[];
}) {
  const beat = lead || (sentences(text).length === 1 && text.length <= 28);
  return (
    <>
      <p className={beat ? 'ao-beat' : undefined}>
        <Linked text={text} links={links} />
      </p>
      {later.length ? (
        <p className="ao-soon">
          {later.map((id) => (
            <span key={id} className="ao-soon-item">
              <span lang="en">{products[id].name}</span>
              <Status concept>{stageOf(id)}</Status>
            </span>
          ))}
        </p>
      ) : null}
    </>
  );
}

/** 每件先不开放的产品第一次出现在哪一段（按页面上的先后） */
export function soonFirst(paragraphs: string[]) {
  const seen = new Set<ProductId>();
  return new Map(
    paragraphs.map((text) => {
      const ids = SOON.filter(
        ([term, id]) => !seen.has(id) && text.includes(term),
      ).map(([, id]) => id);
      ids.forEach((id) => seen.add(id));
      return [text, ids] as const;
    }),
  );
}

export const HUMAN_SCALE: [string, string] = [
  '《人的尺度》',
  essayHref('human-scale'),
];
/** 正文里链过去的产品：先不开放的不链（见 SOON） */
export const PRODUCTS = (Object.keys(TERMS) as ProductId[])
  .filter((id) => !isSoon(id))
  .map((id): [string, string] => [TERMS[id], productHref[id]]);

/** 有标题和说明的去处：整张是链接，只留一个箭头按钮 */
export function Go({
  href,
  label,
  children,
}: {
  href: string;
  /** 读屏听到的去处 */
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="ao-go">
      <span className="ao-go-body">{children}</span>
      <More href={href} label={label} />
    </div>
  );
}
