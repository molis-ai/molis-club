'use client';
import { enterprise } from '../../../content/site/enterprise';
import { TEAM } from '../../_site/routes';
import { More, Phrases } from '../../_site/ui';
import { Relay } from './relay';
import { Shelf } from './shelf';

// 为什么我们可以（负责人 2026-10-20 第四版：不要脑图，用上一章动画的方式，让人眼前一亮，字不要多）。
// 和上一屏同一个书架（shelf.tsx）：四个位置（5.5 导语原词）四本书，书脊上是位置名和 5.5 的小标题，从左到右一本本打开；
// 每本里一段接力短片（relay.tsx）：一张杏色小卡——一个值得做的场景——从被找到，到被理顺成方案、被做成系统、到了人手里被用顺；
// 上场的光标不是人，名牌上是一段段经历（飞书「哇塞的履历」去掉人名）。
// 四本看完再滚一拍，书架退下去，片尾字幕滚上来：出演（十条经历）、曾在（公司），落在导语第二句。
// 「不代表固定分工、不是客户项目」那句常驻页脚。

const { why } = enterprise;

/** 片尾字幕 */
function Credits() {
  return (
    <div className="m-relay-credits">
      <div className="m-relay-roll">
        <p className="m-relay-role">{why.credits.cast}</p>
        <ul className="m-relay-cast">
          {Object.values(why.proofs).map((proof) => (
            <li key={proof.title}>{proof.title}</li>
          ))}
        </ul>
        <p className="m-relay-role">{why.credits.from}</p>
        <ul className="m-relay-orgs">
          {why.credits.orgs.map((org) => (
            <li key={org}>{org}</li>
          ))}
        </ul>
        <p className="m-relay-close">
          <Phrases text={why.close} />
        </p>
      </div>
    </div>
  );
}

export function Why() {
  return (
    <Shelf
      id="people"
      className="m-ent-why"
      prefix="why"
      title={why.title}
      lead={why.need}
      books={why.views.map((view) => ({
        id: view.id,
        word: view.label,
        name: view.title,
        film: <Relay id={view.id} />,
      }))}
      coda={<Credits />}
      footer={
        <footer className="m-ent-why-end">
          <p>{why.note}</p>
          <More href={TEAM}>{why.link}</More>
        </footer>
      }
    />
  );
}
