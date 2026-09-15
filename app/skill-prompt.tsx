'use client';
import { useRef, useState } from 'react';
import { Copy } from 'lucide-react';
export function SkillPrompt({ prompt }: { prompt: string }) {
  const [status, setStatus] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus('已复制，可以粘贴到本地工具。');
    } catch {
      setStatus('复制未成功，文本已选中。请按 ⌘C / Ctrl+C 复制。');
      field.current?.focus();
      field.current?.select();
    }
  }
  return (
    <div className="skill-prompt">
      <label htmlFor="skill-prompt">从这个调用示例开始</label>
      <textarea id="skill-prompt" ref={field} value={prompt} readOnly />
      <button type="button" className="edition-button" onClick={copy}>
        <Copy size={16} />
        复制调用示例
      </button>
      <output aria-live="polite">{status}</output>
    </div>
  );
}
