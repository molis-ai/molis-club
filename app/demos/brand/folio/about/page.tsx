'use client';
import { useEffect, useRef, useState } from 'react';
import { team } from '../../../../../content/studio';
import {
  folioMembers,
  folioTeam,
  type FolioMember,
} from '../../../../../content/folio-team';
import { companies } from '../team';
import { Actions, Closing } from '../kit';
import {
  Footer,
  SiteHeader,
  SOLUTIONS,
  ESSAYS,
  HOME,
  useFolioMotion,
  type Vars,
} from '../shared';
import '../folio.css';
import '../home.css';
import '../kit.css';
import './team.css';

/** 一位成员：照片垫着色纸，悬停、键盘聚焦或点按照片时，旁边翻出写着经历的便笺 */
function PersonCard({
  index,
  name,
  image,
  imagePosition,
  personRole,
  experience,
  aside,
  tone,
}: FolioMember & { index: number }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const noteId = `fo-person-note-${index}`;
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
    <div
      className={`fo-person fo-tone-${tone}`}
      ref={root}
      data-open={open}
      data-dismissed={dismissed}
      onPointerLeave={() => setDismissed(false)}
      data-reveal
      style={{ '--i': index } as Vars}
    >
      {experience ? (
        <button
          type="button"
          className="fo-person-photo"
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
        >
          <span aria-hidden="true" />
          {image ? (
            <img
              src={image}
              width="160"
              height="160"
              alt=""
              loading="lazy"
              style={{ objectPosition: imagePosition }}
            />
          ) : (
            <b className="ftm-avatar-placeholder" aria-hidden="true">
              {name.slice(-2)}
            </b>
          )}
        </button>
      ) : (
        <div
          className="fo-person-photo ftm-photo-placeholder"
          aria-label={`${name}的头像占位`}
        >
          <span aria-hidden="true" />
          <b className="ftm-avatar-placeholder" aria-hidden="true">
            {name.slice(-2)}
          </b>
        </div>
      )}
      <h3 className="ftm-person-name">{name}</h3>
      {personRole ? <strong>{personRole}</strong> : null}
      {aside ? <em>{aside}</em> : null}
      {experience ? (
        <p className="fo-person-note" id={noteId}>
          {experience}
        </p>
      ) : (
        <div className="ftm-bio-placeholder" aria-label="介绍留白" />
      )}
    </div>
  );
}

export default function AboutPage() {
  const rootRef = useFolioMotion();
  return (
    <div className="fo-site ftm-site" ref={rootRef}>
      <SiteHeader current="about" />
      <main id="main" className="fo-people" aria-labelledby="fo-people-title">
        <header className="fo-label" data-reveal>
          <h1 id="fo-people-title">
            <span lang="en">Team</span>
            <small>团队</small>
          </h1>
          <div className="fo-label-side">
            <p>{folioTeam.intro}</p>
          </div>
        </header>

        <section className="ftm-opening" aria-labelledby="ftm-origin-title">
          <h2 id="ftm-origin-title">{folioTeam.title}</h2>
          <p>一起工作的经历，让我们认识彼此。新的产品，让这段关系继续往前。</p>
        </section>
        <div className="fo-people-grid" aria-label="Molis 团队成员">
          {folioMembers.map((person, index) => (
            <PersonCard key={person.name} index={index} {...person} />
          ))}
        </div>

        <div className="fo-proof" aria-label="团队成员的职业经历">
          <p>{team.proof}</p>
          <div className="fo-logos">
            {companies.map((company) => (
              <span key={company.name} className={`fo-logo-${company.kind}`}>
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
          className="ftm-practices"
          aria-labelledby="ftm-practices-title"
        >
          <h2 id="ftm-practices-title">我们怎样一起做事。</h2>
          <div>
            {folioTeam.practices.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
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
      </main>
      <Footer tone="yellow">
        <Closing
          id="ftm-closing-title"
          title={['从认识彼此，', '到一起做点什么。']}
          actions={[{ label: '看看如何一起合作', href: SOLUTIONS }]}
        />
      </Footer>
    </div>
  );
}
