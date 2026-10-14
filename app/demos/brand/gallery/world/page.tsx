'use client';
import { folioWorld } from '../../../../../content/folio-world';
import {
  Actions,
  Btn,
  Closing,
  More,
  NextRoom,
  Phrases,
  Plate,
  Shell,
  Status,
  Tag,
  type Vars,
} from '../kit';
import { HOME, contactHref, productHref, productName } from '../routes';
import { Maquette, iso, route, stops } from './model';
import './world.css';

// Molis World · Room 5，还在筹备的展厅。内容与 Folio 的 World 页同一份、同一个顺序（A2）：
// 首屏 → World 是什么 → 一段示例旅程 → 三个产品的关系 → 分寸 → 结尾。没有下载、试用或注册入口。
// 展览的做法：World 还是概念，所以它在这里是一只方案模型，不是作品。首屏展台上一只白色纸模型，
// 三样东西用引线标在模型上；示例旅程是一段滚动，模型上一条杏色路线一站站点亮，右边六步同步高亮；
// 三个产品是三只展柜；分寸是六条写在墙上的规矩。全部标「概念示意」。

/** 首屏模型上的三处标注：引线从模型上的位置拉到旁边的小签 */
const pins = [
  { at: iso(64, 236, 46), to: [70, 372] as [number, number] },
  { at: iso(232, 40, 44), to: [560, 52] as [number, number] },
  { at: iso(178, 154, 12), to: [600, 300] as [number, number] },
];

function Hero() {
  const { hero, map } = folioWorld;
  return (
    <section className="g-wpage-hero" aria-labelledby="g-wpage-title">
      <div className="g-wpage-hero-copy">
        <p className="g-wpage-kicker">
          <span className="g-soft" lang="en" aria-hidden="true">
            Room 5
          </span>
          <span>{hero.kicker}</span>
        </p>
        <h1 id="g-wpage-title" className="g-wpage-title">
          <Phrases text={hero.title} />
        </h1>
        <p className="g-lead">{hero.lead}</p>
        <Status items={hero.status} />
        <Actions>
          <Btn href={contactHref('world')}>{hero.actions.follow}</Btn>
          <More href="#journey">{hero.actions.journey}</More>
        </Actions>
      </div>
      <figure className="g-wpage-stand">
        <figcaption className="g-wpage-sheet-title">
          <span>{map.title}</span>
          <Tag>{map.note}</Tag>
        </figcaption>
        <div className="g-wpage-case">
          <Maquette>
            {pins.map((pin, index) => (
              <g key={index} className="g-wpage-pin">
                <line
                  x1={pin.at[0]}
                  y1={pin.at[1]}
                  x2={pin.to[0]}
                  y2={pin.to[1]}
                />
                <circle cx={pin.at[0]} cy={pin.at[1]} r="3.2" />
              </g>
            ))}
          </Maquette>
          <ul className="g-wpage-pins">
            {map.places.map((place, index) => (
              <li
                key={place.name}
                data-k={index}
                style={
                  {
                    left: `${(pins[index].to[0] / 640) * 100}%`,
                    top: `${(pins[index].to[1] / 420) * 100}%`,
                  } as Vars
                }
              >
                <small>{place.kind}</small>
                <strong>{place.name}</strong>
                <span lang="en">{productName[place.from]}</span>
              </li>
            ))}
          </ul>
          <span className="g-wpage-glass" aria-hidden="true" />
        </div>
        <span className="g-wpage-plinth" aria-hidden="true" />
        <span className="g-wpage-sign" aria-hidden="true">
          <b lang="en">Room 5</b>
          <small>筹备中</small>
        </span>
      </figure>
    </section>
  );
}

