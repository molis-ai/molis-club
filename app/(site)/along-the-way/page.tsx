import { pageMetadata } from '../../../lib/site';
import {
  along,
  alongGroups,
  alongUi,
  flowOf,
} from '../../../content/site/along';
import { ALONG, contactHref } from '../../_site/routes';
import { Btn, Phrases, type Vars } from '../../_site/ui';
import { Facts, Label, roomOf, Work } from '../../_site/exhibit/exhibit';
import { AlongMap } from './along-map';
import './along.css';

const items = alongGroups.flatMap((group) => group.items);
const total = items.length;
const flowCount = new Set(items.map(flowOf)).size;

export const metadata = pageMetadata(
  `沿途 · ${along.title}`,
  along.intro[1],
  ALONG,
);

/** 按句号、问号切句 */
const sentences = (text: string) =>
  text.match(/[^。？！]+[。？！]?/g) ?? [text];

// 「沿途」：附录 A。从「关于」页「从哪来」的卡片和页尾目录进来。「关于」收成一整页后（C1，负责人 2026-10-18），
// 这里不再是展厅：没有名牌、墙色和「下一个展厅」，图不编号（目录八组仍用组号 A.1…A.8）。
// 开场：一张横幅的黎明，页名、附录 A 的标题、三个数；
// 一路上：四张照片一字排开、错落着走，图下是附录 A 开头两段的四句（原句，一张一句）；
// 一条河：54 件尝试从八组流到各自的去处（线描），下面是一件一行的目录，可按去处筛选；
// 目录八组左右交替，一组挂一张照片，编号就用组号 A.1…A.8（负责人 2026-10-16 挑的）；
// 结尾：风吹过草，附录 A 最后一段。
const legs = [
  { name: 'ex-handlebar', focus: '58% 50%' },
  { name: 'ex-balloon', focus: '62% 40%' },
  { name: 'ex-cyclist', focus: '50% 55%' },
  { name: 'ex-dawn-bird', focus: '40% 45%' },
] as const;
const legText = along.intro.flatMap(sentences);
const groupWorks = {
  'A.1': { name: 'ex-writer', focus: '62% 45%' },
  'A.2': { name: 'ex-cloud-watch', focus: '50% 62%' },
  'A.3': { name: 'ex-wax-seal', focus: '60% 50%' },
  'A.4': { name: 'ex-eggshell', focus: '45% 45%' },
  'A.5': { name: 'ex-white-door', focus: '50% 50%' },
  'A.6': { name: 'ex-night-desk', focus: '45% 15%' },
  'A.7': { name: 'ex-seed-hands', focus: '50% 62%' },
  'A.8': { name: 'ex-plan-sketch', focus: '50% 65%' },
} as const;

export default function AlongPage() {
  return (
    <div className="ex m-along">
      {/* 开场：雾里的黎明 */}
      <header className="ex-open m-wrap">
        <div className="al-open">
          <Work
            name="ex-dawn-field"
            ratio="21 / 8"
            focus="50% 62%"
            maxH="40svh"
            sizes="(max-width: 900px) 100vw, 1440px"
            eager
            fill
            className="al-open-work"
          />
          <div className="ex-grid al-open-text">
            <div className="al-open-title">
              <h1
                className="ex-h1 m-rise"
                style={{ '--delay': '60ms' } as Vars}
              >
                {roomOf('road').name}
              </h1>
              <p
                className="ex-note m-rise"
                style={{ '--delay': '120ms' } as Vars}
              >
                {along.title}
              </p>
            </div>
            <div
              className="al-open-facts m-rise"
              style={{ '--delay': '180ms' } as Vars}
            >
              <Facts
                items={[
                  { label: alongUi.facts.tries, value: total },
                  { label: alongUi.facts.groups, value: alongGroups.length },
                  { label: alongUi.facts.flows, value: flowCount },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 一路上：四张照片，一张一句 */}
      <section className="ex-screen m-wrap" aria-labelledby="al-legs-title">
        <h2 className="ex-kicker" id="al-legs-title" data-reveal>
          {alongUi.legs}
        </h2>
        <ol className="al-legs">
          {legs.map((leg, index) => (
            <li key={leg.name}>
              <Work
                name={leg.name}
                ratio="4 / 5"
                focus={leg.focus}
                maxH="44svh"
                sizes="(max-width: 900px) 50vw, 24vw"
                style={{ '--delay': `${index * 90}ms` } as Vars}
              >
                {legText[index]}
              </Work>
            </li>
          ))}
        </ol>
      </section>

      {/* 一条河与一件一行的目录，八组各挂一张 */}
      <AlongMap
        label={
          <p className="ex-label-solo">
            <Label piece="river" />
          </p>
        }
        pics={Object.fromEntries(
          Object.entries(groupWorks).map(([no, work]) => [
            no,
            <Work
              key={no}
              name={work.name}
              no={no}
              ratio="4 / 5"
              focus={work.focus}
              sizes="(max-width: 900px) 100vw, 30vw"
            />,
          ]),
        )}
      />

      {/* 结尾：风吹过草 */}
      <section className="ex-screen m-wrap" aria-labelledby="al-end-title">
        <div className="ex-grid al-end">
          <Work
            name="ex-field-grass"
            ratio="3 / 2"
            focus="50% 60%"
            maxH="58svh"
            sizes="(max-width: 900px) 100vw, 56vw"
            className="al-end-work"
          />
          <div className="al-end-text" data-reveal>
            <h2 className="ex-h3" id="al-end-title">
              <Phrases text={along.outro} />
            </h2>
            <div className="m-actions">
              <Btn href={contactHref()}>{alongUi.chat}</Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
