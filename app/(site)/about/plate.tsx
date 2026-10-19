'use client';
import { Plus, RefreshCw } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { teamUi, type Member } from '../../../content/site/team';
import type { Vars } from '../../_site/ui';
import './plate.css';

// 一个人：先听见他怎么说自己（自述或签名，暖色、大一点），名字像落款跟在下面，身份与方向再小一点；
// 「经历」点开看全文（details，没有 JS 也能开）。不放头像、不编号，没有框线。
// 有好几条自述的人，点这句话就换下一句（句尾一个小小的换一换记号）：按第 7 章的原句顺序轮着换，从正面那句开始
// （负责人 2026-10-18：要有趣、温暖）。
// 几句叠在同一格里占位，只露出当前一句，换句时名字不跳。没有 JS 时不能换，全部自述收在「经历」里。
// id 是页内锚点（/about#yijun），旧地址 /community/yijun 跳到这里。

/** 个性标签按原文的分号拆成一行一个，去掉句末的句号 */
const tagsOf = (tags: string) =>
  tags
    .split('；')
    .map((tag) => tag.replace(/。$/, ''))
    .filter(Boolean);

/** 这个人的几句：个性标签与签名，从正面那句开始轮 */
function linesOf(member: Member) {
  const motto = member.motto?.split('：')[1]?.replace(/[「」。]/g, '');
  const all = [
    ...(member.tags ? tagsOf(member.tags) : []),
    ...(motto ? [motto] : []),
  ];
  const start = Math.max(0, member.front ? all.indexOf(member.front) : 0);
  return {
    lines: [...all.slice(start), ...all.slice(0, start)],
    motto,
  };
}

/** 按逗号分组（同 ui.tsx 的 Phrases），句尾的小字与换一换记号跟最后一组粘在一起，不单独掉到下一行 */
function Said({ text, tail }: { text: string; tail?: ReactNode }) {
  const parts = text.match(/[^，。、；！？：]+[，。、；！？：]?/g) ?? [text];
  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className="m-phrase">
          {part}
          {index === parts.length - 1 ? tail : null}
        </span>
      ))}
    </>
  );
}

/** 一句自述：好几句时整句是按钮，点一下换下一句 */
function Quote({
  as: Tag,
  onClick,
  children,
}: {
  as: 'button' | 'p';
  onClick?: () => void;
  children: ReactNode;
}) {
  return Tag === 'button' ? (
    <button type="button" className="tm-quote" onClick={onClick}>
      {children}
    </button>
  ) : (
    <p className="tm-quote">{children}</p>
  );
}

export function Plate({ member, index }: { member: Member; index: number }) {
  const { lines, motto } = linesOf(member);
  const [at, setAt] = useState(0);
  const [turned, setTurned] = useState(false);
  const many = lines.length > 1;
  const hasMore = Boolean(member.experience || many);

  return (
    <li
      className="tm-p"
      id={member.id}
      data-reveal
      data-quiet={lines.length ? undefined : true}
      style={{ '--delay': `${(index % 4) * 90}ms` } as Vars}
    >
      {lines.length ? (
        <div className="tm-say">
          <Quote
            as={many ? 'button' : 'p'}
            onClick={
              many
                ? () => {
                    setAt((at + 1) % lines.length);
                    setTurned(true);
                  }
                : undefined
            }
          >
            {lines.map((line, i) => (
              <span
                key={line}
                className="tm-line"
                data-on={i === at || undefined}
                data-turned={(turned && i === at) || undefined}
                aria-hidden={i === at ? undefined : true}
              >
                <Said
                  text={`「${line}」`}
                  tail={
                    <>
                      {line === motto ? (
                        <small className="tm-kind">{teamUi.motto}</small>
                      ) : null}
                      {many ? (
                        <RefreshCw
                          className="tm-again"
                          size={13}
                          aria-hidden="true"
                        />
                      ) : null}
                    </>
                  }
                />
              </span>
            ))}
            {many ? (
              <span className="sr-only">
                {teamUi.again}：{member.name}
              </span>
            ) : null}
          </Quote>
          {turned ? (
            <span className="sr-only" aria-live="polite">
              {lines[at]}
            </span>
          ) : null}
        </div>
      ) : null}
      <h3 className="tm-name">
        {member.name}
        <span className="tm-role">{member.role}</span>
      </h3>
      {member.focus ? <p className="tm-focus">{member.focus}</p> : null}
      {hasMore ? (
        <details className="tm-more">
          <summary>
            <span>{teamUi.more}</span>
            <span className="sr-only">：{member.name}</span>
            <Plus size={11} aria-hidden="true" />
          </summary>
          <div className="tm-more-body">
            {member.experience ? <p>{member.experience}</p> : null}
            {many ? (
              <div className="tm-more-self">
                <p className="m-kicker">{teamUi.allSelf}</p>
                <ul>
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </li>
  );
}
