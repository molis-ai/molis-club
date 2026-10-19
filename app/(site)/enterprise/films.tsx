import { useId, type CSSProperties } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import { Note } from '../../_site/ui';
import { Shadow } from './keeps';

// 合作路线每本书打开后的一段短片（负责人 2026-10-20：「假装你在拍视频」，按脚本写出谁、做什么、镜头怎么走；先拿诊断做样片）。
// 画面是一块 16:9 的共享画板（点阵白板），业务团队和 Molis 各是一个带名牌的光标，像两个人在同一块板上协作；
// 镜头跟着出手的那一方推近、摇过去，最后拉回全景。每一步做完，在做的地方钉一条带序号的评论，写的就是 5.3 那一格的原句，
// 所以停在最后一帧也能一眼读出：谁、在哪、做了什么、按什么顺序。
//
// 诊断的分镜（秒）：
//   镜头          时刻        谁        动作            画面
//   全景          0–0.4       —         —               一块空白画板
//   推近左边      0.4–1.3     业务团队  拖进一张便签    墨色光标从左边拖着便签进来，落下
//                 1.7–2.4     业务团队  写上现在和希望  三个灰点连成「现在」，一个箭头，一个虚线圈「希望」
//                 2.6         业务团队  评论 1          讲清当前做法和希望发生的变化
//   摇到右边      3.3–4.2     Molis     进场            杏色光标从右边进来
//                 4.1–4.6     Molis     画两条轴        业务价值 × 接入成本
//                 4.6–5.6     Molis     摆出场景        六张场景卡从光标下一张张落进四格
//                 5.8         Molis     评论 2          梳理值得尝试的场景
//   推近左上那格  6.5–7.3     两边      碰头            两个光标在「价值高、成本低」那格碰在一起
//                 7.5–8.3     两边      圈选            一个往左上、一个往右下拉开，选框跟着张开，框住两张
//                 8.5         一起      评论 3          确定试点范围
//   拉回全景      8.8–9.8     —         —               便签上的「希望」连到选框；三条评论都留着
//
// 实现：脚本里每样东西一条轨道（几个时刻各是什么样子），合成一段 CSS 关键帧，全片同一个长度，所以百分比就是时间线。
// 静止是最后一帧（没有 JS、减少动态都看这一帧）；外层 .m-duet 有 data-play 时从头演，data-hold 时停在第一帧（stages.tsx）。
// 画面坐标 960 × 540；字都是 HTML，按画面宽度（cqw）定位、定字号，跟着镜头一起推拉；窄屏上画面里的字收起，三句排在画面下面。

const { line } = enterprise;
const W = 960;
const H = 540;
/** 落定：出手、浮现 */
const OUT = 'cubic-bezier(.2,.7,.1,1)';
/** 走位：光标和镜头的移动，起落都缓 */
const GLIDE = 'cubic-bezier(.6,0,.25,1)';

type Frame = [seconds: number, css: string];
const round = (n: number) => Math.round(n * 1000) / 1000;

/** 一卷片子：每条轨道给一个类名，最后合成一段样式 */
function reel(name: string, length: number) {
  const rules: string[] = [];
  let count = 0;
  const pct = (t: number) => `${round((t / length) * 100)}%`;
  return {
    length,
    track(frames: Frame[], ease = OUT) {
      const id = `m-f-${name}-${++count}`;
      const first = frames[0];
      const last = frames[frames.length - 1];
      const keys = frames.map(
        ([t, css]) => `${pct(t)}{${css};animation-timing-function:${ease}}`,
      );
      if (first[0] > 0) keys.unshift(`0%{${first[1]}}`);
      if (last[0] < length) keys.push(`100%{${last[1]}}`);
      rules.push(
        `.m-film .${id}{${last[1]}}`,
        `.m-film[data-play] .${id}{animation:${id} ${length}s linear both}`,
        `@keyframes ${id}{${keys.join('')}}`,
      );
      return id;
    },
    css: () => rules.join('\n'),
  };
}

/** HTML 东西在画面里的位置（光标、名牌）：按画面宽度换算 */
const spot = (x: number, y: number) =>
  `transform:translate(${round(x / 9.6)}cqw,${round(y / 9.6)}cqw)`;
