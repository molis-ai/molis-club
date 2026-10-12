'use client';
import { useId } from 'react';

// D 的手绘零件：墙上的龟背竹影子，以及纸面屏幕上的两幅细线画。全部是 SVG。

/** 一片龟背竹叶：心形的叶面，边缘切开几道口子，靠近叶脉有几个洞 */
function leafPath(cx: number, cy: number, r: number) {
  return `M ${cx} ${cy - r * 0.15}
    C ${cx - r * 0.3} ${cy - r * 1.05} ${cx - r * 1.15} ${cy - r * 0.75} ${cx - r * 1.05} ${cy + r * 0.05}
    C ${cx - r * 0.95} ${cy + r * 0.75} ${cx - r * 0.3} ${cy + r * 1.05} ${cx} ${cy + r * 0.92}
    C ${cx + r * 0.3} ${cy + r * 1.05} ${cx + r * 0.95} ${cy + r * 0.75} ${cx + r * 1.05} ${cy + r * 0.05}
    C ${cx + r * 1.15} ${cy - r * 0.75} ${cx + r * 0.3} ${cy - r * 1.05} ${cx} ${cy - r * 0.15} Z`;
}

const leaves = [
  {
    x: 330,
    y: 230,
    r: 150,
    rot: -28,
    stem: 'M520 760 C 480 560 420 400 340 250',
  },
  {
    x: 190,
    y: 400,
    r: 120,
    rot: 32,
    stem: 'M520 760 C 430 600 300 500 200 410',
  },
  {
    x: 440,
    y: 470,
    r: 105,
    rot: -8,
    stem: 'M520 760 C 500 640 470 560 445 480',
  },
  {
    x: 120,
    y: 160,
    r: 82,
    rot: 50,
    stem: 'M520 760 C 400 520 230 300 125 170',
  },
];

export function MonsteraShadow({ className = '' }: { className?: string }) {
  const id = `wd${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      className={`wd-shadow ${className}`}
      viewBox="0 0 600 760"
      aria-hidden="true"
    >
      <defs>
        {leaves.map((leaf, index) => (
          <mask
            id={`${id}-cut-${index}`}
            key={index}
            maskUnits="userSpaceOnUse"
          >
            <rect x="-200" y="-200" width="1000" height="1200" fill="#fff" />
            <g
              transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
              stroke="#000"
              strokeLinecap="round"
            >
              {[-150, -122, -95, -62, 62, 95, 122, 150].map((deg) => {
                const a = ((deg - 90) * Math.PI) / 180;
                const x1 = leaf.x + Math.cos(a) * leaf.r * 1.2;
                const y1 = leaf.y + Math.sin(a) * leaf.r * 1.2;
                const x2 = leaf.x + Math.cos(a) * leaf.r * 0.42;
                const y2 = leaf.y + Math.sin(a) * leaf.r * 0.42;
                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={leaf.r * 0.11}
                  />
                );
              })}
              {[-0.35, 0.35].map((side) =>
                [0.1, 0.45].map((down) => (
                  <ellipse
                    key={`${side}-${down}`}
                    cx={leaf.x + side * leaf.r * 0.42}
                    cy={leaf.y + down * leaf.r}
                    rx={leaf.r * 0.07}
                    ry={leaf.r * 0.13}
                    fill="#000"
                    stroke="none"
                  />
                )),
              )}
            </g>
          </mask>
        ))}
      </defs>
      {leaves.map((leaf, index) => (
        <g key={index}>
          <path
            d={leaf.stem}
            fill="none"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d={leafPath(leaf.x, leaf.y, leaf.r)}
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
            mask={`url(#${id}-cut-${index})`}
            fill="currentColor"
          />
        </g>
      ))}
    </svg>
  );
}

