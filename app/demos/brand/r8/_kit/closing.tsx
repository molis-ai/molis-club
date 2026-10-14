'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { ending } from '../../../../../content/studio';
import { folioEssayLinks } from '../../../../../content/folio';
import { folioMembers, folioTeam } from '../../../../../content/folio-team';
import { INSTALL_URL } from '../../../../../content/molis-work';
import {
  ABOUT,
  COMMUNITY,
  ESSAYS,
  SOLUTIONS,
  contactHref,
  homeCopy,
  studio,
} from './data';

// 第三屏：一段明亮、有朝气的影像铺满整段，上面是过渡大句「好产品不必千篇一律，你的那一个，我们陪你做。」，
// 紧跟着三张磨砂玻璃卡片：企业合作（主行动是实心按钮）、社区、认识我们（几张真人头像叠在一起）。
// 卡片和大句在同一块画面里，不再压在影像下沿；最下面一行「也可以」：安装开源版、读文章。

/** 中文长句按逗号、句号分组，组内不折行 */
export function Phrases({ text }: { text: string }) {
  const parts = text.match(/[^，。、；！？]+[，。、；！？]?/g) ?? [text];
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="r8-phrase">
          {part}
        </span>
      ))}
    </>
  );
}

const faces = folioMembers.filter((member) => member.image);
const others = folioMembers.length - faces.length;

export function Closing({
  scene,
  tone,
}: {
  scene?: ReactNode;
  /** 结尾的影像：bright 是明亮的画面（深色字、白色磨砂卡），dark 是暗的画面（白字） */
  tone?: 'bright' | 'dark';
}) {
  const close = homeCopy.ending;
  const { contact } = ending.paths;
  const { community } = studio;
  return (
    <section
      className="r8-close"
      data-scene
      data-tone={tone}
      aria-labelledby="r8-close-title"
    >
      {scene ? <div className="r8-close-media">{scene}</div> : null}
      <div className="r8-close-body">
        <h2 id="r8-close-title" className="r8-close-lead" data-reveal>
          <Phrases text={close.transition} />
        </h2>
        <div className="r8-close-cards">
          <article className="r8-card r8-card-primary" data-reveal>
            <p className="r8-card-head">
              <b lang="en">01</b>
              <small>{contact.label}</small>
            </p>
            <h3>
              {contact.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            <div className="r8-card-links">
              <Link className="r8-btn" href={contactHref('enterprise')}>
                {close.cooperation.contact}
              </Link>
              <Link className="r8-more" href={SOLUTIONS}>
                {close.cooperation.more}
                <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </article>
          <article
            className="r8-card"
            data-reveal
            style={{ '--delay': '90ms' } as React.CSSProperties}
          >
            <p className="r8-card-head">
              <b lang="en">02</b>
              <small>{community.label}</small>
            </p>
            <h3>
              {community.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>
            <div className="r8-card-links">
              <Link className="r8-more r8-more-strong" href={COMMUNITY}>
                {community.action}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
          <article
            className="r8-card r8-card-team"
            data-reveal
            style={{ '--delay': '180ms' } as React.CSSProperties}
          >
            <p className="r8-card-head">
              <b lang="en">03</b>
              <small>
                {studio.labels.team.zh} ·{' '}
                <span lang="en">{studio.labels.team.en}</span>
              </small>
            </p>
            <h3>
              <Phrases text={folioTeam.title} />
            </h3>
            <div className="r8-card-links">
              <span className="r8-card-faces" aria-hidden="true">
                {faces.map((member) => (
                  <img
                    key={member.name}
                    src={member.image}
                    width="36"
                    height="36"
                    alt=""
                    loading="lazy"
                    style={{
                      objectPosition: member.imagePosition ?? '50% 40%',
                    }}
                  />
                ))}
                <span>+{others}</span>
              </span>
              <Link className="r8-more r8-more-strong" href={ABOUT}>
                {folioEssayLinks.team}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
        <p className="r8-close-also" data-reveal>
          <span>{close.also.label}</span>
          <a href={INSTALL_URL} target="_blank" rel="noreferrer">
            {close.also.install}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <Link href={ESSAYS}>
            {close.also.essays}
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
}
