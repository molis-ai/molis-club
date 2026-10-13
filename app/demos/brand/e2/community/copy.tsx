'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { folioWiki } from '../../../../../content/folio';
import { folioCommunity } from '../../../../../content/folio-community';
import { contactHref } from '../routes';
import './kit.css';

// 社区页与方法详情共用的复制与投稿提示：功能与 Folio 社区一致（复制失败时露出或选中文本），样式换成 E2。

/** 做完之后的一句话：结果已经到手，顺便给一个投稿入口（联系页预选「创造者」并预填开头） */
export function ShareAfter({ text, topic }: { text: string; topic: string }) {
  return (
    <span className="ecm-after">
      {text}
      <Link href={contactHref(topic)}>
        {folioCommunity.after.send}
        <ArrowUpRight size={13} aria-hidden="true" />
      </Link>
    </span>
  );
}

/** 卡片上的「复制 Prompt」：剪贴板不可用时露出文本让人手动复制；复制成功后带上投稿提示 */
export function CopyAction({
  text,
  id,
  label,
  topic,
}: {
  text: string;
  id: string;
  label: string;
  /** 给了就在复制成功后提示「也发给我们一份」 */
  topic?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('manual');
    }
  };
  return (
    <div className="ecm-copy" data-status={status}>
      <button
        type="button"
        className="ecm-textbutton"
        onClick={copy}
        aria-describedby={`${id}-status`}
      >
        {status === 'copied' ? (
          <Check size={15} aria-hidden="true" />
        ) : (
          <Copy size={15} aria-hidden="true" />
        )}
        {label}
      </button>
      <output className="ecm-status" id={`${id}-status`}>
        {status === 'copied' ? (
          topic ? (
            <ShareAfter text={folioCommunity.after.copied} topic={topic} />
          ) : (
            folioCommunity.after.copied
          )
        ) : status === 'manual' ? (
          '请选中下方文字，手动复制。'
        ) : (
          ''
        )}
      </output>
      {status === 'manual' && (
        <textarea
          className="ecm-manual"
          aria-label={`${label}内容`}
          readOnly
          value={text}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  );
}

/** 详情页的 Prompt：文本常驻在框里，复制失败时选中文本，提示手动复制 */
export function CopyPrompt({
  id,
  label,
  text,
  button,
}: {
  id: string;
  label: string;
  text: string;
  button: string;
}) {
  // 复制结果记着当时的文本；文本变了（例如调了动效时长），提示自然回到初始
  const [result, setResult] = useState<{
    text: string;
    state: 'done' | 'failed';
  } | null>(null);
  const state = result?.text === text ? result.state : 'idle';
  const field = useRef<HTMLTextAreaElement>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ text, state: 'done' });
    } catch {
      setResult({ text, state: 'failed' });
      field.current?.focus();
      field.current?.select();
    }
  };
  return (
    <div className="ecm-prompt-copy">
      <label htmlFor={id}>
        <span>{label}</span>
        <i aria-hidden="true">Prompt</i>
      </label>
      <textarea id={id} ref={field} readOnly value={text} />
      <div className="ecm-prompt-actions">
        <button
          type="button"
          className="e2-button e2-button-ink"
          onClick={copy}
        >
          {state === 'done' ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <Copy size={15} aria-hidden="true" />
          )}
          {state === 'done' ? folioWiki.copy.copied : button}
        </button>
        <output aria-live="polite" data-state={state}>
          {folioWiki.copy[state]}
        </output>
      </div>
    </div>
  );
}
