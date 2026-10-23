'use client';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownToLine, ArrowUpRight, Check, Copy } from 'lucide-react';
import { communityUi, methodText } from '../../../content/site/community';
import { contactHref } from '../../_site/routes';

// 社区与方法页共用的「带走」动作：复制一段文字、下载一个文件；做完后一句话，顺手给一个分享入口
// （联系页按 topic 预选「社区分享」）。剪贴板不可用时把文字摊开并选中，让人手动复制。

/** 做完之后的一句话：结果已经到手，再给一个「也发给我们一份」 */
export function ShareAfter({ text, topic }: { text: string; topic: string }) {
  return (
    <span className="m-com-after">
      {text}
      <Link className="m-inline" href={contactHref(topic)}>
        {communityUi.share}
        <ArrowUpRight size={12} aria-hidden="true" />
      </Link>
    </span>
  );
}

type CopyState = 'idle' | 'copied' | 'manual';

export async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** 一个复制按钮（描边胶囊；solid 时是实心按钮），复制成功后带上分享入口；没有 JS 时不显示 */
export function CopyAction({
  text,
  id,
  label,
  topic,
  solid = false,
}: {
  text: string;
  id: string;
  label: string;
  topic?: string;
  solid?: boolean;
}) {
  // 记着复制的是哪段文字：文字换了（例如换了一个效果），提示自然回到初始
  const [result, setResult] = useState<{ text: string; state: CopyState }>({
    text: '',
    state: 'idle',
  });
  const state = result.text === text ? result.state : 'idle';
  const copy = async () => {
    const ok = await writeClipboard(text);
    setResult({ text, state: ok ? 'copied' : 'manual' });
  };
  return (
    <div className="m-com-copy m-com-js">
      <button
        type="button"
        className={solid ? 'm-btn' : 'm-link m-com-act'}
        onClick={copy}
        aria-describedby={`${id}-status`}
      >
        {state === 'copied' ? (
          <Check size={solid ? 15 : 14} aria-hidden="true" />
        ) : (
          <Copy size={solid ? 15 : 14} aria-hidden="true" />
        )}
        {label}
      </button>
      <output className="m-com-status" id={`${id}-status`}>
        {state === 'copied' ? (
          topic ? (
            <ShareAfter text={methodText.copyState.copied} topic={topic} />
          ) : (
            methodText.copyState.copied
          )
        ) : state === 'manual' ? (
          methodText.copyState.manual
        ) : null}
      </output>
      {state === 'manual' ? (
        <textarea
          className="m-com-manual"
          aria-label={`${label}：内容`}
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

/** 摊开的一段 Prompt：文字一直看得见（没有 JS 也能手动复制），按钮复制 */
export function CopyPrompt({
  id,
  label,
  text,
  button,
  topic,
}: {
  id: string;
  label: string;
  text: string;
  button: string;
  topic?: string;
}) {
  const [result, setResult] = useState<{ text: string; state: CopyState }>({
    text: '',
    state: 'idle',
  });
  const state = result.text === text ? result.state : 'idle';
  const field = useRef<HTMLTextAreaElement>(null);
  // 文字多长，框就多高：不在页面里再套一层滚动（DESIGN.md 常驻约束）。没有 JS 时靠样式里的 field-sizing
  useLayoutEffect(() => {
    const node = field.current;
    if (!node) return;
    const fit = () => {
      node.style.height = 'auto';
      node.style.height = `${node.scrollHeight}px`;
    };
    fit();
    void document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [text]);
  const copy = async () => {
    const ok = await writeClipboard(text);
    setResult({ text, state: ok ? 'copied' : 'manual' });
    if (!ok) {
      field.current?.focus();
      field.current?.select();
    }
  };
  return (
    <div className="m-mth-copy">
      <label className="m-kicker" htmlFor={id}>
        {label}
      </label>
      <textarea id={id} ref={field} readOnly value={text} />
      <div className="m-mth-copy-row m-com-js">
        <button type="button" className="m-btn" onClick={copy}>
          {state === 'copied' ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <Copy size={15} aria-hidden="true" />
          )}
          {button}
        </button>
        <output className="m-com-status" aria-live="polite">
          {state === 'copied' ? (
            topic ? (
              <ShareAfter text={methodText.copyState.copied} topic={topic} />
            ) : (
              methodText.copyState.copied
            )
          ) : state === 'manual' ? (
            methodText.copyState.manual
          ) : null}
        </output>
      </div>
    </div>
  );
}

/**
 * 下载一个 Skill 压缩包：就是一个普通的下载链接（没有 JS 也能下），
 * 点过之后在旁边说一句「已开始下载」，带上分享入口。
 */
export function SkillDownload({
  slug,
  kb,
  label,
  solid = false,
  topic = 'share-artist',
  children,
}: {
  slug: string;
  kb?: number;
  label: string;
  solid?: boolean;
  topic?: string;
  children?: ReactNode;
}) {
  const [done, setDone] = useState<string | null>(null);
  const href = `/downloads/artists/${slug}.zip`;
  return (
    <div className="m-com-download">
      <a
        className={solid ? 'm-btn' : 'm-link m-com-act'}
        href={href}
        download
        onClick={() => setDone(slug)}
      >
        <ArrowDownToLine size={solid ? 15 : 14} aria-hidden="true" />
        {label}
        {kb ? <small className="num">{` · zip ${kb} KB`}</small> : null}
      </a>
      {children}
      <output className="m-com-status">
        {done === slug ? (
          <ShareAfter text={methodText.copyState.downloaded} topic={topic} />
        ) : null}
      </output>
    </div>
  );
}