/** World 是什么：三件事，像模型旁边的三张说明卡 */
function What() {
  const { what } = folioWorld;
  return (
    <section
      className="g-wpage-what g-wrap g-section"
      aria-labelledby="g-wpage-what-title"
    >
      <Plate
        id="g-wpage-what-title"
        index="I"
        kicker={what.kicker}
        title={what.title}
        side={<p>{what.lead}</p>}
      />
      <ol className="g-wpage-what-list">
        {what.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${index * 110}ms` } as Vars}
          >
            <span className="g-soft" aria-hidden="true">
              {index + 1}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** 一段示例旅程：模型上的路线一站站点亮，右边六步同步高亮 */
function Journey() {
  const { journey } = folioWorld;
  return (
    <section
      id="journey"
      className="g-wpage-journey"
      data-scene="pin"
      data-steps={journey.steps.length}
      aria-labelledby="g-wpage-journey-title"
    >
      <div className="g-wpage-journey-stage">
        <div className="g-wrap">
          <Plate
            id="g-wpage-journey-title"
            index="II"
            kicker={journey.kicker}
            title={journey.title}
          />
          <div className="g-wpage-journey-body">
            <figure className="g-wpage-route-model">
              <Maquette>
                <path className="g-wpage-route-ghost" d={route} />
                <path className="g-wpage-route" d={route} pathLength={1} />
                {stops.map(([x, y, z], index) => {
                  const [cx, cy] = iso(x, y, z);
                  return (
                    <g
                      key={index}
                      className="g-wpage-stop"
                      style={{ '--k': index } as Vars}
                    >
                      <circle cx={cx} cy={cy} r="9" />
                      <text x={cx} y={cy + 3.6} textAnchor="middle">
                        {index + 1}
                      </text>
                    </g>
                  );
                })}
              </Maquette>
              <figcaption>{journey.note}</figcaption>
            </figure>
            <ol className="g-wpage-steps">
              {journey.steps.map((step, index) => (
                <li
                  key={step.text}
                  data-k={index}
                  data-product={step.product}
                  style={{ '--k': index } as Vars}
                >
                  <span className="g-soft" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="g-wpage-product" lang="en">
                    {productName[step.product]}
                  </span>
                  <p>
                    {step.text}
                    {step.planned ? <Tag>{journey.planned}</Tag> : null}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 三个产品的关系：Life + Story = World，三只展柜，各自写清阶段 */
function Family() {
  const { family } = folioWorld;
  return (
    <section
      className="g-wpage-family g-wrap g-section"
      aria-labelledby="g-wpage-family-title"
    >
      <Plate
        id="g-wpage-family-title"
        index="III"
        kicker={family.kicker}
        title={
          <span className="g-wpage-formula" lang="en">
            <span>Life</span>
            <i aria-hidden="true">+</i>
            <span>Story</span>
            <i aria-hidden="true">=</i>
            <span>World</span>
          </span>
        }
        side={<p>{family.lead}</p>}
      />
      <ul className="g-wpage-vitrines">
        {family.items.map((item, index) => (
          <li
            key={item.id}
            data-reveal
            data-id={item.id}
            style={{ '--delay': `${index * 120}ms` } as Vars}
          >
            <span className="g-wpage-vitrine" aria-hidden="true">
              <i />
            </span>
            <small>{item.role}</small>
            <h3 lang="en">{productName[item.id]}</h3>
            <p>{item.text}</p>
            <p className="g-wpage-status">
              {item.id === 'world' ? <Tag>{item.status}</Tag> : item.status}
            </p>
            {item.id === 'world' ? null : (
              <More href={productHref[item.id]}>{family.more}</More>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 分寸：六条写在墙上的规矩 */
function Rules() {
  const { rules } = folioWorld;
  return (
    <section
      className="g-wpage-rules g-wrap g-section"
      aria-labelledby="g-wpage-rules-title"
    >
      <Plate
        id="g-wpage-rules-title"
        index="IV"
        kicker={rules.kicker}
        title={rules.title}
      />
      <ol className="g-wpage-rule-list">
        {rules.items.map((item, index) => (
          <li
            key={item.title}
            data-reveal
            style={{ '--delay': `${(index % 3) * 100}ms` } as Vars}
          >
            <span className="g-soft" aria-hidden="true">
              {index + 1}
            </span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Ending() {
  const { closing } = folioWorld;
  return (
    <>
      <Closing id="g-wpage-closing-title" title={closing.title}>
        <Actions>
          <Btn href={contactHref('world')}>{closing.follow}</Btn>
          <More href={HOME}>{closing.home}</More>
        </Actions>
      </Closing>
      <div className="g-next-wrap">
        <NextRoom current="world" />
      </div>
    </>
  );
}

export default function GalleryWorld() {
  return (
    <Shell current="world" className="g-wpage" ending={<Ending />}>
      <Hero />
      <What />
      <Journey />
      <Family />
      <Rules />
    </Shell>
  );
}
