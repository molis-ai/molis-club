'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  AUTHOR,
  essays,
  essaysPage,
  splitTitle,
} from '../../../content/site/essays';
import {
  members,
  teamUi,
  type Member,
  type MemberId,
} from '../../../content/site/team';
import { essayHref } from '../../_site/routes';
import { mediaOf, type Vars } from '../../_site/ui';

// 联创团队（负责人 2026-10-20 从六个提案里选了「一排肖像」）：八张一样高的竖幅并肩站成一排，停在谁身上谁撑开，
// 撑开的那张左边是完整的正方形头像，右边一栏是方向、前司和经历；默认撑开发起人王一骏。
// 玩笑自述和履历分开（负责人 2026-10-23 选提案 B）：白栏只放正经的，自述是画里的人自己说的话，
// 几个小气泡从头像左下角一条一条冒出来；窄屏头像太小，气泡回到字下面排成一行。
// 人像一律原色（负责人 2026-10-20：「人物灰掉不吉利」）。头像是负责人按 outputs/team-avatar-prompts.md 的
// 「B 彩铅淡彩手稿」重新生成的一组（scripts/site-media.mjs 压成 face-<id>）。id 是页内锚点（/about#yijun）。
// 两篇文章挂在作者一骏的卡上，经历下面一行（负责人 2026-10-23：文章放在写它的人旁边，是署名不是推荐）。
// 窄屏：不撑开，一人一行，头像在左，字都摊开。没有 JS 时停在第一个人身上，其余人的字在读屏里都在。

const faceOf = (id: MemberId) => mediaOf(`face-${id}`);

/** 自述标签按原文的分号拆开，去掉句末句号；正面那句排第一 */
function tagsOf(member: Member) {
  const all = (member.tags ?? '')
    .split('；')
    .map((tag) => tag.replace(/。$/, ''))
    .filter(Boolean);
  const motto = member.motto?.split('：')[1]?.replace(/[「」。]/g, '');
  if (motto) all.push(motto);
  const start = Math.max(0, member.front ? all.indexOf(member.front) : 0);
  return [...all.slice(start), ...all.slice(0, start)];
}

/** 画上冒几个气泡（放得下为止） */
const SHOWN = 4;

export function Crew() {
  const [open, setOpen] = useState<MemberId>(members[0].id);

  return (
    <ol className="cr-row" data-reveal>
      {members.map((member, index) => {
        const on = open === member.id;
        const face = faceOf(member.id);
        const tags = tagsOf(member);
        const cv = `${member.id}-cv`;
        return (
          <li
            key={member.id}
            className="cr-pc"
            id={member.id}
            data-on={on || undefined}
            style={{ '--i': index } as Vars}
            onPointerEnter={() => setOpen(member.id)}
          >
            <h3 className="cr-name">
              {member.name}
              {member.role === '发起人' ? (
                <span className="cr-founder">{member.role}</span>
              ) : null}
            </h3>
            <div className="cr-box">
              <button
                type="button"
                className="cr-face"
                aria-expanded={on}
                aria-controls={cv}
                aria-label={teamUi.detail(member.name)}
                onFocus={() => setOpen(member.id)}
                onClick={() => setOpen(member.id)}
              >
                <img
                  src={face.srcset[0][0] as string}
                  srcSet={face.srcset
                    .map(([src, w]) => `${src} ${w}w`)
                    .join(', ')}
                  sizes="(max-width: 900px) 96px, 560px"
                  width={face.width}
                  height={face.height}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </button>
              <div className="cr-cv" id={cv}>
                {member.focus ? (
                  <p className="cr-focus">{member.focus}</p>
                ) : null}
                {member.former?.length ? (
                  <p className="cr-former">
                    {teamUi.former}
                    {member.former.join(' · ')}
                  </p>
                ) : null}
                {member.experience ? (
                  <p className="cr-exp">{member.experience}</p>
                ) : null}
                {member.name.endsWith(AUTHOR) ? (
                  <p className="cr-writes">
                    <span className="cr-writes-label">{essaysPage.kicker}</span>
                    {essays.map((essay) => {
                      const { main } = splitTitle(essay.title);
                      return (
                        <Link
                          key={essay.slug}
                          className="m-inline"
                          href={essayHref(essay.slug)}
                        >
                          《{main}》
                        </Link>
                      );
                    })}
                  </p>
                ) : null}
              </div>
              {tags.length ? (
                <ul className="cr-says" aria-label={teamUi.tags}>
                  {tags.slice(0, SHOWN).map((tag, at) => (
                    <li key={tag} style={{ '--at': at } as Vars}>
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
