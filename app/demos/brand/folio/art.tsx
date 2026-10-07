import type { Vars } from './shared';

// Folio 的剪纸插画：全部用 SVG 画，不用照片。每张纸片都是一个 .fo-cut，
// 首屏的纸片按 cut() 给的起点飞进来再轻轻摆动；色纸里的插画随滚动进度 --q 拼起来。

/** 纸片入场参数：顺序、视差深度、起点位移和旋转 */
export function cut(i: number, d: number, fx: number, fy: number, fr: number) {
  return {
    '--i': i,
    '--d': d,
    '--fx': `${fx}px`,
    '--fy': `${fy}px`,
    '--fr': `${fr}deg`,
  } as Vars;
}

export function Star({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z`}
    />
  );
}

/** 封面：拱门、太阳、叶子、问号与海浪 */
export function CoverArt() {
  return (
    <svg className="fo-cover-svg" viewBox="0 0 800 800" aria-hidden="true">
      <g className="fo-cut fo-blue" style={cut(0, 0.5, -80, 160, -8)}>
        <path d="M120 800V430a200 200 0 0 1 400 0v370Z" />
        <path
          className="fo-cut-line"
          d="M170 800V440a150 150 0 0 1 300 0v360"
        />
      </g>
      <g className="fo-cut fo-red" style={cut(1, 1, 120, -140, 14)}>
        <circle cx="560" cy="250" r="175" />
      </g>
      <g className="fo-cut fo-sage" style={cut(2, 1.6, -160, -40, -24)}>
        <path d="M30 340c90-150 270-170 350-100-70 110-240 170-350 100Z" />
        <path className="fo-cut-vein" d="M50 336c110-40 210-70 320-96" />
      </g>
      <g className="fo-cut fo-navy" style={cut(3, 0.7, 0, 180, 3)}>
        <path d="M-420 720c110-50 190 20 300-10s160-60 260-20 170 30 260-10 170-80 280-20 180 40 250-10 180-60 300-10v300H-420Z" />
      </g>
      <g className="fo-cut fo-yellow" style={cut(4, 2.2, 140, 120, 30)}>
        <path
          className="fo-mark-hook"
          d="M405 330c0-95 150-110 150-10 0 70-80 80-80 150v40"
        />
        <circle cx="475" cy="600" r="40" />
      </g>
      <g className="fo-cut fo-pink" style={cut(5, 2.8, 120, 40, 0)}>
        <circle cx="705" cy="545" r="58" />
      </g>
      <path
        className="fo-cover-line"
        d="M36 770c110-40 90-190 210-200s140 120 240 60 60-230 210-270"
        pathLength={1}
      />
      <g className="fo-cut fo-stars" style={cut(6, 3.4, 0, -60, 40)}>
        <Star x={710} y={90} r={26} />
        <Star x={300} y={140} r={16} />
        <Star x={90} y={560} r={20} />
      </g>
    </svg>
  );
}

/** Work：同一张目标纸，在两扇门（两个 AI）之间被一根线接着传下去，最后盖上完成的章 */
export function WorkArt() {
  return (
    <svg className="fo-cover-svg" viewBox="0 0 700 640" aria-hidden="true">
      <g className="fo-cut fo-blue" style={cut(0, 0.6, -90, 160, -8)}>
        <path d="M40 640V350a150 150 0 0 1 300 0v290Z" />
        <path className="fo-cut-line" d="M80 640V356a110 110 0 0 1 220 0v284" />
      </g>
      <g className="fo-cut fo-navy" style={cut(1, 0.9, 110, 180, 10)}>
        <path d="M400 640V420a130 130 0 0 1 260 0v220Z" />
      </g>
      <g className="fo-cut fo-red" style={cut(2, 1.2, 120, -140, 14)}>
        <circle cx="560" cy="150" r="104" />
      </g>
      <path
        className="fo-cover-line"
        d="M110 300C170 170 300 130 360 250S560 330 540 420"
        pathLength={1}
      />
      <g className="fo-cut fo-paper-white" style={cut(3, 1.8, -40, -120, -16)}>
        <rect x="210" y="190" width="230" height="270" rx="18" />
        <rect className="fo-ink-line" x="244" y="232" width="120" height="14" />
        <rect
          className="fo-soft-line"
          x="244"
          y="272"
          width="160"
          height="10"
        />
        <rect
          className="fo-soft-line"
          x="244"
          y="300"
          width="140"
          height="10"
        />
        <rect
          className="fo-soft-line"
          x="244"
          y="328"
          width="150"
          height="10"
        />
        <rect className="fo-soft-line" x="244" y="356" width="96" height="10" />
      </g>
      <g className="fo-cut fo-yellow" style={cut(4, 2.6, 140, 120, 40)}>
        <circle cx="420" cy="440" r="62" />
        <path className="fo-check" d="M392 440l20 20 36-40" />
      </g>
      <g className="fo-cut fo-stars" style={cut(5, 3.2, 0, -60, 40)}>
        <Star x={640} y={330} r={22} />
        <Star x={170} y={110} r={16} />
        <Star x={70} y={250} r={11} />
      </g>
    </svg>
  );
}

/** 四张纸条（包裹、海浪、叶子、书）从四处飞来叠好，旁边亮出一张打了勾的深色卡 */
const lifeSlips = [
  { x: 70, y: 170, r: -6, sx: 40, sy: -150, sr: -18, tone: 'fo-paper-white' },
  { x: 90, y: 262, r: 3, sx: 300, sy: -90, sr: 14, tone: 'fo-paper-pink' },
  { x: 60, y: 354, r: -3, sx: 230, sy: 110, sr: -10, tone: 'fo-paper-sage' },
  { x: 84, y: 446, r: 4, sx: -20, sy: 160, sr: 20, tone: 'fo-paper-white' },
];

function LifeIcon({ index }: { index: number }) {
  if (index === 0)
    return (
      <g className="fo-icon-red">
        <rect x="22" y="20" width="44" height="40" rx="6" />
        <path className="fo-icon-tape" d="M44 20v40M22 36h44" />
      </g>
    );
  if (index === 1)
    return (
      <path
        className="fo-icon-wave"
        d="M18 46c8-10 16-10 24 0s16 10 24 0 16-10 24 0"
      />
    );
  if (index === 2)
    return (
      <g className="fo-icon-navy">
        <path d="M24 60c4-26 22-40 46-42-2 26-20 42-46 42Z" />
      </g>
    );
  return (
    <g className="fo-icon-blue">
      <path d="M20 24h22a6 6 0 0 1 6 6v32a6 6 0 0 0-6-6H20Z" />
      <path d="M76 24H54a6 6 0 0 0-6 6v32a6 6 0 0 1 6-6h22Z" />
    </g>
  );
}

export function LifeArt({ note }: { note?: string }) {
  return (
    <figure className="fo-art fo-art-life">
      <svg viewBox="0 0 600 600" aria-hidden="true">
        <circle className="fo-life-sun" cx="380" cy="230" r="170" />
        <path
          className="fo-life-hill"
          d="M0 560c90-70 200-90 300-50s210 30 300-30v120H0Z"
        />
        {lifeSlips.map((slip, index) => (
          <g
            key={index}
            className="fo-life-slip"
            style={
              {
                '--i': index,
                '--sx': `${slip.sx}px`,
                '--sy': `${slip.sy}px`,
                '--sr': `${slip.sr}deg`,
                '--r': `${slip.r}deg`,
              } as Vars
            }
          >
            <g transform={`translate(${slip.x} ${slip.y})`}>
              <rect className={slip.tone} width="280" height="80" rx="14" />
              <LifeIcon index={index} />
              <rect
                className="fo-soft-line"
                x="110"
                y="26"
                width="120"
                height="10"
              />
              <rect
                className="fo-soft-line"
                x="110"
                y="46"
                width="80"
                height="10"
              />
            </g>
          </g>
        ))}
        <g className="fo-life-next">
          <rect x="370" y="380" width="170" height="130" rx="22" />
          <path className="fo-check fo-check-yellow" d="M420 446l26 26 48-54" />
        </g>
        <g className="fo-life-stars">
          <Star x={540} y={70} r={20} />
          <Star x={250} y={90} r={12} />
        </g>
      </svg>
      {note ? <figcaption>{note}</figcaption> : null}
    </figure>
  );
}

/** Tool：一页纸上划出一句，光标停在句尾，旁边弹出三枚纸签，再贴上一张带出处的小卡 */
export function ToolArt({ note }: { note?: string }) {
  return (
    <figure className="fo-art fo-art-tool">
      <svg viewBox="0 0 600 600" aria-hidden="true">
        <circle className="fo-tool-moon" cx="470" cy="150" r="110" />
        <g className="fo-tool-page">
          <rect x="60" y="120" width="400" height="380" rx="22" />
          <rect
            className="fo-ink-line"
            x="100"
            y="164"
            width="190"
            height="16"
          />
          <rect
            className="fo-soft-line"
            x="100"
            y="214"
            width="320"
            height="11"
          />
          <rect
            className="fo-tool-mark"
            x="96"
            y="241"
            width="300"
            height="24"
          />
          <rect
            className="fo-soft-line"
            x="100"
            y="248"
            width="290"
            height="11"
          />
          <rect
            className="fo-soft-line"
            x="100"
            y="282"
            width="250"
            height="11"
          />
          <rect
            className="fo-soft-line"
            x="100"
            y="408"
            width="300"
            height="11"
          />
          <rect
            className="fo-soft-line"
            x="100"
            y="436"
            width="220"
            height="11"
          />
        </g>
        <g className="fo-tool-chips">
          <rect
            className="fo-tool-chip"
            x="210"
            y="300"
            width="70"
            height="36"
            rx="18"
          />
          <rect
            className="fo-tool-chip"
            x="290"
            y="300"
            width="70"
            height="36"
            rx="18"
          />
          <rect
            className="fo-tool-chip"
            x="370"
            y="300"
            width="70"
            height="36"
            rx="18"
          />
        </g>
        <g className="fo-tool-card">
          <rect x="300" y="360" width="250" height="150" rx="18" />
          <rect
            className="fo-ink-line"
            x="328"
            y="390"
            width="120"
            height="12"
          />
          <rect
            className="fo-soft-line"
            x="328"
            y="420"
            width="190"
            height="10"
          />
          <rect
            className="fo-soft-line"
            x="328"
            y="442"
            width="160"
            height="10"
          />
          <rect
            className="fo-tool-source"
            x="328"
            y="474"
            width="80"
            height="12"
            rx="6"
          />
        </g>
        <path
          className="fo-tool-cursor"
          d="M396 252l0 76 18-18 14 32 16-7-14-31 26-2Z"
        />
        <g className="fo-tool-stars">
          <Star x={90} y={70} r={18} />
          <Star x={560} y={330} r={12} />
          <Star x={40} y={540} r={14} />
        </g>
      </svg>
      {note ? <figcaption>{note}</figcaption> : null}
    </figure>
  );
}

/** Story：一扇门打开，门后是另一个世界，一个人正走进去 */
export function StoryArt({ note }: { note?: string }) {
  return (
    <figure className="fo-art fo-art-story">
      <svg viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <clipPath id="fo-door-clip">
            <path d="M190 560V290a110 110 0 0 1 220 0v270Z" />
          </clipPath>
        </defs>
        <g className="fo-story-stars">
          <Star x={90} y={110} r={18} />
          <Star x={500} y={70} r={26} />
          <Star x={540} y={260} r={12} />
          <Star x={60} y={330} r={10} />
        </g>
        <circle className="fo-story-moon" cx="470" cy="160" r="54" />
        <path
          className="fo-story-frame"
          d="M160 560V290a140 140 0 0 1 280 0v270Z"
        />
        <g clipPath="url(#fo-door-clip)">
          <rect
            className="fo-story-world"
            x="190"
            y="170"
            width="220"
            height="400"
          />
          <circle className="fo-story-world-sun" cx="300" cy="360" r="58" />
          <path
            className="fo-story-world-hill"
            d="M180 470c60-40 110-40 150-10s80 20 90 10v110H180Z"
          />
          <rect
            className="fo-story-door"
            x="190"
            y="170"
            width="220"
            height="400"
          />
        </g>
        <path className="fo-story-floor" d="M0 560h600v40H0Z" />
        <path className="fo-story-path" d="M300 560 220 600h160Z" />
        <g className="fo-story-walker">
          <circle cx="300" cy="455" r="15" />
          <path d="M282 540v-50a18 18 0 0 1 36 0v50Z" />
        </g>
      </svg>
      {note ? <figcaption>{note}</figcaption> : null}
    </figure>
  );
}

/** 截图背后的几片剪纸：拱门、太阳和星，随滚动错开一点 */
export function Cuts() {
  return (
    <span className="fo-cuts" aria-hidden="true">
      <svg className="fo-cuts-arch" viewBox="0 0 380 520">
        <path d="M0 520V190a190 190 0 0 1 380 0v330Z" />
      </svg>
      <svg className="fo-cuts-sun" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="100" />
      </svg>
      <svg className="fo-cuts-star" viewBox="0 0 200 200">
        <path d="M100 0l30 70 70 8-54 46 16 70-62-38-62 38 16-70L0 78l70-8Z" />
      </svg>
    </span>
  );
}
