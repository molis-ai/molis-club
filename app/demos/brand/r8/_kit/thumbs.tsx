import type { FolioProductId } from '../../../../../content/folio';

// 产品列表第一列的缩略图：一眼看出这件产品大概在做什么。都用 SVG 画，颜色读方向的 CSS 变量。
// Work、Tool、Life 沿用卡牌导览里的三幅（工作台窗口、选中一句话弹出动作、海边小画与便笺）；
// Story、World 重画：Story 是一扇拱窗，窗里是一个夜晚的世界，窗边冒出一个回应的气泡；
// World 是一座浮在空中的小岛，岛上有现实里的房子、故事里的塔，中间一棵正在长大的树。
// 行被选中时（.is-active）缩略图会动一下，动作写在 kit.css 里。

function Work() {
  return (
    <svg viewBox="0 0 120 84" className="r8-th r8-th-work" aria-hidden="true">
      <rect
        className="r8-th-glow"
        x="18"
        y="10"
        width="84"
        height="60"
        rx="10"
      />
      <rect className="r8-th-win" x="22" y="14" width="76" height="52" rx="5" />
      <rect
        className="r8-th-side"
        x="24"
        y="16"
        width="16"
        height="48"
        rx="3"
      />
      <rect
        className="r8-th-accent"
        x="28"
        y="25"
        width="8"
        height="2.6"
        rx="1.3"
      />
      <rect className="r8-th-faint" x="28" y="32" width="6" height="2" rx="1" />
      <rect className="r8-th-faint" x="28" y="38" width="7" height="2" rx="1" />
      <g className="r8-th-type">
        <rect
          className="r8-th-ink"
          x="46"
          y="24"
          width="34"
          height="3.4"
          rx="1.7"
        />
        <rect
          className="r8-th-faint"
          x="46"
          y="32"
          width="28"
          height="2.4"
          rx="1.2"
        />
        <rect
          className="r8-th-faint"
          x="46"
          y="38"
          width="31"
          height="2.4"
          rx="1.2"
        />
      </g>
      <g className="r8-th-pop">
        <rect
          className="r8-th-card"
          x="58"
          y="44"
          width="36"
          height="18"
          rx="3.5"
        />
        <rect
          className="r8-th-faint"
          x="63"
          y="49.5"
          width="24"
          height="2"
          rx="1"
        />
        <rect
          className="r8-th-ink"
          x="63"
          y="55"
          width="11"
          height="3.4"
          rx="1.7"
        />
        <rect
          className="r8-th-faint"
          x="77"
          y="55.6"
          width="8"
          height="2.2"
          rx="1.1"
        />
      </g>
    </svg>
  );
}

function Tool() {
  return (
    <svg viewBox="0 0 120 84" className="r8-th r8-th-tool" aria-hidden="true">
      <rect
        className="r8-th-mark"
        x="42"
        y="19"
        width="52"
        height="14"
        rx="3"
      />
      <rect
        className="r8-th-ink"
        x="18"
        y="23.5"
        width="74"
        height="5"
        rx="2.5"
      />
      <rect
        className="r8-th-ink"
        x="18"
        y="35.5"
        width="48"
        height="5"
        rx="2.5"
      />
      <g className="r8-th-bar">
        <rect
          className="r8-th-ink"
          x="58"
          y="50"
          width="44"
          height="15"
          rx="7"
        />
        <rect
          className="r8-th-accent"
          x="62.5"
          y="54"
          width="11"
          height="7"
          rx="2"
        />
        <rect
          className="r8-th-light"
          x="77"
          y="56.5"
          width="8"
          height="2"
          rx="1"
        />
        <rect
          className="r8-th-light"
          x="89"
          y="56.5"
          width="8"
          height="2"
          rx="1"
        />
      </g>
      <path
        className="r8-th-cursor"
        d="M52.5 43.5v13.2l3.2-2.9 2.3 5 2.2-1-2.3-4.9 4.3-.3z"
      />
    </svg>
  );
}

function Life() {
  return (
    <svg viewBox="0 0 120 84" className="r8-th r8-th-life" aria-hidden="true">
      <defs>
        <linearGradient id="r8-th-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c6d3e0" />
          <stop offset="0.5" stopColor="#ecd9c9" />
          <stop offset="0.5" stopColor="#93abc1" />
          <stop offset="0.72" stopColor="#a9bccb" />
          <stop offset="0.72" stopColor="#efe0cb" />
          <stop offset="1" stopColor="#e6d3b8" />
        </linearGradient>
      </defs>
      <g className="r8-th-photo">
        <rect
          className="r8-th-paper"
          x="12"
          y="18"
          width="52"
          height="44"
          rx="1.5"
        />
        <rect x="15.5" y="21.5" width="45" height="37" fill="url(#r8-th-sea)" />
        <circle className="r8-th-sun" cx="49" cy="36" r="3.6" />
        <g className="r8-th-clouds">
          <ellipse cx="27" cy="30" rx="9" ry="4" />
          <ellipse cx="44" cy="27" rx="11" ry="4.6" />
          <ellipse cx="52" cy="33" rx="7" ry="3.2" />
        </g>
      </g>
      <g className="r8-th-note">
        <rect
          className="r8-th-paper"
          x="72"
          y="16"
          width="34"
          height="46"
          rx="1.5"
        />
        <rect
          className="r8-th-faint"
          x="77"
          y="28"
          width="24"
          height="1.8"
          rx=".9"
        />
        <rect
          className="r8-th-faint"
          x="77"
          y="35"
          width="20"
          height="1.8"
          rx=".9"
        />
        <rect
          className="r8-th-faint"
          x="77"
          y="42"
          width="23"
          height="1.8"
          rx=".9"
        />
        <rect
          className="r8-th-faint"
          x="77"
          y="49"
          width="15"
          height="1.8"
          rx=".9"
        />
        <circle className="r8-th-accent" cx="89" cy="17.5" r="3.2" />
      </g>
    </svg>
  );
}

