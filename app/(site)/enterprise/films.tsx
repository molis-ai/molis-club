import { useId, type CSSProperties, type ReactNode } from 'react';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import { Note } from '../../_site/ui';
import { Shadow } from './keeps';

// 合作路线每本书打开后的一段短片（负责人 2026-10-20：「假装你在拍视频」，按脚本写出谁、做什么、镜头怎么走；诊断做样片，认可后四本都拍）。
// 画面是一块 16:9 的共享画板（点阵白板），业务团队和 Molis 各是一个带名牌的光标，像两个人在同一块板上协作；
// 镜头跟着出手的那一方推近、摇过去，最后拉回全景。每一步做完，在做的地方钉一条带序号的评论，写的就是 5.3 那一格的原句，
// 所以停在最后一帧也能一眼读出：谁、在哪、做了什么、按什么顺序。
//
// 四段分镜（秒）：
//   诊断
//     推近左边      0.4–2.6    业务团队  拖进一张便签，写上「现在」三步、箭头、虚线圈「希望」 → 评论 1
//     摇到右边      3.3–5.8    Molis     进场，画出业务价值 × 接入成本两条轴，六张场景卡一张张落进四格 → 评论 2
//     推近左上那格  6.5–8.5    两边      两个光标在「价值高、成本低」那格碰头，一个往左上、一个往右下拉开选框 → 评论 3
//     拉回全景      8.8–9.8    —         便签上的「希望」连到选框
//   共建
//     推近左边      0.4–2.6    业务团队  拖进两页资料，在要紧的那一行圈一笔 → 评论 1
//     摇到右边      3.3–6.0    Molis     进场，圈过的那一行连到右边；搭出一个工具窗：输入框、运行键、一段流程、两件工具 → 评论 2
//     推近工具窗    6.6–10.1   两边      业务团队按下运行，跑到第二步出了 ✕；Molis 去改那一步；再按一次，一路跑通 ✓ → 评论 3
//   评估
//     全景          0–0.4      —         右边的图上已经有一条虚线：事先约定的标准
//     推近左边      0.4–3.2    业务团队  把四步流程一步步亲手点过，结果单落下来 → 评论 1
//     摇到中间      3.7–6.3    Molis     拿放大镜扫结果单，逐条连到核对单，三行打勾 → 评论 2
//     推近右边      6.9–9.2    两边      一人按住标准线的一头，实际结果的柱子长过这条线，盖章 → 评论 3
//   培训（Molis 先出手）
//     推近左边      0.4–2.6    Molis     拖着一叠卡进来，放进业务团队的托盘，摊开成规则、资料、配置、验证方法、维护说明 → 评论 1
//     摇到中间      3.2–6.5    业务团队  自己点着走完一圈任务，再把结果逐项打勾；Molis 跟在后面不出手（陪跑） → 评论 2
//     推近上边      7.0–9.2    两边      冒出一个异常，两边碰头；它连到托盘里的维护说明，挂上由谁维护的那枚头像，✓ → 评论 3
//
// 实现：脚本里每样东西一条轨道（几个时刻各是什么样子），合成一段 CSS 关键帧，全片同一个长度，所以百分比就是时间线。
// 静止是最后一帧（没有 JS、减少动态都看这一帧）；外层 .m-film 有 data-play 时从头演，data-hold 时停在第一帧（stages.tsx）。
// 画面坐标 960 × 540；字都是 HTML，按画面宽度（cqw）定位、定字号，跟着镜头一起推拉；窄屏上画面里的字收起，三句排在画面下面。

const { line } = enterprise;
const W = 960;
const H = 540;
/** 落定：出手、浮现 */
const OUT = 'cubic-bezier(.2,.7,.1,1)';
/** 走位：光标和镜头的移动，起落都缓 */
const GLIDE = 'cubic-bezier(.6,0,.25,1)';

type Who = 'you' | 'we' | 'both';
type Frame = [seconds: number, css: string];
type Point = [seconds: number, x: number, y: number];
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
type Cut = ReturnType<typeof reel>;

/** HTML 东西在画面里的位置（光标、名牌）：按画面宽度换算 */
const spot = (x: number, y: number) =>
  `transform:translate(${round(x / 9.6)}cqw,${round(y / 9.6)}cqw)`;
/** 光标走的一串点 */
const walk = (points: Point[]): Frame[] =>
  points.map(([t, x, y]) => [t, spot(x, y)]);
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
const WIDE = shot(480, 270, 1);
const HIDE = 'opacity:0;transform:scale(.4)';
const SHOW = 'opacity:1;transform:scale(1)';
const pop = (t: number, length = 0.4): Frame[] => [
  [t, HIDE],
  [t + length, SHOW],
];
/** 大一点的东西：轻轻浮出来，不缩那么多 */
const open = (t: number): Frame[] => [
  [t, 'opacity:0;transform:scale(.94)'],
  [t + 0.5, SHOW],
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
  [t, 'opacity:0;stroke-dashoffset:1'],
  [t + length, 'opacity:1;stroke-dashoffset:0'],
];
/** 一闪就散的一圈：碰头、改好的那一下 */
const ping = (t: number): Frame[] => [
  [t, 'opacity:0;transform:scale(.4)'],
  [t + 0.1, 'opacity:1;transform:scale(.7)'],
  [t + 0.8, 'opacity:0;transform:scale(1.8)'],
];
/** 按下去：每个时刻按一下 */
const press = (...times: number[]): Frame[] =>
  times.flatMap((t): Frame[] => [
    [t, 'transform:scale(1)'],
    [t + 0.1, 'transform:scale(.84)'],
    [t + 0.32, 'transform:scale(1)'],
  ]);

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

