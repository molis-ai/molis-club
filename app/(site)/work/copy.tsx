'use client';
import { useState } from 'react';
import { workStatus } from '../../../content/site/work';

/** 复制一段命令或一句话；复制不了时请人手动选中 */
export function Copy({ text }: { text: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle');
  return (
    <button
      type="button"
      className="wp-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState('done');
        } catch {
          setState('failed');
        }
        window.setTimeout(() => setState('idle'), 1800);
      }}
    >
      {workStatus.start.copy[state]}
    </button>
  );
}
