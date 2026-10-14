'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { folioCommunity } from '../../../../../content/folio-community';
import { contactHref } from '../routes';
import './copy.css';

// 社区页的复制按钮，和下载、复制成功后的一句投稿提示。

/** 做完之后的一句话：结果已经到手，顺便给一个投稿入口（联系页预选「创造者」并预填开头） */
export function ShareAfter({ text, topic }: { text: string; topic: string }) {
  return (
    <span className="g-com-after">
      {text}
      <Link href={contactHref(topic)}>
        {folioCommunity.after.send}
        <ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </span>
  );
}

/** 复制一段提示词；剪贴板不可用时露出文本让人手动复制。复制成功后带上投稿提示 */
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
    <div className="g-com-copy">
      <button
        type="button"
        className="g-com-text-link"
        onClick={copy}
        aria-describedby={`${id}-status`}
      >
        {status === 'copied' ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
        {label}
      </button>
      <output className="g-com-copy-status" id={`${id}-status`}>
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
          aria-label={`${label}内容`}
          readOnly
          value={text}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  );
}