/** 一句原句：按词组排，只在词组之间折行 */
function Words({ id, who }: { id: StationId; who: Who }) {
  return (
    <span className="m-film-text">
      {line.rows[id][who].map((group) => (
        <span key={group} className="m-phrase">
          {group}
        </span>
      ))}
    </span>
  );
}

/** 钉在画面上的一条评论：序号、谁、5.3 的原句 */
function Say({
  id,
  who,
  order,
  at,
  className,
}: {
  id: StationId;
  who: Who;
  order: Who[];
  at: [number, number];
  className: string;
}) {
  return (
    <p className={`m-film-say ${className}`} data-who={who} style={pin(...at)}>
      <span className="m-film-step" aria-hidden="true">
        {order.indexOf(who) + 1}
      </span>
      <span className="m-film-who" lang={who === 'we' ? 'en' : undefined}>
        {line.who[who]}
      </span>
      <Words id={id} who={who} />
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
          <Words id={id} who={who} />
        </li>
      ))}
    </ol>
  );
}

/** 片子的外壳：画框、镜头、画、字、示意章、进度，和窄屏上的三句 */
function Reel({
  id,
  cut,
  camera,
  order,
  art,
  overlay,
}: {
  id: StationId;
  cut: Cut;
  camera: string;
  order: Who[];
  art: ReactNode;
  overlay: ReactNode;
}) {
  const bar = cut.track(
    [
      [0, 'transform:scaleX(0)'],
      [cut.length, 'transform:scaleX(1)'],
    ],
    'linear',
  );
  return (
    <div className="m-film">
      <div className="m-film-frame">
        <div className={`m-film-cam ${camera}`}>
          <svg
            className="m-film-art"
            viewBox={`0 0 ${W} ${H}`}
            aria-hidden="true"
          >
            {art}
          </svg>
          {overlay}
        </div>
        <span className="m-film-mark">
          <Note>示意</Note>
        </span>
        <span className="m-film-bar" aria-hidden="true">
          <span className={bar} />
        </span>
      </div>
      <Lines id={id} order={order} />
      <style>{cut.css()}</style>
    </div>
  );
}

/** 一张白卡片（带影子） */
function Paper({
  shadow,
  ...rect
}: {
  shadow: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}) {
  return (
    <g filter={`url(#${shadow})`}>
      <rect className="m-k-paper" {...rect} />
    </g>
  );
}