/** HTML 字钉在画面里的哪一点 */
const pin = (x: number, y: number): CSSProperties => ({
  left: `${round((x / W) * 100)}%`,
  top: `${round((y / H) * 100)}%`,
});
/** 镜头：以 (cx, cy) 为中心放大 s 倍，不拍到画板外面 */
function shot(cx: number, cy: number, s: number) {
  const x = Math.min(Math.max(cx, W / (2 * s)), W - W / (2 * s));
  const y = Math.min(Math.max(cy, H / (2 * s)), H - H / (2 * s));
  const tx = (0.5 - (s * x) / W) * 100;
  const ty = (0.5 - (s * y) / H) * 100;
  return `transform:translate(${round(tx)}%,${round(ty)}%) scale(${s})`;
}
const HIDE = 'opacity:0;transform:scale(.4)';
const SHOW = 'opacity:1;transform:scale(1)';
const pop = (t: number, length = 0.4): Frame[] => [
  [t, HIDE],
  [t + length, SHOW],
];
const rise = (t: number): Frame[] => [
  [t, 'opacity:0;transform:translateY(8px)'],
  [t + 0.5, 'opacity:1;transform:none'],
];
const fade = (t: number, length = 0.5): Frame[] => [
  [t, 'opacity:0'],
  [t + length, 'opacity:1'],
];
const draw = (t: number, length = 0.5): Frame[] => [
  [t, 'stroke-dashoffset:1'],
  [t + length, 'stroke-dashoffset:0'],
];

type Who = 'you' | 'we' | 'both';

/** 一个带名牌的光标：墨色是业务团队，杏色是 Molis */
function Hand({ who, className }: { who: 'you' | 'we'; className: string }) {
  return (
    <span className={`m-film-hand ${className}`} data-who={who}>
      <svg className="m-film-arrow" viewBox="0 0 16 22" aria-hidden="true">
        <path d="M1.5 1.5 V17 L5.6 13.2 L8.6 20 L11.4 18.8 L8.5 12.2 H14 Z" />
      </svg>
      <span className="m-film-tag" lang={who === 'we' ? 'en' : undefined}>
        {line.who[who]}
      </span>
    </span>
  );
}

/** 钉在画面上的一条评论：序号、谁、5.3 的原句 */
function Say({
  id,
  who,
  step,
  at,
  className,
}: {
  id: StationId;
  who: Who;
  step: number;
  at: [number, number];
  className: string;
}) {
  return (
    <p
      className={`m-film-say ${className}`}
      data-who={who}
      style={pin(...at)}
    >
      <span className="m-film-step" aria-hidden="true">
        {step}
      </span>
      <span className="m-film-who" lang={who === 'we' ? 'en' : undefined}>
        {line.who[who]}
      </span>
      <span className="m-film-text">{line.rows[id][who].join('')}</span>
    </p>
  );
}

