'use client';
import { useState, type ReactNode } from 'react';
import { ArrowDownToLine, ArrowUpRight, Copy } from 'lucide-react';
import { methodText } from '../../../content/site/community';
import { ShareAfter, writeClipboard } from './copy';

// 「带走」做成一张可以撕下的票根（比稿 E1 的票根）：左边写带走什么，右边是存根。
// 点了存根沿虚线撕下、落下去，旁边说一句结果，顺手给一个「也发给我们一份」。
// 下载与外链就是普通的链接（没有 JS 也能用）；复制需要 JS，没有 JS 时不显示。

type Common = {
  title: string;
  meta?: string;
  no?: string;
  topic?: string;
};

function Face({
  title,
  meta,
  no,
  icon,
}: Common & { icon: ReactNode }) {
  return (
    <>
      <span className="m-com-ticket-main">
        <b>{title}</b>
        {meta ? <small>{meta}</small> : null}
      </span>
      <span className="m-com-ticket-stub" aria-hidden="true">
        {icon}
        {no ? <i lang="en">{no}</i> : null}
      </span>
    </>
  );
}

/** 下载或外链的票根 */
export function TicketLink({
  href,
  download = false,
  external = false,
  done,
  ...face
}: Common & {
  href: string;
  download?: boolean;
  external?: boolean;
  /** 点过之后说的一句（下载时） */
  done?: string;
}) {
  const [torn, setTorn] = useState(0);
  return (
    <div className="m-com-ticket-wrap">
      <a
        key={torn}
        className="m-com-ticket"
        data-torn={torn || undefined}
        href={href}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        onClick={() => setTorn((n) => n + 1)}
      >
        <Face
          {...face}
          icon={
            external ? (
              <ArrowUpRight size={18} />
            ) : (
              <ArrowDownToLine size={18} />
            )
          }
        />
      </a>
      <output className="m-com-status">
        {torn && done ? (
          face.topic ? (
            <ShareAfter text={done} topic={face.topic} />
          ) : (
            done
          )
        ) : null}
      </output>
    </div>
  );
}

/** 复制一段文字的票根 */
export function TicketCopy({ text, ...face }: Common & { text: string }) {
  const [state, setState] = useState<{
    text: string;
    ok: boolean;
    n: number;
  } | null>(null);
  const current = state?.text === text ? state : null;
  return (
    <div className="m-com-ticket-wrap m-com-js">
      <button
        key={current?.n ?? 0}
        type="button"
        className="m-com-ticket"
        data-torn={current?.ok || undefined}
        onClick={async () => {
          const ok = await writeClipboard(text);
          setState({ text, ok, n: (state?.n ?? 0) + 1 });
        }}
      >
        <Face {...face} icon={<Copy size={17} />} />
      </button>
      <output className="m-com-status">
        {current ? (
          current.ok ? (
            face.topic ? (
              <ShareAfter
                text={methodText.copyState.copied}
                topic={face.topic}
              />
            ) : (
              methodText.copyState.copied
            )
          ) : (
            methodText.copyState.manual
          )
        ) : null}
      </output>
      {current && !current.ok ? (
        <textarea
          className="m-com-manual"
          aria-label={`${face.title}：内容`}
          readOnly
          value={text}
          // oxlint-disable-next-line jsx-a11y/no-autofocus -- 复制失败时把焦点交给要手动复制的文字
          autoFocus
          onFocus={(event) => event.currentTarget.select()}
        />
      ) : null}
    </div>
  );
}