/* ================================ 诊断 ================================ */
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
  const order: Who[] = ['you', 'we', 'both'];
  const cut = reel('diagnose', cue.end);

  const camera = cut.track(
    [
      [0, WIDE],
      [cue.push, WIDE],
      [cue.push + 0.9, shot(330, 262, 1.3)],
      [cue.pan, shot(330, 262, 1.3)],
      [cue.pan + 0.9, shot(600, 270, 1.15)],
      [cue.close, shot(600, 270, 1.15)],
      [cue.close + 0.8, shot(541, 166, 1.7)],
      [cue.wide, shot(541, 166, 1.7)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );

  // 业务团队：拖着便签从左边进来，在便签右上角松手，退到一边；碰头；往左上拉开选框；退开
  const you = cut.track(
    walk([
      [cue.drag, -160, 228],
      [cue.drop, 292, 170],
      [cue.drop + 0.3, 292, 170],
      [cue.drop + 0.9, 336, 262],
      [cue.close, 336, 262],
      [cue.meet, 522, 178],
      [cue.lasso, 522, 178],
      [cue.lasso + 0.8, 462, 100],
      [cue.wide, 462, 100],
      [cue.wide + 0.8, 400, 330],
    ]),
    GLIDE,
  );
  // Molis：从右边进来，边走边把场景卡发下去；碰头；往右下拉开选框；退开
  const we = cut.track(
    walk([
      [cue.enter, 1010, 330],
      [cue.enter + 0.7, 846, 322],
      [cue.deal, 846, 322],
      [cue.deal + 1, 812, 420],
      [cue.close, 812, 420],
      [cue.meet, 552, 150],
      [cue.lasso, 552, 150],
      [cue.lasso + 0.8, 620, 232],
      [cue.wide, 620, 232],
      [cue.wide + 0.8, 744, 318],
    ]),
    GLIDE,
  );

  // 便签被拖着走（和光标同一段路），落下时轻轻一压
  const note = cut.track(
    [
      [cue.drag, 'transform:translate(-452px,58px) rotate(-7deg) scale(1.04)'],
      [cue.drop, 'transform:translate(0px,0px) rotate(-1.5deg) scale(1.04)'],
      [cue.drop + 0.3, 'transform:translate(0px,0px) rotate(-1.5deg) scale(1)'],
    ],
    GLIDE,
  );

  // 场景卡：发牌的顺序打散，第二张和第五张（左上那格的）是要圈的
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

  const art = (
    <>
      <Shadow id={shadow} />

      {/* 业务团队的便签：现在的三步，一个箭头，一个虚线圈「希望」 */}
      <g className={`m-film-carry ${note}`}>
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
          className={`m-film-wish m-film-pop ${cut.track(pop(cue.write + 0.65, 0.5))}`}
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

      {/* 一起：两个光标碰头的那一下，再拉开选框 */}
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.meet))}`}
        cx="537"
        cy="164"
        r="18"
      />
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
        className={`m-film-link ${cut.track(fade(cue.wide + 0.3, 0.6))}`}
        d="M266 206 C340 206 392 186 460 172"
      />
    </>
  );

  const overlay = (
    <>
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
        order={order}
        at={[72, 338]}
        className={cut.track(rise(cue.say1))}
      />
      <Say
        id="diagnose"
        who="we"
        order={order}
        at={[690, 452]}
        className={cut.track(rise(cue.say2))}
      />
      <Say
        id="diagnose"
        who="both"
        order={order}
        at={[462, 56]}
        className={cut.track(rise(cue.say3))}
      />
      <Hand who="you" className={you} />
      <Hand who="we" className={we} />
    </>
  );

  return (
    <Reel
      id="diagnose"
      cut={cut}
      camera={camera}
      order={order}
      art={art}
      overlay={overlay}
    />
  );
}

/* ================================ 共建 ================================ */
function Build() {
  const shadow = useId();
  const cue = {
    push: 0.4, // 镜头推近左边
    drag: 0.4, // 业务团队拖着两页资料进场
    drop: 1.3,
    mark: 1.7, // 在要紧的那一行圈一笔
    say1: 2.6,
    pan: 3.3, // 镜头摇到右边
    enter: 3.4, // Molis 进场
    link: 3.9, // 圈过的那一行连到右边
    window: 4.1, // 工具窗
    parts: 4.5, // 输入框、运行键、流程、工具
    say2: 6.0,
    close: 6.6, // 镜头推近工具窗；业务团队去按运行
    press1: 7.4,
    fail: 8.0, // 跑到第二步出了 ✕
    fix: 8.6, // Molis 改那一步
    press2: 9.0,
    pass: 9.85, // 一路跑通
    say3: 10.1,
    wide: 10.5,
    end: 12,
  };
  const order: Who[] = ['you', 'we', 'both'];
  const cut = reel('build', cue.end);

  const camera = cut.track(
    [
      [0, WIDE],
      [cue.push, WIDE],
      [cue.push + 0.9, shot(300, 270, 1.35)],
      [cue.pan, shot(300, 270, 1.35)],
      [cue.pan + 0.9, shot(640, 260, 1.2)],
      [cue.close, shot(640, 260, 1.2)],
      [cue.close + 0.8, shot(640, 262, 1.25)],
      [cue.wide, shot(640, 262, 1.25)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );

  // 业务团队：拖着资料进来，圈一笔，退到一边；去按运行（按两次）；退开
  const you = cut.track(
    walk([
      [cue.drag, -160, 240],
      [cue.drop, 236, 172],
      [cue.drop + 0.3, 236, 172],
      [cue.mark, 204, 244],
      [cue.mark + 0.6, 98, 252],
      [cue.mark + 1, 282, 330],
      [cue.close, 282, 330],
      [cue.close + 0.8, 798, 174],
      [cue.wide, 798, 174],
      [cue.wide + 0.8, 800, 226],
    ]),
    GLIDE,
  );
  // Molis：从右边进来，搭输入框、运行键、流程、工具；去改出错的那一步，再退开
  const we = cut.track(
    walk([
      [cue.enter, 1000, 300],
      [cue.enter + 0.7, 890, 300],
      [cue.parts - 0.1, 742, 196],
      [cue.parts + 0.3, 822, 192],
      [cue.parts + 0.8, 742, 312],
      [cue.parts + 1.2, 748, 372],
      [cue.fix - 0.6, 748, 372],
      [cue.fix, 612, 304],
      [cue.fix + 0.4, 612, 304],
      [cue.fix + 0.9, 652, 384],
    ]),
    GLIDE,
  );

  const papers = cut.track(
    [
      [cue.drag, 'transform:translate(-396px,68px) rotate(-5deg) scale(1.03)'],
      [cue.drop, 'transform:translate(0px,0px) rotate(0deg) scale(1.03)'],
      [cue.drop + 0.3, 'transform:translate(0px,0px) rotate(0deg) scale(1)'],
    ],
    GLIDE,
  );
  // 跑的那颗点：第一次停在第二步前，第二次跑到底
  const run = cut.track(
    [
      [cue.press1 + 0.1, 'opacity:0;transform:translate(0px,0px)'],
      [cue.press1 + 0.15, 'opacity:1;transform:translate(0px,0px)'],
      [cue.fail, 'opacity:1;transform:translate(104px,0px)'],
      [cue.fail + 0.3, 'opacity:0;transform:translate(104px,0px)'],
      [cue.press2 + 0.1, 'opacity:0;transform:translate(0px,0px)'],
      [cue.press2 + 0.15, 'opacity:1;transform:translate(0px,0px)'],
      [cue.pass, 'opacity:1;transform:translate(326px,0px)'],
      [cue.pass + 0.3, 'opacity:0;transform:translate(326px,0px)'],
    ],
    GLIDE,
  );

  const lines = [194, 212, 230, 248, 266, 284, 302, 320];
  const ends = [214, 204, 216, 190, 210, 176, 200, 160];

  const art = (
    <>
      <Shadow id={shadow} />

      {/* 业务团队的两页资料，前一页上要紧的那一行被圈了一笔 */}
      <g className={`m-film-carry ${papers}`}>
        <g filter={`url(#${shadow})`}>
          <rect
            className="m-k-paper"
            x="92"
            y="158"
            width="160"
            height="206"
            rx="8"
            transform="rotate(4 172 261)"
          />
        </g>
        <g transform="rotate(-2 156 253)">
          <g filter={`url(#${shadow})`}>
            <rect
              className="m-k-paper"
              x="76"
              y="150"
              width="160"
              height="206"
              rx="8"
            />
          </g>
          <rect
            className="m-film-title"
            x="96"
            y="170"
            width="64"
            height="6"
            rx="3"
          />
          <path
            className="m-k-thin"
            d={lines.map((y, i) => `M96 ${y} H${ends[i]}`).join(' ')}
          />
          <path
            className={`m-film-ink ${cut.track(draw(cue.mark, 0.6))}`}
            pathLength={1}
            d="M200 247 C200 238 150 236 116 238 C94 240 88 252 104 257 C130 263 196 260 202 249"
          />
        </g>
      </g>
      <path
        className={`m-film-link ${cut.track(fade(cue.link, 0.6))}`}
        d="M206 248 C300 250 340 252 398 252"
      />

      {/* Molis 搭出来的工具窗 */}
      <g className={`m-film-pop ${cut.track(open(cue.window))}`}>
        <Paper shadow={shadow} x={400} y={92} width={480} height={320} rx={12} />
        <path className="m-k-cell" d="M400 124 H880" />
        {[420, 434, 448].map((cx) => (
          <circle key={cx} className="m-k-light" cx={cx} cy="108" r="3.5" />
        ))}
      </g>
      {/* 产品交互：一个输入框 */}
      <g className={`m-film-pop ${cut.track(pop(cue.parts))}`}>
        <rect
          className="m-film-field"
          x="432"
          y="148"
          width="300"
          height="44"
          rx="9"
        />
        <rect
          className="m-film-faint"
          x="450"
          y="167"
          width="120"
          height="6"
          rx="3"
        />
      </g>
      {/* 运行键 */}
      <g className={`m-film-pop ${cut.track(pop(cue.parts + 0.2))}`}>
        <g
          className={`m-film-pop ${cut.track(press(cue.press1, cue.press2))}`}
        >
          <circle className="m-film-run" cx="796" cy="170" r="20" />
          <path className="m-film-run-mark" d="M789 161 L804 170 L789 179 Z" />
        </g>
      </g>
      {/* 执行流程：起点、两步、终点 */}
      <path
        className={`m-film-axis-line ${cut.track(draw(cue.parts + 0.4, 0.5))}`}
        pathLength={1}
        d="M494 290 H806"
      />
      <rect
        className={`m-film-start m-film-pop ${cut.track(pop(cue.parts + 0.4))}`}
        x="466"
        y="276"
        width="28"
        height="28"
        rx="7"
      />
      {[600, 720].map((cx, index) => (
        <circle
          key={cx}
          className={`m-film-node m-film-pop ${cut.track(pop(cue.parts + 0.55 + index * 0.15))}`}
          cx={cx}
          cy="290"
          r="16"
        />
      ))}
      <circle
        className={`m-film-node m-film-pop ${cut.track(pop(cue.parts + 0.85))}`}
        cx="820"
        cy="290"
        r="14"
      />
      {/* 工具能力：挂在两步下面的两件工具 */}
      {[600, 720].map((cx, index) => (
        <g
          key={cx}
          className={`m-film-pop ${cut.track(pop(cue.parts + 1 + index * 0.15))}`}
        >
          <path className="m-k-cell" d={`M${cx} 306 V338`} />
          <rect
            className="m-film-chip"
            x={cx - 20}
            y="338"
            width="40"
            height="20"
            rx="10"
          />
          <path
            className="m-film-card-line"
            d={`M${cx - 9} 348 H${cx + 9}`}
          />
        </g>
      ))}

      {/* 一起试：第二步先出 ✕，Molis 改好（变成杏色），再跑通，终点打勾 */}
      <path
        className={`m-film-ink-x m-film-pop ${cut.track([
          [cue.fail, HIDE],
          [cue.fail + 0.25, SHOW],
          [cue.fix, SHOW],
          [cue.fix + 0.3, HIDE],
        ])}`}
        d="M594 284 L606 296 M606 284 L594 296"
      />
      <circle
        className={`m-film-node-hot ${cut.track(fade(cue.fix + 0.1, 0.4))}`}
        cx="600"
        cy="290"
        r="16"
      />
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.fix))}`}
        cx="600"
        cy="290"
        r="20"
      />
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.press1))}`}
        cx="796"
        cy="170"
        r="24"
      />
      <circle
        className={`m-film-run-dot ${run}`}
        cx="480"
        cy="290"
        r="6"
      />
      <g className={`m-film-pop ${cut.track(pop(cue.pass, 0.45))}`}>
        <circle className="m-film-ok" cx="820" cy="290" r="14" />
        <path className="m-k-tick" d="M813.5 290 l4.5 4.5 l8 -9" />
      </g>
    </>
  );

  const overlay = (
    <>
      <Say
        id="build"
        who="you"
        order={order}
        at={[76, 380]}
        className={cut.track(rise(cue.say1))}
      />
      <Say
        id="build"
        who="we"
        order={order}
        at={[500, 430]}
        className={cut.track(rise(cue.say2))}
      />
      <Say
        id="build"
        who="both"
        order={order}
        at={[420, 54]}
        className={cut.track(rise(cue.say3))}
      />
      <Hand who="you" className={you} />
      <Hand who="we" className={we} />
    </>
  );

  return (
    <Reel
      id="build"
      cut={cut}
      camera={camera}
      order={order}
      art={art}
      overlay={overlay}
    />
  );
}