/** 窄屏：画面里的字收起，三句按出手的顺序排在画面下面 */
function Lines({ id, order }: { id: StationId; order: Who[] }) {
  return (
    <ol className="m-film-lines">
      {order.map((who, index) => (
        <li key={who} className="m-film-line" data-who={who}>
          <span className="m-film-step" aria-hidden="true">
            {index + 1}
          </span>
          <span className="m-film-who" lang={who === 'we' ? 'en' : undefined}>
            {line.who[who]}
          </span>
          <span className="m-film-text">
            {line.rows[id][who].map((group) => (
              <span key={group} className="m-phrase">
                {group}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** 诊断：按上面的分镜 */
function Diagnose() {
  const shadow = useId();
  const cue = {
    push: 0.4, // 镜头推近左边
    drag: 0.4, // 业务团队拖着便签进场
    drop: 1.3, // 便签落下
    write: 1.7, // 写上现在与希望
    say1: 2.6,
    pan: 3.3, // 镜头摇到右边
    enter: 3.4, // Molis 进场
    axes: 4.1,
    deal: 4.6, // 场景卡一张张落下
    say2: 5.8,
    close: 6.5, // 镜头推近左上那格；两边靠拢
    meet: 7.3, // 碰头
    lasso: 7.5, // 圈选
    say3: 8.5,
    wide: 8.8, // 拉回全景
    end: 10.2,
  };
  const cut = reel('diagnose', cue.end);

  const camera = cut.track(
    [
      [0, shot(480, 270, 1)],
      [cue.push, shot(480, 270, 1)],
      [cue.push + 0.9, shot(330, 262, 1.3)],
      [cue.pan, shot(330, 262, 1.3)],
      [cue.pan + 0.9, shot(600, 270, 1.15)],
      [cue.close, shot(600, 270, 1.15)],
      [cue.close + 0.8, shot(541, 166, 1.7)],
      [cue.wide, shot(541, 166, 1.7)],
      [cue.wide + 1, shot(480, 270, 1)],
    ],
    GLIDE,
  );

  // 业务团队：拖着便签从左边进来，在便签右上角松手，退到一边；碰头；往左上拉开选框；退开
  const you = cut.track(
    [
      [cue.drag, spot(-70, 228)],
      [cue.drop, spot(292, 170)],
      [cue.drop + 0.3, spot(292, 170)],
      [cue.drop + 0.9, spot(336, 262)],
      [cue.close, spot(336, 262)],
      [cue.meet, spot(522, 178)],
      [cue.lasso, spot(522, 178)],
      [cue.lasso + 0.8, spot(462, 100)],
      [cue.wide, spot(462, 100)],
      [cue.wide + 0.8, spot(400, 330)],
    ],
    GLIDE,
  );
  // Molis：从右边进来，边走边把场景卡发下去；碰头；往右下拉开选框；退开
  const we = cut.track(
    [
      [cue.enter, spot(1010, 330)],
      [cue.enter + 0.7, spot(846, 322)],
      [cue.deal, spot(846, 322)],
      [cue.deal + 1, spot(812, 420)],
      [cue.close, spot(812, 420)],
      [cue.meet, spot(552, 150)],
      [cue.lasso, spot(552, 150)],
      [cue.lasso + 0.8, spot(620, 232)],
      [cue.wide, spot(620, 232)],
      [cue.wide + 0.8, spot(744, 318)],
    ],
    GLIDE,
  );

  // 便签被拖着走（和光标同一段路），落下时轻轻一压
  const note = cut.track(
    [
      [cue.drag, 'transform:translate(-362px,58px) rotate(-7deg) scale(1.04)'],
      [cue.drop, 'transform:translate(0px,0px) rotate(-1.5deg) scale(1.04)'],
      [cue.drop + 0.3, 'transform:translate(0px,0px) rotate(-1.5deg) scale(1)'],
    ],
    GLIDE,
  );

  // 场景卡：发牌的顺序打散，最后两张（左上那格的）是要圈的
  const cards = [
    { x: 740, y: 140 },
    { x: 512, y: 166, chosen: true },
    { x: 520, y: 382 },
    { x: 836, y: 228 },
    { x: 580, y: 200, chosen: true },
    { x: 770, y: 400 },
  ].map((card, index) => {
    const t = cue.deal + index * 0.15;
    const from = { x: 840, y: 336 + index * 14 };
    return {
      ...card,
      track: cut.track([
        [
          t,
          `opacity:0;transform:translate(${from.x - card.x}px,${from.y - card.y}px) scale(.5)`,
        ],
        [t + 0.6, 'opacity:1;transform:translate(0px,0px) scale(1)'],
      ]),
      hot: card.chosen ? cut.track(fade(cue.lasso + 0.7, 0.4)) : '',
    };
  });

  return (
    <div className="m-duet m-film">
      <div className="m-film-frame">
        <div className={`m-film-cam ${camera}`}>
          <svg
            className="m-film-art"
            viewBox={`0 0 ${W} ${H}`}
            aria-hidden="true"
          >
            <Shadow id={shadow} />

            {/* 业务团队的便签：现在的三步，一个箭头，一个虚线圈「希望」 */}
            <g className={`m-film-note ${note}`}>
              <g filter={`url(#${shadow})`}>
                <rect
                  className="m-film-sticky"
                  x="72"
                  y="150"
                  width="236"
                  height="170"
                  rx="10"
                />
              </g>
              <path
                className={`m-k-cell ${cut.track(fade(cue.write + 0.1, 0.4))}`}
                d="M117 208 H139 M153 208 H175"
              />
              {[110, 146, 182].map((cx, index) => (
                <circle
                  key={cx}
                  className={`m-film-dot m-film-pop ${cut.track(pop(cue.write + index * 0.15))}`}
                  cx={cx}
                  cy="208"
                  r="7"
                />
              ))}
              <path
                className={`m-film-ink ${cut.track(draw(cue.write + 0.45, 0.3))}`}
                pathLength={1}
                d="M198 208 H226 M220 202 L226 208 L220 214"
              />
              <circle
                className={`m-d-wish m-film-pop ${cut.track(pop(cue.write + 0.65, 0.5))}`}
                cx="252"
                cy="208"
                r="13"
              />
              <path
                className={`m-k-thin ${cut.track(fade(cue.write + 0.3, 0.5))}`}
                d="M100 256 H270 M100 280 H218"
              />
            </g>

            {/* Molis 的四格：两条轴先画出来 */}
            <path
              className={`m-film-axis-line ${cut.track(draw(cue.axes, 0.5))}`}
              pathLength={1}
              d="M660 470 V70"
            />
            <path
              className={`m-film-axis-line ${cut.track(draw(cue.axes + 0.1, 0.5))}`}
              pathLength={1}
              d="M420 290 H900"
            />

            {/* 一起：两个光标碰头的那一下 */}
            <circle
              className={`m-film-ring m-film-pop ${cut.track([
                [cue.meet, 'opacity:0;transform:scale(.4)'],
                [cue.meet + 0.1, 'opacity:1;transform:scale(.7)'],
                [cue.meet + 0.8, 'opacity:0;transform:scale(1.8)'],
              ])}`}
              cx="537"
              cy="164"
              r="18"
            />
            {/* 一起：两个光标拉开的选框 */}
            <rect
              className={`m-film-lasso m-film-pop ${cut.track(
                [
                  [cue.lasso, 'transform:scale(0)'],
                  [cue.lasso + 0.8, 'transform:scale(1)'],
                ],
                GLIDE,
              )}`}
              x="462"
              y="100"
              width="158"
              height="132"
              rx="10"
            />

            {/* 场景卡 */}
            {cards.map((card) => (
              <g key={`${card.x}-${card.y}`} className={card.track}>
                <rect
                  className="m-film-card"
                  x={card.x - 26}
                  y={card.y - 17}
                  width="52"
                  height="34"
                  rx="6"
                />
                {card.chosen && (
                  <rect
                    className={`m-film-card-hot ${card.hot}`}
                    x={card.x - 26}
                    y={card.y - 17}
                    width="52"
                    height="34"
                    rx="6"
                  />
                )}
                <circle
                  className={card.chosen ? 'm-film-card-dot' : 'm-film-dot'}
                  cx={card.x - 14}
                  cy={card.y}
                  r="4"
                />
                <path
                  className="m-film-card-line"
                  d={`M${card.x - 5} ${card.y} H${card.x + 16}`}
                />
              </g>
            ))}

            {/* 拉回全景：便签上的「希望」连到圈出的试点 */}
            <path
              className={`m-d-link ${cut.track(fade(cue.wide + 0.3, 0.6))}`}
              d="M266 206 C340 206 392 186 460 172"
            />
          </svg>

          <span
            className={`m-film-axis ${cut.track(fade(cue.axes + 0.4))}`}
            style={pin(668, 70)}
          >
            业务价值
          </span>
          <span
            className={`m-film-axis m-film-axis-end ${cut.track(fade(cue.axes + 0.5))}`}
            style={pin(900, 270)}
          >
            接入成本
          </span>

          <Say
            id="diagnose"
            who="you"
            step={1}
            at={[72, 338]}
            className={cut.track(rise(cue.say1))}
          />
          <Say
            id="diagnose"
            who="we"
            step={2}
            at={[690, 452]}
            className={cut.track(rise(cue.say2))}
          />
          <Say
            id="diagnose"
            who="both"
            step={3}
            at={[462, 56]}
            className={cut.track(rise(cue.say3))}
          />

          <Hand who="you" className={you} />
          <Hand who="we" className={we} />
        </div>

        <span className="m-film-mark">
          <Note>示意</Note>
        </span>
        <span className="m-film-bar" aria-hidden="true">
          <span
            className={cut.track(
              [
                [0, 'transform:scaleX(0)'],
                [cue.end, 'transform:scaleX(1)'],
              ],
              'linear',
            )}
          />
        </span>
      </div>
      <Lines id="diagnose" order={['you', 'we', 'both']} />
      <style>{cut.css()}</style>
    </div>
  );
}

/** 已经拍成短片的那几本；其余的还是 duets.tsx 里的小戏 */
export const filmed: StationId[] = ['diagnose'];

export function Film({ id }: { id: StationId }) {
  if (id === 'diagnose') return <Diagnose />;
  return null;
}

