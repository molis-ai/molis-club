'use client';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { folioStudio } from '../../../../../content/folio';
import {
  folioMembers,
  folioTeam,
  type FolioMember,
} from '../../../../../content/folio-team';
import { team } from '../../../../../content/studio';
import { ESSAYS, HOME, SOLUTIONS, pad } from '../routes';
import { Actions, E2Page, SectionHead, type Vars } from '../shell';
import './about.css';

// E2 团队：人与经历为主，温和但专业。首屏只有「Team / 团队」与一句介绍 → 01 成员：规整的名册，
// 照片统一方形裁切，经历常驻显示（不靠悬停）；没有资料的成员留白，不补写 → 曾经的公司 → 02 怎样一起做事 → 结尾。
// 互动讲「我们从哪里来」：指一指（或点选）一家公司，名册里在那里工作过的人亮起，经历里提到它的地方标出来；
// 指到一个人，他待过的公司一起亮。对应关系直接从成员经历的原文里找公司名，不另外编。

/**
 * 曾经的公司：名字与图片同 Folio 的 team.ts；那里写的宽高是压缩前的原图尺寸，
 * 这里按 public/ 里现在的文件声明，免得版面跳动。
 */
const companies = [
  {
    name: '美团',
    match: ['美团'],
    src: '/images/daylight/company_logo/美团/美团横式色彩标识.png',
    width: 480,
    height: 174,
    kind: 'meituan',
  },
  {
    name: '抖音集团',
    match: ['抖音', '字节'],
    src: '/images/daylight/company_logo/douyin-group.jpg',
    width: 452,
    height: 159,
    kind: 'douyin',
  },
  {
    name: '滴滴',
    match: ['滴滴'],
    src: '/images/daylight/company_logo/didi.jpg',
    width: 461,
    height: 156,
    kind: 'didi',
  },
  {
    name: 'LinkedIn',
    match: ['LinkedIn'],
    src: '/images/daylight/company_logo/linkedin-svgrepo-com.svg',
    width: 382,
    height: 382,
    kind: 'linkedin',
  },
  {
    name: '小红书',
    match: ['小红书'],
    src: '/images/daylight/company_logo/red.jpeg',
    width: 480,
    height: 320,
    kind: 'red',
  },
];

type Company = (typeof companies)[number];

/** 这位成员的经历原文里提到了哪些公司 */
const worksAt = (experience: string | undefined, company: Company) =>
  Boolean(experience) &&
  company.match.some((word) => experience!.includes(word));