/* ================================ 评估 ================================ */
function Assess() {
  const shadow = useId();
  const cue = {
    push: 0.4, // 镜头推近左边；业务团队进场
    clicks: [1.15, 1.6, 2.05, 2.5], // 四步一步步点过
    result: 2.75, // 结果单落下来
    say1: 3.2,
    pan: 3.7, // 镜头摇到中间
    enter: 3.8, // Molis 进场
    scan: 4.6, // 放大镜扫结果单
    panel: 5, // 核对单
    ticks: [5.6, 5.85, 6.1], // 质量、来源、完成情况
    say2: 6.4,
    close: 6.9, // 镜头推近右边的图；两边去按住标准线
    hold: 7.7,
    bars: 7.9, // 实际结果的柱子长起来
    stamp: 9,
    say3: 9.2,
    wide: 9.6,
    end: 11.2,
  };
  const order: Who[] = ['you', 'we', 'both'];
  const cut = reel('assess', cue.end);

  const camera = cut.track(
    [
      [0, WIDE],
      [cue.push, WIDE],
      [cue.push + 0.9, shot(260, 250, 1.4)],
      [cue.pan, shot(260, 250, 1.4)],
      [cue.pan + 0.9, shot(450, 270, 1.3)],
      [cue.close, shot(450, 270, 1.3)],
      [cue.close + 0.8, shot(800, 250, 1.5)],
      [cue.wide, shot(800, 250, 1.5)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );

  const steps = [110, 200, 290, 380];
  // 业务团队：亲手把四步点一遍，退到一边；去按住标准线的左头；退开
  const you = cut.track(
    walk([
      [cue.push, -160, 200],
      ...steps.flatMap((x, i): Point[] => [
        [cue.clicks[i] - 0.05, x + 4, 136],
        [cue.clicks[i] + 0.1, x + 4, 136],
      ]),
      [cue.say1 - 0.1, 366, 300],
      [cue.close, 366, 300],
      [cue.hold, 704, 262],
      [cue.wide, 704, 262],
      [cue.wide + 0.8, 620, 300],
    ]),
    GLIDE,
  );
  // Molis：进场去结果单，拿放大镜扫一遍；到核对单上逐行打勾；去按住标准线的右头；退开
  const rows = [240, 280, 320];
  const we = cut.track(
    walk([
      [cue.enter, 1000, 260],
      [cue.enter + 0.7, 322, 222],
      [cue.scan, 322, 222],
      [cue.scan + 0.6, 196, 300],
      ...rows.flatMap((y, i): Point[] => [
        [cue.ticks[i] - 0.1, 446, y + 6],
        [cue.ticks[i] + 0.05, 446, y + 6],
      ]),
      [cue.close, 446, 326],
      [cue.hold, 900, 262],
      [cue.wide, 900, 262],
      [cue.wide + 0.8, 780, 432],
    ]),
    GLIDE,
  );
  // 放大镜跟着 Molis 的光标走
  const lens = cut.track(
    [
      [cue.scan - 0.15, 'opacity:0;transform:translate(322px,222px)'],
      [cue.scan, 'opacity:1;transform:translate(322px,222px)'],
      [cue.scan + 0.6, 'opacity:1;transform:translate(196px,300px)'],
      [cue.scan + 0.8, 'opacity:0;transform:translate(196px,300px)'],
    ],
    GLIDE,
  );

  const bars = [
    { x: 722, h: 150 },
    { x: 772, h: 176 },
    { x: 822, h: 160 },
    { x: 872, h: 196 },
  ];

  const art = (
    <>
      <Shadow id={shadow} />

      {/* 右边的图：一开场就有那条虚线——事先约定的标准 */}
      <path className="m-k-cell" d="M700 130 V380 H910" />
      <path className="m-film-standard" d="M700 262 H910" />

      {/* 业务团队：四步流程，一步步亲手点过 */}
      <path className="m-k-cell" d="M132 130 H358" />
      {steps.map((cx, i) => (
        <g key={cx}>
          <rect
            className="m-film-card"
            x={cx - 22}
            y="108"
            width="44"
            height="44"
            rx="10"
          />
          <circle className="m-film-dot" cx={cx} cy="130" r="3.5" />
          <g className={`m-film-pop ${cut.track(pop(cue.clicks[i] + 0.05, 0.3))}`}>
            <rect
              className="m-film-done"
              x={cx - 22}
              y="108"
              width="44"
              height="44"
              rx="10"
            />
            <path
              className="m-film-tick-ink"
              d={`M${cx - 8} 130 l5.5 5.5 l10 -11`}
            />
          </g>
        </g>
      ))}
      {/* 跑完落下来的结果单 */}
      <g
        className={cut.track([
          [cue.result, 'opacity:0;transform:translateY(-24px)'],
          [cue.result + 0.5, 'opacity:1;transform:none'],
        ])}
      >
        <Paper shadow={shadow} x={150} y={196} width={180} height={160} rx={10} />
        <rect
          className="m-film-title"
          x="170"
          y="216"
          width="70"
          height="6"
          rx="3"
        />
        <path className="m-k-thin" d="M170 242 H306 M170 262 H290 M170 282 H300" />
        {[14, 22, 18, 26].map((h, i) => (
          <rect
            key={i}
            className="m-film-faint"
            x={170 + i * 16}
            y={336 - h}
            width="10"
            height={h}
            rx="2"
          />
        ))}
      </g>

      {/* Molis：从结果单逐条连到核对单，三行打勾 */}
      <path
        className={`m-film-trace ${cut.track(fade(cue.panel + 0.2, 0.5))}`}
        d="M332 242 C372 242 384 240 420 240 M332 262 C376 264 384 280 420 280 M332 282 C380 286 386 318 420 320"
      />
      <g className={`m-film-pop ${cut.track(open(cue.panel))}`}>
        <Paper shadow={shadow} x={420} y={200} width={180} height={160} rx={10} />
        {rows.map((y) => (
          <g key={y}>
            <rect
              className="m-film-box"
              x="436"
              y={y - 8}
              width="16"
              height="16"
              rx="4"
            />
            <path className="m-k-thin" d={`M466 ${y} H580`} />
          </g>
        ))}
      </g>
      {rows.map((y, i) => (
        <path
          key={y}
          className={`m-k-tick m-film-pop ${cut.track(pop(cue.ticks[i], 0.3))}`}
          d={`M439.5 ${y} l3.5 3.5 l6.5 -7`}
        />
      ))}
      <g className={lens}>
        <circle className="m-film-lens" cx="-15" cy="-15" r="17" />
      </g>

      {/* 一起：两边按住标准线的两头，标准线亮起来；实际结果的柱子长过它；盖章 */}
      <path
        className={`m-film-standard-on ${cut.track(fade(cue.hold - 0.1, 0.4))}`}
        d="M700 262 H910"
      />
      {[704, 900].map((cx) => (
        <circle
          key={cx}
          className={`m-film-ring m-film-pop ${cut.track(ping(cue.hold))}`}
          cx={cx}
          cy="262"
          r="14"
        />
      ))}
      {bars.map(({ x, h }, i) => (
        <rect
          key={x}
          className={`m-film-barv m-film-grow ${cut.track([
            [cue.bars + i * 0.15, 'transform:scaleY(0)'],
            [cue.bars + i * 0.15 + 0.7, 'transform:scaleY(1)'],
          ])}`}
          x={x}
          y={380 - h}
          width="26"
          height={h}
          rx="3"
        />
      ))}
      <g className={`m-film-pop ${cut.track(pop(cue.stamp, 0.45))}`}>
        <circle className="m-film-ok" cx="884" cy="150" r="18" />
        <path className="m-k-tick" d="M876 150 l5.5 5.5 l10 -11" />
      </g>
    </>
  );

  const overlay = (
    <>
      <Say
        id="assess"
        who="you"
        order={order}
        at={[90, 380]}
        className={cut.track(rise(cue.say1))}
      />
      <Say
        id="assess"
        who="we"
        order={order}
        at={[410, 380]}
        className={cut.track(rise(cue.say2))}
      />
      <Say
        id="assess"
        who="both"
        order={order}
        at={[636, 84]}
        className={cut.track(rise(cue.say3))}
      />
      <Hand who="you" className={you} />
      <Hand who="we" className={we} />
    </>
  );

  return (
    <Reel
      id="assess"
      cut={cut}
      camera={camera}
      order={order}
      art={art}
      overlay={overlay}
    />
  );
}

/* ================================ 培训 ================================ */
function Train() {
  const shadow = useId();
  const cue = {
    enter: 0.4, // Molis 拖着一叠卡进场；镜头推近左边
    drop: 1.3,
    deal: 1.5, // 五张卡摊开
    say1: 2.6,
    pan: 3.2, // 镜头摇到中间；业务团队进场
    loop: 3.9, // 自己点着走完一圈
    round: 5.4,
    checks: [5.7, 5.95, 6.2], // 结果逐项打勾
    say2: 6.5,
    close: 7, // 镜头推近上边；冒出一个异常
    meet: 7.9, // 两边碰头
    route: 8.1, // 连到维护说明
    owner: 8.7, // 挂上由谁维护
    ok: 9,
    say3: 9.2,
    wide: 9.6,
    end: 11.2,
  };
  const order: Who[] = ['we', 'you', 'both'];
  const cut = reel('train', cue.end);

  const camera = cut.track(
    [
      [0, WIDE],
      [cue.enter, WIDE],
      [cue.enter + 0.8, shot(260, 250, 1.35)],
      [cue.pan, shot(260, 250, 1.35)],
      [cue.pan + 0.8, shot(600, 260, 1.25)],
      [cue.close, shot(600, 260, 1.25)],
      [cue.close + 0.8, shot(540, 200, 1.15)],
      [cue.wide, shot(540, 200, 1.15)],
      [cue.wide + 1, WIDE],
    ],
    GLIDE,
  );

  // 任务的一圈：上、右、下、左四个节点
  const C = { x: 520, y: 250 };
  const R = 78;
  const nodes = [
    { x: C.x, y: C.y - R },
    { x: C.x + R, y: C.y },
    { x: C.x, y: C.y + R },
    { x: C.x - R, y: C.y },
  ];
  const at = [cue.loop, cue.loop + 0.4, cue.loop + 0.8, cue.loop + 1.2];
  const rows = [214, 256, 298];

  // 业务团队：从下边进来，自己点着走完一圈，再去核对单逐项打勾；去异常那里碰头；退开
  const you = cut.track(
    walk([
      [cue.pan, 380, 580],
      ...nodes.map((n, i): Point => [at[i] - 0.05, n.x + 2, n.y + 4]),
      [cue.round - 0.05, nodes[0].x + 2, nodes[0].y + 4],
      ...rows.map((y, i): Point => [cue.checks[i] - 0.1, 680, y + 4]),
      [cue.close, 680, 302],
      [cue.meet, 496, 110],
      [cue.wide, 496, 110],
      [cue.wide + 0.8, 700, 400],
    ]),
    GLIDE,
  );
  // Molis：拖着卡进来放进托盘；之后跟在业务团队后面陪跑，不出手；去异常那里碰头；退开
  const we = cut.track(
    walk([
      [cue.enter, 1000, 230],
      [cue.drop, 300, 196],
      [cue.drop + 0.2, 300, 196],
      [cue.drop + 1, 334, 222],
      [cue.loop, 334, 222],
      ...nodes.map((n, i): Point => [at[i] + 0.4, n.x + 70, n.y + 50]),
      [cue.round + 0.4, nodes[0].x + 70, nodes[0].y + 50],
      [cue.close, nodes[0].x + 70, nodes[0].y + 50],
      [cue.meet, 600, 100],
      [cue.wide, 600, 100],
      [cue.wide + 0.8, 790, 140],
    ]),
    GLIDE,
  );

  // 五张卡：规则、资料、配置、验证方法、维护说明；先叠成一叠跟着 Molis 进来，落下后摊进托盘
  const slots = [
    { x: 92, y: 178 },
    { x: 158, y: 178 },
    { x: 224, y: 178 },
    { x: 125, y: 252 },
    { x: 191, y: 252 },
  ];
  const cards = slots.map((slot, i) => {
    const stack = { x: 238 + i * 3, y: 160 - i * 3 };
    const t = cue.deal + i * 0.14;
    const from = (dx: number, dy: number) =>
      `transform:translate(${stack.x + dx - slot.x}px,${stack.y + dy - slot.y}px)`;
    return {
      ...slot,
      track: cut.track(
        [
          [cue.enter, from(700, 34)],
          [cue.drop, from(0, 0)],
          [t, from(0, 0)],
          [t + 0.5, 'transform:translate(0px,0px)'],
        ],
        GLIDE,
      ),
    };
  });
  const glyphs = [
    // 规则：三行带点的条目
    (x: number, y: number) => (
      <>
        {[15, 24, 33].map((d) => (
          <circle key={d} className="m-film-mini-dot" cx={x + 14} cy={y + d} r="2.4" />
        ))}
        <path
          className="m-film-mini"
          d={`M${x + 21} ${y + 15} H${x + 46} M${x + 21} ${y + 24} H${x + 42} M${x + 21} ${y + 33} H${x + 44}`}
        />
      </>
    ),
    // 资料：一页折角的纸
    (x: number, y: number) => (
      <>
        <path
          className="m-film-mini-line"
          d={`M${x + 20} ${y + 8} H${x + 35} L${x + 41} ${y + 14} V${y + 40} H${x + 20} Z M${x + 35} ${y + 8} V${y + 14} H${x + 41}`}
        />
        <path
          className="m-film-mini"
          d={`M${x + 24} ${y + 22} H${x + 36} M${x + 24} ${y + 28} H${x + 36} M${x + 24} ${y + 34} H${x + 32}`}
        />
      </>
    ),
    // 配置：两个开关
    (x: number, y: number) => (
      <>
        <rect className="m-film-switch-on" x={x + 16} y={y + 11} width="26" height="11" rx="5.5" />
        <circle className="m-film-card-dot" cx={x + 36.5} cy={y + 16.5} r="3.6" />
        <rect className="m-film-mini-line" x={x + 16} y={y + 27} width="26" height="11" rx="5.5" />
        <circle className="m-film-dot" cx={x + 21.5} cy={y + 32.5} r="3.6" />
      </>
    ),
    // 验证方法：两个打了勾的格子
    (x: number, y: number) => (
      <>
        {[12, 27].map((d) => (
          <g key={d}>
            <rect className="m-film-mini-line" x={x + 12} y={y + d} width="10" height="10" rx="2.5" />
            <path className="m-k-tick" d={`M${x + 14.2} ${y + d + 5} l2.2 2.2 l4 -4.4`} />
            <path className="m-film-mini" d={`M${x + 28} ${y + d + 5} H${x + 48}`} />
          </g>
        ))}
      </>
    ),
    // 维护说明：一个齿轮和两行字
    (x: number, y: number) => (
      <>
        <circle className="m-film-gear" cx={x + 20} cy={y + 24} r="8" />
        <circle className="m-film-mini-line" cx={x + 20} cy={y + 24} r="4.5" />
        <path
          className="m-film-mini"
          d={`M${x + 34} ${y + 19} H${x + 48} M${x + 34} ${y + 29} H${x + 44}`}
        />
      </>
    ),
  ];

  const art = (
    <>
      <Shadow id={shadow} />

      {/* 业务团队这边的托盘 */}
      <rect
        className="m-film-tray"
        x="70"
        y="150"
        width="240"
        height="190"
        rx="14"
      />

      {/* 业务团队：一圈任务、一张核对单 */}
      <circle
        className={`m-film-axis-line ${cut.track(draw(cue.pan + 0.3, 0.6))}`}
        pathLength={1}
        cx={C.x}
        cy={C.y}
        r={R}
      />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            className={`m-film-node m-film-pop ${cut.track(pop(cue.pan + 0.5 + i * 0.08, 0.3))}`}
            cx={n.x}
            cy={n.y}
            r="9"
          />
          <circle
            className={`m-film-node-done m-film-pop ${cut.track(
              pop(i === 0 ? cue.round : at[i], 0.3),
            )}`}
            cx={n.x}
            cy={n.y}
            r="9"
          />
        </g>
      ))}
      <rect
        className={`m-film-orbit ${cut.track(
          [
            [cue.loop - 0.05, 'opacity:0;transform:rotate(0deg)'],
            [cue.loop, 'opacity:1;transform:rotate(0deg)'],
            [cue.round, 'opacity:1;transform:rotate(360deg)'],
            [cue.round + 0.3, 'opacity:0;transform:rotate(360deg)'],
          ],
          'linear',
        )}`}
        x={C.x - 6}
        y={C.y - R - 6}
        width="12"
        height="12"
        rx="3"
        style={{ transformOrigin: `${C.x}px ${C.y}px` }}
      />
      <g className={`m-film-pop ${cut.track(open(cue.round - 0.2))}`}>
        <Paper shadow={shadow} x={660} y={186} width={160} height={138} rx={10} />
        {rows.map((y) => (
          <g key={y}>
            <rect
              className="m-film-box"
              x="676"
              y={y - 8}
              width="16"
              height="16"
              rx="4"
            />
            <path className="m-k-thin" d={`M704 ${y} H800`} />
          </g>
        ))}
      </g>
      {rows.map((y, i) => (
        <path
          key={y}
          className={`m-film-tick-ink m-film-pop ${cut.track(pop(cue.checks[i], 0.3))}`}
          d={`M679.5 ${y} l3.5 3.5 l6.5 -7`}
        />
      ))}

      {/* 一起：冒出一个异常，连到托盘里的维护说明，挂上由谁维护的头像，打勾 */}
      <path
        className={`m-film-link ${cut.track(fade(cue.route, 0.6))}`}
        d="M430 74 C330 74 246 140 222 250"
      />
      <g
        className={`m-film-pop ${cut.track([
          [cue.close + 0.1, HIDE],
          [cue.close + 0.45, SHOW],
          [cue.close + 0.55, 'opacity:1;transform:rotate(-4deg)'],
          [cue.close + 0.65, 'opacity:1;transform:rotate(4deg)'],
          [cue.close + 0.75, SHOW],
        ])}`}
      >
        <Paper shadow={shadow} x={430} y={52} width={110} height={44} rx={10} />
        <path className="m-film-alert" d="M452 63 L463 83 H441 Z" />
        <path className="m-film-alert-mark" d="M452 69.5 V75.5 M452 79 V79.2" />
        <path className="m-k-thin" d="M474 70 H524 M474 80 H508" />
      </g>
      <circle
        className={`m-film-ring m-film-pop ${cut.track(ping(cue.meet))}`}
        cx="540"
        cy="98"
        r="18"
      />
      <g className={`m-film-pop ${cut.track(pop(cue.owner))}`}>
        <circle className="m-film-badge" cx="566" cy="74" r="15" />
        <circle className="m-film-badge-mark" cx="566" cy="70" r="4" />
        <path className="m-film-badge-mark" d="M558.5 83 C559.5 76.5 572.5 76.5 573.5 83 Z" />
      </g>
      <g className={`m-film-pop ${cut.track(pop(cue.ok, 0.45))}`}>
        <circle className="m-film-ok" cx="540" cy="52" r="9" />
        <path className="m-k-tick" d="M535.8 52 l3 3 l5.4 -6" />
      </g>

      {/* 五张卡（盖在最上面，跟着 Molis 进来） */}
      {cards.map((card, i) => (
        <g key={i} className={card.track}>
          <g filter={`url(#${shadow})`}>
            <rect
              className="m-k-paper"
              x={card.x}
              y={card.y}
              width="60"
              height="48"
              rx="7"
            />
          </g>
          {glyphs[i](card.x, card.y)}
        </g>
      ))}
    </>
  );

  const overlay = (
    <>
      <Say
        id="train"
        who="we"
        order={order}
        at={[70, 354]}
        className={cut.track(rise(cue.say1))}
      />
      <Say
        id="train"
        who="you"
        order={order}
        at={[640, 340]}
        className={cut.track(rise(cue.say2))}
      />
      <Say
        id="train"
        who="both"
        order={order}
        at={[600, 58]}
        className={cut.track(rise(cue.say3))}
      />
      <Hand who="you" className={you} />
      <Hand who="we" className={we} />
    </>
  );

  return (
    <Reel
      id="train"
      cut={cut}
      camera={camera}
      order={order}
      art={art}
      overlay={overlay}
    />
  );
}

export function Film({ id }: { id: StationId }) {
  if (id === 'diagnose') return <Diagnose />;
  if (id === 'build') return <Build />;
  if (id === 'assess') return <Assess />;
  return <Train />;
}