/** Life：一张勾好的清单、一杯茶、一瓶花枝 */
export function LifeDrawing() {
  return (
    <svg className="wd-drawing" viewBox="0 0 480 320" aria-hidden="true">
      <g className="wd-ink">
        <path d="M58 70 L178 62 L190 262 L66 270 Z" />
        <path d="M84 104 l10 10 l20 -24 M128 104 L166 101" />
        <path d="M86 154 l10 10 l20 -24 M130 154 L168 151" />
        <path d="M88 204 l10 10 l20 -24 M132 204 L156 202" />
        <path d="M232 214 C 232 252 246 270 276 270 C 306 270 320 252 320 214 Z" />
        <path d="M320 226 C 344 222 346 252 318 252" />
        <path d="M214 272 C 250 284 304 284 340 272" />
        <path
          className="wd-steam"
          d="M262 196 C 252 182 272 172 262 156 M286 196 C 276 182 296 172 286 156"
        />
        <path d="M376 270 C 362 270 356 250 360 226 C 364 206 372 196 372 180 L392 180 C 392 196 400 206 404 226 C 408 250 402 270 388 270 Z" />
        <path d="M382 180 C 380 140 372 110 350 80 M381 150 C 400 128 420 116 438 112 M376 118 C 360 108 352 96 350 80" />
        <path
          className="wd-leaf"
          d="M350 80 C 338 70 336 58 344 50 C 354 58 356 70 350 80 Z"
        />
        <path
          className="wd-leaf"
          d="M438 112 C 446 100 458 98 466 104 C 458 114 446 116 438 112 Z"
        />
        <path
          className="wd-leaf"
          d="M398 132 C 400 118 410 112 420 114 C 418 126 408 132 398 132 Z"
        />
        <path
          className="wd-leaf"
          d="M366 104 C 354 98 350 86 354 78 C 364 82 368 94 366 104 Z"
        />
        <path d="M30 286 L 450 286" />
      </g>
    </svg>
  );
}

/** Story：一扇拱窗，窗外是海平线、远帆和月亮 */
export function StoryDrawing() {
  return (
    <svg className="wd-drawing" viewBox="0 0 480 320" aria-hidden="true">
      <g className="wd-ink">
        <path d="M150 286 L150 120 C 150 66 196 34 240 34 C 284 34 330 66 330 120 L330 286" />
        <path d="M168 286 L168 122 C 168 76 204 52 240 52 C 276 52 312 76 312 122 L312 286" />
        <path d="M240 52 L240 286 M168 170 L312 170" />
        <path d="M168 214 C 200 210 280 210 312 214" />
        <path d="M176 232 C 200 230 222 232 238 231 M246 240 C 266 238 286 240 304 239 M180 254 C 196 253 214 254 230 253" />
        <circle cx="276" cy="104" r="12" />
        <path d="M200 206 L200 184 L214 206 Z M196 206 C 200 210 212 210 216 206" />
        <path d="M120 286 L360 286 M110 300 L370 300" />
        <path d="M352 286 L352 270 L392 262 L392 278 Z" />
        <path d="M362 274 L384 270" />
      </g>
    </svg>
  );
}

export function SunMoon({ night }: { night: boolean }) {
  return night ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M13.5 13.8 A6.5 6.5 0 1 1 8 3.2 A5 5 0 0 0 13.5 13.8 Z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="4" fill="currentColor" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={10 + Math.cos(a) * 6.4}
            y1={10 + Math.sin(a) * 6.4}
            x2={10 + Math.cos(a) * 8.6}
            y2={10 + Math.sin(a) * 8.6}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/** World：一条小路从窗边（生活）走到一扇拱门（故事），中间一颗慢慢长大的小星球，上面一间屋 */
export function WorldDrawing() {
  return (
    <svg className="wd-drawing" viewBox="0 0 480 320" aria-hidden="true">
      <g className="wd-ink">
        <circle cx="240" cy="176" r="74" />
        <path d="M172 150 C 204 166 276 166 308 150 M168 190 C 204 206 276 206 312 190" />
        <path d="M218 104 L218 84 L240 68 L262 84 L262 104 M233 104 L233 92 L247 92 L247 104" />
        <path
          d="M282 112 L282 96 M282 96 C 272 96 270 82 280 80 C 282 72 294 74 292 82 C 302 84 300 96 290 96 Z"
          className="wd-leaf"
        />
        <path d="M60 286 L60 196 L118 196 L118 286 M60 236 L118 236 M89 196 L89 286" />
        <path d="M362 286 L362 222 C 362 196 382 182 400 182 C 418 182 438 196 438 222 L438 286" />
        <path
          d="M118 270 C 160 270 168 250 180 236 M362 270 C 320 270 312 250 300 236"
          className="wd-path-dash"
        />
        <path d="M40 286 L460 286" />
        <circle cx="400" cy="244" r="5" />
      </g>
    </svg>
  );
}
