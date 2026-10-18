import { Plus } from 'lucide-react';
import { teamUi, type Member } from '../../../content/site/team';
import { pad, type Vars } from '../../_site/ui';

// 一个人的名牌：身份、名字、方向，正面露一句本人自述，「经历」点开看全文（details，没有 JS 也能开）。
// 「认识我们」和一页式「关于」样张共用；样张里不编号（numbered={false}）。

/** 个性标签按原文的分号拆成一行一个，去掉句末的句号 */
const tagsOf = (tags: string) =>
  tags
    .split('；')
    .map((tag) => tag.replace(/。$/, ''))
    .filter(Boolean);

export function Plate({
  member,
  index,
  numbered = true,
}: {
  member: Member;
  index: number;
  numbered?: boolean;
}) {
  const tags = member.tags ? tagsOf(member.tags) : [];
  const motto = member.motto?.split('：')[1]?.replace(/。$/, '');
  const fromMotto = Boolean(member.front && motto?.includes(member.front));
  const hasMore = Boolean(member.experience || tags.length || motto);
  return (
    <li
      className="tm-plate"
      id={member.id}
      data-reveal
      style={{ '--delay': `${(index % 4) * 70}ms` } as Vars}
    >
      <p className="tm-plate-top">
        {numbered ? (
          <span className="ex-no num" aria-hidden="true">
            {pad(index + 1)}
          </span>
        ) : null}
        <span className="tm-role">{member.role}</span>
      </p>
      <h3 className="tm-name">{member.name}</h3>
      {member.focus ? <p className="tm-focus">{member.focus}</p> : null}
      {member.front ? (
        <p className="tm-front">
          <span className="tm-front-tag">
            {fromMotto ? teamUi.motto : teamUi.self}
          </span>
          <span>「{member.front}」</span>
        </p>
      ) : null}
      {hasMore ? (
        <details className="tm-more">
          <summary>
            <span>{teamUi.more}</span>
            <span className="sr-only">：{member.name}</span>
            <Plus size={12} aria-hidden="true" />
          </summary>
          <div className="tm-more-body">
            {member.experience ? <p>{member.experience}</p> : null}
            {tags.length ? (
              <div className="tm-more-self">
                <p className="m-kicker">{teamUi.allSelf}</p>
                <ul>
                  {tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {motto ? (
              <p className="tm-more-motto">
                <span className="m-kicker">{teamUi.motto}</span>
                <span>{motto}</span>
              </p>
            ) : null}
          </div>
        </details>
      ) : null}
    </li>
  );
}