function Story() {
  return (
    <svg viewBox="0 0 120 84" className="r8-th r8-th-story" aria-hidden="true">
      <defs>
        <linearGradient id="r8-th-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c4677" />
          <stop offset="0.62" stopColor="#6b77ab" />
          <stop offset="0.62" stopColor="#2f3762" />
          <stop offset="1" stopColor="#262c4f" />
        </linearGradient>
        <clipPath id="r8-th-arch">
          <path d="M42 72V36a18 18 0 0 1 36 0v36z" />
        </clipPath>
      </defs>
      {/* 两边的窗暗着，是别的世界 */}
      <path className="r8-th-side-win" d="M15 72V48a8 8 0 0 1 16 0v24z" />
      <path
        className="r8-th-side-win r8-th-dusk"
        d="M89 72V48a8 8 0 0 1 16 0v24z"
      />
      {/* 中间这扇窗里是一个夜晚的世界：月亮、海面、一盏灯 */}
      <g clipPath="url(#r8-th-arch)">
        <rect x="42" y="18" width="36" height="54" fill="url(#r8-th-night)" />
        <circle cx="66" cy="32" r="4.2" fill="#f5e6c4" />
        <circle cx="51" cy="28" r=".9" fill="#fff" opacity=".8" />
        <circle cx="57" cy="23" r=".7" fill="#fff" opacity=".7" />
        <circle cx="72" cy="44" r=".7" fill="#fff" opacity=".6" />
        <rect
          x="42"
          y="56.6"
          width="36"
          height="1.2"
          fill="#f5d7a4"
          opacity=".55"
        />
        <circle className="r8-th-lamp" cx="53" cy="60" r="1.9" />
      </g>
      <path className="r8-th-frame" d="M42 72V36a18 18 0 0 1 36 0v36" />
      <rect
        className="r8-th-sill"
        x="38"
        y="71"
        width="44"
        height="3"
        rx="1.5"
      />
      {/* 回应：窗边冒出一个小气泡 */}
      <g className="r8-th-bubble">
        <path
          className="r8-th-card"
          d="M80 12h20a7 7 0 0 1 0 14H88l-5 4 1-4h-4a7 7 0 0 1 0-14z"
        />
        <circle className="r8-th-dot" cx="84.5" cy="19" r="1.5" />
        <circle className="r8-th-dot" cx="90" cy="19" r="1.5" />
        <circle className="r8-th-dot" cx="95.5" cy="19" r="1.5" />
      </g>
    </svg>
  );
}

function World() {
  return (
    <svg viewBox="0 0 120 84" className="r8-th r8-th-world" aria-hidden="true">
      {/* 一座浮着的小岛：上面是草地，下面是土 */}
      <ellipse className="r8-th-shadow" cx="60" cy="78" rx="20" ry="2.4" />
      <path className="r8-th-soil" d="M22 52c4 14 22 22 38 22s34-8 38-22z" />
      <ellipse className="r8-th-grass" cx="60" cy="52" rx="38" ry="9.5" />
      {/* 现实里的房子 */}
      <g className="r8-th-grow" style={{ '--k': 0 } as React.CSSProperties}>
        <rect
          className="r8-th-paper r8-th-line"
          x="32"
          y="40"
          width="15"
          height="12"
        />
        <path className="r8-th-roof" d="M30 41l9.5-8 9.5 8z" />
        <rect className="r8-th-ink" x="38" y="45" width="3.4" height="7" />
      </g>
      {/* 中间一棵正在长大的树 */}
      <g className="r8-th-grow" style={{ '--k': 1 } as React.CSSProperties}>
        <rect className="r8-th-trunk" x="58.8" y="40" width="2.4" height="12" />
        <circle className="r8-th-leaf" cx="60" cy="36" r="7" />
        <circle className="r8-th-leaf r8-th-leaf-2" cx="64" cy="39" r="4.6" />
      </g>
      {/* 故事里的塔，顶上一面小旗 */}
      <g className="r8-th-grow" style={{ '--k': 2 } as React.CSSProperties}>
        <rect className="r8-th-tower" x="74" y="30" width="9" height="22" />
        <path className="r8-th-tower" d="M73 31l5.5-6 5.5 6z" />
        <line className="r8-th-pole" x1="78.5" y1="25" x2="78.5" y2="15" />
        <path className="r8-th-flag" d="M78.5 15l8 2.6-8 2.6z" />
      </g>
      <path className="r8-th-route" d="M41 55q9 4 19-1t21 1" />
    </svg>
  );
}

const thumbs: Record<FolioProductId, () => React.JSX.Element> = {
  work: Work,
  tool: Tool,
  life: Life,
  story: Story,
  world: World,
};

export function Thumb({ id }: { id: FolioProductId }) {
  const Art = thumbs[id];
  return <Art />;
}
