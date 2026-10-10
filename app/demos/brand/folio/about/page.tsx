'use client';
import { useEffect, useRef, useState } from 'react';
import { team } from '../../../../../content/studio';
import { folioStudio } from '../../../../../content/folio';
import { people, companies } from '../team';
import { Footer, SiteHeader, useFolioMotion, type Vars } from '../shared';
import '../folio.css';
import '../home.css';

type Person = (typeof people)[number];

/** 一位成员：照片垫着色纸，悬停、键盘聚焦或点按照片时，旁边翻出写着经历的便笺 */
function PersonCard({
  index,
  image,
  imagePosition,
  personRole,
  experience,
  aside,
  tone,
}: Person & { index: number }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const noteId = `fo-person-note-${index}`;
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
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
      data-reveal
      style={{ '--i': index } as Vars}
    >
      <button
        type="button"
        className="fo-person-photo"
        aria-expanded={open}
        aria-controls={noteId}
        aria-label={`认识团队里负责${personRole}的成员`}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <img
          src={image}
          width="160"
          height="160"
          alt=""
          loading="lazy"
          style={{ objectPosition: imagePosition }}
        />
      </button>
      <strong>{personRole}</strong>
      <em>{aside}</em>
      <p className="fo-person-note" id={noteId}>
        {experience}
      </p>
    </div>
  );
}

export default function AboutPage() {
  const rootRef = useFolioMotion();
  return (
    <div className="fo-site" ref={rootRef}>
      <SiteHeader current="about" />
      <main id="main" className="fo-people" aria-labelledby="fo-people-title">
        <header className="fo-label" data-reveal>
          <h1 id="fo-people-title">
            <span lang="en">{folioStudio.labels.team.en}</span>
            <small>{folioStudio.labels.team.zh}</small>
          </h1>
          <div className="fo-label-side">
            <p>{team.text}</p>
          </div>
        </header>

        <div className="fo-people-grid">
          {people.map((person, index) => (
            <PersonCard key={person.image} index={index} {...person} />
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
      </main>
      <Footer tone="paper" compact />
    </div>
  );
}
