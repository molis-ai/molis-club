'use client';
import {
  Copy,
  Hash,
  ListChecks,
  MessageCircleQuestionMark,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { selectTry } from '../../../content/site/tool';

// Tool 页的标志性交互：在这一页任意选中一句话，动作条出现在光标旁（触屏与键盘选中时，出现在选区下方）。
// 「数一数」「复制纯文本」是真的在本机做；「解释」「整理成待办」需要 AI，这里只演示它们出现在哪里（示意）。
// Esc、点别处、滚走都会收起；键盘用户可以按「选中这句话」，动作条出现后焦点移进去。

type Action = 'count' | 'plain' | 'explain' | 'todo';

const actions: { id: Action; icon: typeof Hash; ai: boolean }[] = [
  { id: 'count', icon: Hash, ai: false },
  { id: 'plain', icon: Copy, ai: false },
  { id: 'explain', icon: MessageCircleQuestionMark, ai: true },
  { id: 'todo', icon: ListChecks, ai: true },
];

type Bar = { text: string; x: number; y: number; focus: boolean };

/** 用键盘按「选中这句话」时，动作条出现后把焦点移进去 */
let focusNext = false;

export function SelectionBar({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [state, setState] = useState<Bar | null>(null);
  const [result, setResult] = useState<string>('');

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let timer = 0;
    const read = () => {
      const selection = document.getSelection();
      const text = selection?.toString().replace(/\s+/g, ' ').trim() ?? '';
      if (
        !selection ||
        selection.rangeCount === 0 ||
        text.length < 2 ||
        !node.contains(selection.anchorNode) ||
        bar.current?.contains(selection.anchorNode ?? null)
      ) {
        if (!bar.current?.contains(document.activeElement)) setState(null);
        return;
      }
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const at = pointer.current;
      // 有鼠标：放在光标旁；触屏和键盘：放在选区下面，不挡住系统自己的菜单
      const x = at ? at.x + 14 : rect.left + rect.width / 2 - 140;
      const y = at ? at.y + 18 : rect.bottom + 12;
      setResult('');
      setState({ text: text.slice(0, 400), x, y, focus: focusNext });
      focusNext = false;
    };
    const onSelection = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 220);
    };
    const onPointerUp = (event: PointerEvent) => {
      pointer.current =
        event.pointerType === 'mouse'
          ? { x: event.clientX, y: event.clientY }
          : null;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setState(null);
      else if (event.key.startsWith('Arrow') || event.key === 'Shift')
        pointer.current = null;
    };
    const onScroll = () => {
      if (!bar.current?.contains(document.activeElement)) setState(null);
    };
    document.addEventListener('selectionchange', onSelection);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('selectionchange', onSelection);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // 键盘选中示例句时，动作条出现后把焦点移进去
  useEffect(() => {
    if (state?.focus) bar.current?.querySelector('button')?.focus();
  }, [state]);

  const run = async (action: Action) => {
    if (!state) return;
    const { results } = selectTry;
    if (action === 'count')
      setResult(
        results.count(Array.from(state.text.replace(/\s/g, '')).length),
      );
    else if (action === 'plain') {
      try {
        await navigator.clipboard.writeText(state.text);
        setResult(results.plain);
      } catch {
        setResult(results.plainFailed);
      }
    } else setResult(results[action]);
  };

  const place = (bar: Bar) => {
    const width = 320;
    const left = Math.max(12, Math.min(bar.x, window.innerWidth - width - 12));
    const top = Math.max(76, Math.min(bar.y, window.innerHeight - 140));
    return { left, top };
  };

  return (
    <div ref={root} className="tl-select-root">
      {children}
      {state ? (
        <div
          ref={bar}
          className="tl-select"
          role="toolbar"
          aria-label="对选中的文字可以做的事（示意）"
          style={place(state)}
        >
          <div className="tl-select-actions">
            {actions.map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => void run(item.id)}
              >
                <item.icon aria-hidden="true" />
                {selectTry.actions[item.id]}
                <small data-ai={item.ai || undefined}>
                  {item.ai ? selectTry.ai : selectTry.local}
                </small>
              </button>
            ))}
          </div>
          <div className="tl-select-foot">
            <output className="tl-select-result" aria-live="polite">
              {result}
            </output>
            <button
              type="button"
              className="tl-select-close"
              aria-label={selectTry.close}
              onClick={() => setState(null)}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** 示例句和「选中这句话」：给不方便拖选的人一个入口 */
export function SelectSample() {
  const sample = useRef<HTMLParagraphElement>(null);
  return (
    <div className="tl-try">
      <p className="tl-try-sample" ref={sample}>
        {selectTry.sample}
      </p>
      <button
        type="button"
        className="m-link"
        onClick={(event) => {
          // detail 为 0：用键盘按下的
          focusNext = event.detail === 0;
          const node = sample.current;
          const selection = document.getSelection();
          if (!node || !selection) return;
          const range = document.createRange();
          range.selectNodeContents(node);
          selection.removeAllRanges();
          selection.addRange(range);
        }}
      >
        选中这句话
      </button>
    </div>
  );
}
