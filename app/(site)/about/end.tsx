'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useMemo, useRef, useState, type SubmitEvent } from 'react';
import { aboutNext } from '../../../content/site/about';
import { saveDraft } from '../../_site/contact-draft';
import { useVisible } from '../../_site/motion';
import { CONTACT } from '../../_site/routes';
import { Phrases, type Vars } from '../../_site/ui';
import { Typewriter } from './typewriter';

// ⑧ 结尾「树下」（负责人 2026-10-24 选「回到树下」+「轮到你说」）：
// 整页从首屏的光开始，这里回到光里——纸白的墙上落着叶影，缓缓地晃，叶缝里漏下一块暖光。墙上不写比喻，让光自己说。
// 滚到这里，首屏那台打字机打出一句英文「Same taste? Stay a while.」（负责人 2026-10-24 选的，比 1.2 末句更轻、更像招呼；
// 更早的「树下，总有空位。」画不在了、没了出处，已去掉），打完换一行，光标停在空白处闪，提示语「Your turn.」：
// 那一行是真的输入框，写下的话按回车或点「聊一聊」带到联系页的留言框里（sessionStorage，不进地址栏），不在这里提交。
// 下面是另外三个去处：三张半透明的卡（负责人 2026-10-24：还是之前的透明卡片，字小一点），透出后面的叶影。叶影是画出来的（几枝带叶的枝条，模糊成影子），只动 transform；减少动态时不晃，右下角可以暂停。
// 没有 JS：字直接在，输入框不显示，「聊一聊」是普通链接。

/** 名字算出来的伪随机数（0–1），服务端和浏览器一致（同 spread.tsx） */
function rand(seed: string, salt: number) {
  let h = 2166136261 ^ salt;
  for (const char of seed) {
    h ^= char.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const LEAF = 'M0 0C8-9 26-10 38 0C26 10 8 9 0 0Z';

type Branch = { d: string; leaves: string[] };

/** 几枝从右上角斜着伸进来的枝条，叶子沿着枝条长，左右交替、各歪一点 */
function grow(count: number, seed: string): Branch[] {
  return Array.from({ length: count }, (_, b) => {
    const r = (salt: number) => rand(`${seed}-${b}`, salt);
    const x0 = 1000 - r(1) * 120;
    const y0 = -20 + r(2) * 260;
    const angle = Math.PI * (0.78 + r(3) * 0.2);
    const length = 380 + r(4) * 360;
    const bend = (r(5) - 0.5) * 160;
    const x1 = x0 + Math.cos(angle) * length;
    const y1 = y0 + Math.sin(angle) * length;
    const cx = (x0 + x1) / 2 + Math.sin(angle) * bend;
    const cy = (y0 + y1) / 2 - Math.cos(angle) * bend;
    const at = (t: number) => ({
      x: (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1,
      y: (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1,
    });
    const leaves = Array.from(
      { length: 16 + Math.floor(r(6) * 10) },
      (_, i) => {
        const t = 0.08 + (i / 26) * 0.92 + (r(10 + i) - 0.5) * 0.04;
        const p = at(Math.min(t, 1));
        const q = at(Math.min(t + 0.01, 1));
        const along = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        const side = i % 2 ? 1 : -1;
        const turn = along + side * (38 + r(40 + i) * 34);
        const size = 0.9 + r(70 + i) * 1.1;
        return `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${turn.toFixed(1)}) scale(${size.toFixed(2)})`;
      },
    );
    return {
      d: `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
      leaves,
    };
  });
}

const FAR = grow(4, 'far');
const NEAR = grow(3, 'near');

function Boughs({ branches }: { branches: Branch[] }) {
  return (
    <svg viewBox="0 0 1000 700" preserveAspectRatio="xMaxYMin slice">
      {branches.map((branch, b) => (
        <g key={b}>
          <path className="te-twig" d={branch.d} />
          {branch.leaves.map((transform, i) => (
            <path key={i} d={LEAF} transform={transform} />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function TreeEnd({
  line,
  others,
}: {
  /** 这一屏的标题 */
  line: string;
  /** 另外三个去处 */
  others: { label: string; en: string; line: string; href: string }[];
}) {
  const end = aboutNext.end;
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const seen = useVisible(box, 0.45);
  const [play, setPlay] = useState(false);
  const [typed, setTyped] = useState(false);
  const [still, setStill] = useState(false);
  // 第一次滚到这里才开始打，之后不再重打
  if (seen && !play) setPlay(true);
  const typing = useMemo(
    () => [
      {
        text: line,
        as: 'h2' as const,
        id: 'doors-title',
        className: 'te-title',
        lang: 'en',
        pace: 105,
      },
    ],
    [line],
  );

  const go = (event?: SubmitEvent<HTMLFormElement>) => {
    event?.preventDefault();
    saveDraft(field.current?.value.trim() ?? '');
    if (event) router.push(CONTACT);
  };

  return (
    <div className="te" ref={box} data-still={still || undefined}>
      <div className="te-light" aria-hidden="true">
        <div className="te-far">
          <Boughs branches={FAR} />
        </div>
        <div className="te-near">
          <Boughs branches={NEAR} />
        </div>
        <i className="te-fleck" />
      </div>

      <div className="te-body m-wrap">
        <Typewriter
          play={play}
          start={600}
          lines={typing}
          onDone={() => setTyped(true)}
        />
        <form
          className="te-say"
          action={CONTACT}
          data-on={typed || undefined}
          onSubmit={go}
        >
          <span className="te-field">
            <input
              ref={field}
              type="text"
              maxLength={1200}
              placeholder={end.say}
              aria-label={end.sayLabel}
              autoComplete="off"
              enterKeyHint="go"
            />
            <i className="te-caret" aria-hidden="true" />
          </span>
          <Link className="te-go" href={CONTACT} onClick={() => go()}>
            {aboutNext.doors.chat.label}
            <ArrowRight size={15} strokeWidth={1.6} aria-hidden />
          </Link>
        </form>
        <ul className="te-others">
          {others.map((door, index) => (
            <li
              key={door.href}
              data-reveal
              style={{ '--delay': `${300 + index * 90}ms` } as Vars}
            >
              <Link
                className="te-door"
                href={door.href}
                aria-label={door.label}
              >
                <span className="te-door-head">
                  {door.label}
                  <i lang="en">{door.en}</i>
                </span>
                <span className="te-door-line">
                  <Phrases text={door.line} />
                </span>
                <span className="te-door-go" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="m-pause te-pause"
        aria-pressed={still}
        aria-label={still ? end.play : end.pause}
        onClick={() => setStill(!still)}
      >
        {still ? (
          <Play size={11} fill="currentColor" aria-hidden="true" />
        ) : (
          <Pause size={11} fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
