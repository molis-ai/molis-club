import Link from 'next/link';
import { pageMetadata } from '../../../../lib/site';
import { artistSkills } from '../../../../content/artists';
import { knowledge } from '../../../../content/knowledge';
import { community, methodText } from '../../../../content/site/community';
import { COMMUNITY, METHODS } from '../../../_site/routes';
import { More, Phrases, type Vars } from '../../../_site/ui';
import { Catalog, type CatalogType } from './catalog';
import '../../../_site/demo/demo.css';
import './methods.css';

export const metadata = pageMetadata(
  `${methodText.kicker} · ${methodText.trail.community}`,
  `${community.methods.answer}${methodText.metaTail}`,
  METHODS,
);

// 方法目录：艺术家 Skill、网页与动效、组件来源。搜索、分类、复制 Prompt、下载 Skill 都在这一页；
// 每一项的详情在 /community/methods/[slug] 与 /community/methods/artists/[slug]。

type Props = {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[] }>;
};

const types: CatalogType[] = ['all', 'artists', 'web', 'sources'];
const isType = (value: string | undefined): value is CatalogType =>
  types.includes(value as CatalogType);
/** 同名参数出现多次时取最后一个（没有 JS 时点分类签，会同时带上原来的类别和新点的那个） */
const last = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value.at(-1) : value;

const total = artistSkills.length + knowledge.length;

export default async function MethodsPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (last(params.q) ?? '').slice(0, 60);
  const raw = last(params.type);
  const type = isType(raw) ? raw : 'all';
  const t = community.methods;
  return (
    <div className="m-mth">
      <header className="m-mth-hero m-wrap m-top">
        <nav className="m-mth-trail m-rise" aria-label="位置">
          <Link href={COMMUNITY}>{methodText.trail.community}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{methodText.trail.methods}</span>
        </nav>
        <div className="m-mth-head">
          <p className="m-tagline m-rise">
            <b>{methodText.kicker}</b>
            <span lang="en">Methods</span>
            <span className="num">{`${total} ${methodText.count}`}</span>
          </p>
          <h1
            className="m-mth-h1 m-rise"
            style={{ '--delay': '100ms' } as Vars}
          >
            <Phrases text={t.title} />
          </h1>
          <p
            className="m-mth-lead m-rise"
            style={{ '--delay': '200ms' } as Vars}
          >
            {t.question}
            {t.answer}
          </p>
          <p
            className="m-mth-fine m-rise"
            style={{ '--delay': '260ms' } as Vars}
          >
            {t.why.join('')}
          </p>
        </div>
      </header>
      <div className="m-wrap m-mth-body">
        <Catalog
          key={`${type}:${query}`}
          initialQuery={query}
          initialType={type}
        />
        <p className="m-mth-back">
          <More href={COMMUNITY}>{methodText.back}</More>
        </p>
      </div>
    </div>
  );
}
