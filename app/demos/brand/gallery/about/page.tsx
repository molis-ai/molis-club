'use client';
import { useEffect, useRef, useState } from 'react';
import { team } from '../../../../../content/studio';
import {
  folioMembers,
  folioTeam,
  type FolioMember,
} from '../../../../../content/folio-team';
import { companies } from '../../folio/team';
import { Btn, Framed, Phrases, Shell, type Vars } from '../kit';
import { ESSAYS, HOME, SOLUTIONS } from '../routes';
import './about.css';

// 团队：驻留艺术家。肖像按「中线挂法」挂成一面墙：画框大小、木色各不相同，画心都落在同一条中线上，
// 展签排在同一条线上；每幅画上有一盏画灯，走到墙前时一盏盏亮起。
// 悬停、键盘聚焦或点按肖像时，旁边翻出一张写着经历的便笺（与 Folio 相同）；Esc 或点别处收起。

const pad = (index: number) => String(index + 1).padStart(2, '0');
const tones = ['oak', 'white', 'black'] as const;

/** 挂法：有照片的挂大框，有经历没照片的挂中框，其余挂小框；木色依次轮换 */
function hangOf(person: FolioMember, index: number) {
  const size = person.image ? 'l' : person.experience ? 'm' : 's';
  const ratio = person.image ? '1' : index % 2 ? '1' : '4 / 5';
  return { size, ratio, tone: tones[index % tones.length] };
}

/** 一幅肖像与它的展签；有经历的成员可以翻开便笺 */
function Portrait({ person, index }: { person: FolioMember; index: number }) {
  const { name, image, imagePosition, personRole, experience, aside } = person;
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const noteId = `g-about-note-${index}`;
  const hang = hangOf(person, index);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
        setDismissed(true);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setDismissed(true);
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <li
      className="g-about-work"
      data-size={hang.size}
      data-open={open}
      data-dismissed={dismissed}
      onPointerLeave={() => setDismissed(false)}
      style={{ '--delay': `${(index % 5) * 110}ms` } as Vars}
    >
      <div ref={root} className="g-about-piece">
        <div className="g-about-hang" data-reveal>
          <div className="g-about-frame">
            <span className="g-about-light" aria-hidden="true">
              <i />
            </span>
            <Framed tone={hang.tone}>
              {image ? (
                <img
                  src={image}
                  width="240"
                  height="240"
                  alt=""
                  loading="lazy"
                  style={{ objectPosition: imagePosition }}
                />
              ) : (
                <span
                  className="g-about-blank"
                  aria-hidden="true"
                  style={{ aspectRatio: hang.ratio }}
                >
                  {name.slice(-2)}
                </span>
              )}
            </Framed>
            {experience ? (
              <button
                type="button"
                className="g-about-open"
                aria-expanded={open}
                aria-controls={noteId}
                aria-label={`认识${name}${personRole ? `，${personRole}` : ''}`}
                onFocus={() => setDismissed(false)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setOpen(false);
                    setDismissed(true);
                  }
                }}
                onClick={() => {
                  setDismissed(open);
                  setOpen((value) => !value);
                }}
              />
            ) : null}
          </div>
        </div>
        {experience ? (
          <p className="g-about-note" id={noteId}>
            {experience}
          </p>
        ) : null}
      </div>
      <div className="g-about-label">
        <p className="g-about-label-no" aria-hidden="true">
          <span className="g-soft" lang="en">
            {pad(index)}
          </span>
          {experience ? <i className="g-about-label-dot" /> : null}
        </p>
        <h3>{name}</h3>
        {personRole ? <p className="g-about-role">{personRole}</p> : null}
        {aside ? <p className="g-about-aside">{aside}</p> : null}
        {!experience && !aside ? (
          <span className="g-about-empty" aria-hidden="true" />
        ) : null}
      </div>
    </li>
  );
}

/** 结尾：一面墙上的两行字，去看看如何一起合作 */
function Ending() {
  return (
    <section
      className="g-about-closing"
      aria-labelledby="g-about-closing-title"
    >
      <h2 id="g-about-closing-title" data-reveal>
        <span className="g-phrase">从认识彼此，</span>
        <span className="g-phrase">到一起做点什么。</span>
      </h2>
      <div className="g-about-closing-row" data-reveal>
        <Btn href={SOLUTIONS}>看看如何一起合作</Btn>
      </div>
    </section>
  );
}

export default function GalleryAboutPage() {
  return (
    <Shell current="about" className="g-about-page" ending={<Ending />}>
      <header className="g-about-head">
        <p className="g-about-kicker" data-reveal aria-hidden="true">
          <span className="g-soft" lang="en">
            In residence
          </span>
        </p>
        <div className="g-about-head-row">
          <h1 id="g-about-title" data-reveal>
            <span lang="en">Team</span>
            <small>团队</small>
          </h1>
          <p
            className="g-about-intro"
            data-reveal
            style={{ '--delay': '120ms' } as Vars}
          >
            {folioTeam.intro}
          </p>
        </div>
      </header>

      <section className="g-about-gallery" aria-labelledby="g-about-origin">
        <div className="g-about-opening">
          <h2 id="g-about-origin" data-reveal>
            <Phrases text={folioTeam.title} />
          </h2>
          <p data-reveal style={{ '--delay': '120ms' } as Vars}>
            一起工作的经历，让我们认识彼此。新的产品，让这段关系继续往前。
          </p>
        </div>
        <div className="g-about-wall">
          <ol className="g-about-works" aria-label="Molis 团队成员">
            {folioMembers.map((person, index) => (
              <Portrait key={person.name} person={person} index={index} />
            ))}
          </ol>
        </div>
      </section>

      <div className="g-about-proof" aria-label="团队成员的职业经历">
        <p>{team.proof}</p>
        <div className="g-about-logos">
          {companies.map((company) => (
            <span key={company.name} data-kind={company.kind}>
              <img
                src={company.src}
                width={company.width}
                height={company.height}
                alt={company.name}
                loading="lazy"
              />
              {company.kind === 'linkedin' ? <b>LinkedIn</b> : null}
            </span>
          ))}
        </div>
      </div>

      <section
        className="g-about-practices"
        aria-labelledby="g-about-practices-title"
      >
        <h2 id="g-about-practices-title" data-reveal>
          我们怎样一起做事。
        </h2>
        <ol className="g-about-practice-list">
          {folioTeam.practices.map((item, index) => (
            <li
              key={item.title}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as Vars}
            >
              <span className="g-soft" lang="en" aria-hidden="true">
                {pad(index)}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
        <div className="g-actions g-about-practice-actions">
          <Btn href={ESSAYS} tone="ghost">
            读读我们的思考
          </Btn>
          <Btn href={`${HOME}#products`} tone="ghost">
            看看正在做的产品
          </Btn>
        </div>
      </section>
    </Shell>
  );
}