/** 把经历里提到的公司名标出来 */
function marked(text: string, words: string[]): ReactNode {
  if (!words.length) return text;
  const pattern = new RegExp(`(${words.join('|')})`);
  return text
    .split(pattern)
    .map((part, index) =>
      words.includes(part) ? (
        <mark key={index}>{part}</mark>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}

/** 一位成员：方形照片（没有照片时是留白的框），名字、方向、经历与一句自述 */
function Person({
  index,
  name,
  image,
  imagePosition,
  personRole,
  experience,
  aside,
  state,
  words,
}: FolioMember & {
  index: number;
  state?: 'on' | 'off';
  words: string[];
}) {
  return (
    <li
      className="ea-person"
      data-reveal
      data-state={state}
      style={{ '--d': `${(index % 3) * 70}ms` } as Vars}
      data-name={name}
    >
      <div className="ea-person-head">
        {image ? (
          <img
            className="ea-photo"
            src={image}
            width="112"
            height="112"
            alt=""
            loading="lazy"
            style={{ objectPosition: imagePosition }}
          />
        ) : (
          <span className="ea-photo ea-photo-empty" aria-hidden="true">
            {name.slice(-2)}
          </span>
        )}
        <div className="ea-person-name">
          <span className="ea-person-no" aria-hidden="true">
            {pad(index)}
          </span>
          <h3>{name}</h3>
          {personRole ? <p className="ea-role">{personRole}</p> : null}
        </div>
      </div>
      {experience ? (
        <p className="ea-experience">{marked(experience, words)}</p>
      ) : (
        <span className="ea-experience-empty" aria-hidden="true" />
      )}
      {aside ? <p className="ea-aside">{aside}</p> : null}
    </li>
  );
}

function Hero() {
  const label = folioStudio.labels.team;
  return (
    <section className="ea-hero" aria-labelledby="ea-title">
      <h1 id="ea-title">
        <span lang="en">{label.en}</span>
        <small>{label.zh}</small>
      </h1>
      <p className="ea-intro">{folioTeam.intro}</p>
    </section>
  );
}

function Members() {
  const [picked, setPicked] = useState<string | null>(null);
  const [pointed, setPointed] = useState<string | null>(null);
  const [person, setPerson] = useState<string | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  // 指到哪位成员：在名册上听一次，按最近的 [data-name] 找人
  useEffect(() => {
    const node = grid.current;
    if (!node) return;
    const over = (event: PointerEvent) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>(
        '[data-name]',
      );
      setPerson(item?.dataset.name ?? null);
    };
    const leave = () => setPerson(null);
    node.addEventListener('pointerover', over);
    node.addEventListener('pointerleave', leave);
    return () => {
      node.removeEventListener('pointerover', over);
      node.removeEventListener('pointerleave', leave);
    };
  }, []);
  const company = companies.find((item) => item.name === (pointed ?? picked));
  const member = folioMembers.find((item) => item.name === person);
  const people = company
    ? folioMembers.filter((item) => worksAt(item.experience, company))
    : [];
  return (
    <section className="ea-section" aria-labelledby="ea-members-title">
      <SectionHead
        id="ea-members-title"
        index={0}
        title={folioTeam.title}
        lead="一起工作的经历，让我们认识彼此。新的产品，让这段关系继续往前。"
        layout="split"
      />
      <div className="ea-proof" aria-label="团队成员的职业经历" data-reveal>
        <p>
          {team.proof}
          <small aria-hidden="true">指一指公司，看看谁在那里工作过</small>
        </p>
        <ul className="ea-logos">
          {companies.map((item) => {
            const lit = company
              ? company.name === item.name
              : member
                ? worksAt(member.experience, item)
                : false;
            return (
              <li key={item.name} className={`ea-logo-${item.kind}`}>
                <button
                  type="button"
                  aria-pressed={picked === item.name}
                  aria-label={item.name}
                  data-lit={lit || undefined}
                  onMouseEnter={() => setPointed(item.name)}
                  onMouseLeave={() => setPointed(null)}
                  onFocus={() => setPointed(item.name)}
                  onBlur={() => setPointed(null)}
                  onClick={() =>
                    setPicked((value) =>
                      value === item.name ? null : item.name,
                    )
                  }
                >
                  <img
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt=""
                    loading="lazy"
                  />
                  {item.kind === 'linkedin' ? <b lang="en">LinkedIn</b> : null}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="ea-proof-note" aria-live="polite">
          {company ? `${company.name} · ${people.length} 位成员` : ''}
        </p>
      </div>
      <ul
        className="ea-grid"
        ref={grid}
        aria-label="Molis 团队成员"
        data-filter={company ? 'on' : undefined}
      >
        {folioMembers.map((item, index) => (
          <Person
            key={item.name}
            index={index}
            {...item}
            state={company ? (people.includes(item) ? 'on' : 'off') : undefined}
            words={company ? company.match : []}
          />
        ))}
      </ul>
    </section>
  );
}

function Practices() {
  return (
    <section
      className="ea-section ea-practices"
      aria-labelledby="ea-practices-title"
    >
      <SectionHead
        id="ea-practices-title"
        index={1}
        title="我们怎样一起做事。"
      />
      <ol className="ea-practice-list">
        {folioTeam.practices.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--d': `${index * 70}ms` } as Vars}
          >
            <span className="ea-practice-no" aria-hidden="true">
              {pad(index)}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
      <Actions
        items={[
          { label: '读读我们的思考', href: ESSAYS, tone: 'ghost' },
          {
            label: '看看正在做的产品',
            href: `${HOME}#products`,
            tone: 'ghost',
          },
        ]}
      />
    </section>
  );
}

function Closing() {
  return (
    <section className="ea-closing" aria-labelledby="ea-closing-title">
      <h2 id="ea-closing-title" data-reveal>
        <span>从认识彼此，</span>
        <span>到一起做点什么。</span>
      </h2>
      <Actions items={[{ label: '看看如何一起合作', href: SOLUTIONS }]} />
    </section>
  );
}

export default function E2AboutPage() {
  return (
    <E2Page current="about" className="ea" footer={<Closing />}>
      <Hero />
      <Members />
      <Practices />
    </E2Page>
  );
}
