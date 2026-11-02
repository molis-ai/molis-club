'use client';
import {
  CalendarDays,
  Copy,
  Eraser,
  Hash,
  Languages,
  Table2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { selectTry } from '../../../content/site/tool';
import { remember } from './memory';
import { Ico } from './parts';

// Tool 页的标志性交互：在这一页任意选中一段字，动作条出现在光标旁（触屏与键盘选中时，出现在选区下方）。
// 选的东西不同，第一个动作不同：带日期时间的先给「整理成日程」，英文先给「翻译」，一串数字先给「整理成表格」。
// 「清理格式」「数一数」「复制纯文本」「整理成表格」是真的在浏览器里做；「整理成日程」「翻译」要 AI，只演示会出现在哪里（示意）。
// 做过的事记进内存（memory.ts），屏幕里「接续」面板的最上面一行会读到。Esc、点别处、滚走都会收起。

type Action = keyof typeof selectTry.actions;
type Result = { text: string; rows?: [string, string][] };

const icons: Record<Action, typeof Hash> = {
  calendar: CalendarDays,
  translate: Languages,
  table: Table2,
  clean: Eraser,
  count: Hash,
  plain: Copy,
};
const ai: Partial<Record<Action, true>> = { calendar: true, translate: true };

const DATE =
  /\d{1,2}\s*月\s*\d{1,2}\s*日(?:\s*[（(][^）)]{1,4}[）)])?(?:\s*\d{1,2}[:：]\d{2}(?:\s*[—–-]+\s*\d{1,2}[:：]\d{2})?)?|\d{1,2}[:：]\d{2}(?:\s*[—–-]+\s*\d{1,2}[:：]\d{2})?|周[一二三四五六日天]\s*(?:上午|下午|晚上)?\s*[一二三四五六七八九十两\d]+点/;
const NUMBER = /\d+(?:\.\d+)?/g;

/** 按选中的内容排出动作：第一个随内容变，后面三个是本机的通用动作 */
function plan(text: string): Action[] {
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  const cjk = (text.match(/[㐀-鿿]/g) ?? []).length;
  const numbers = (text.match(NUMBER) ?? []).length;
  let first: Action | null = null;
  if (DATE.test(text)) first = 'calendar';
  else if (latin >= 8 && latin > cjk * 2) first = 'translate';
  else if (numbers >= 3) first = 'table';
  const rest: Action[] = ['clean', 'count', 'plain'];
  return first ? [first, ...rest] : rest;
}

/** 清理格式：并掉多余空白，去掉中文与标点两边的空格，句末补一个句号 */
export function cleanText(text: string) {
  let out = text
    .replace(/\s+/g, ' ')
    .replace(/\s*([，。、；：！？（）—])\s*/g, '$1')
    .replace(/([㐀-鿿])\s+(?=[㐀-鿿])/g, '$1')
    .trim();
  if (/[㐀-鿿]$/.test(out)) out += '。';
  return out;
}

/** 整理成表格：按逗号、分号切开，每段一个名字一个数 */
function toRows(text: string): [string, string][] {
  return text
    .split(/[，,；;、\n]/)
    .map((part) => {
      const value = part.match(NUMBER)?.[0];
      if (!value) return null;
      const name = part
        .replace(/^[^：:]*[：:]/, '')
        .replace(NUMBER, '')
        .replace(/[元个件份次%％]/g, '')
        .trim();
      return [name || '—', value] as [string, string];
    })
    .filter((row): row is [string, string] => row !== null);
}

type Bar = {
  text: string;
  actions: Action[];
  x: number;
  y: number;
  focus: boolean;
};

/** 用键盘按按钮选中一段时，动作条出现后把焦点移进去 */
let focusNext = false;
/** 按钮替你选中的：动作条放在选区下面，不放在按钮旁 */
let fromButton = false;

/** 选中一个元素里的全部文字（给不方便拖选的人） */
export function selectNode(node: HTMLElement | null, keyboard: boolean) {
  const selection = document.getSelection();
  if (!node || !selection) return;
  focusNext = keyboard;
  fromButton = true;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function SelectionBar({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [state, setState] = useState<Bar | null>(null);
  const [result, setResult] = useState<Result | null>(null);

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
      const at = fromButton ? null : pointer.current;
      fromButton = false;
      // 有鼠标：放在光标旁；触屏和键盘：放在选区下面，不挡住系统自己的菜单
      const x = at ? at.x + 14 : rect.left + rect.width / 2 - 160;
      const y = at ? at.y + 18 : rect.bottom + 12;
      const clipped = text.slice(0, 400);
      setResult(null);
      setState({
        text: clipped,
        actions: plan(clipped),
        x,
        y,
        focus: focusNext,
      });
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

  useEffect(() => {
    if (state?.focus) bar.current?.querySelector('button')?.focus();
  }, [state]);

  const run = async (action: Action) => {
    if (!state) return;
    const { text } = state;
    const { results } = selectTry;
    let next: Result;
    if (action === 'count')
      next = {
        text: results.count(Array.from(text.replace(/\s/g, '')).length),
      };
    else if (action === 'clean')
      next = { text: results.clean(cleanText(text)) };
    else if (action === 'plain') {
      try {
        await navigator.clipboard.writeText(text);
        next = { text: results.plain };
      } catch {
        next = { text: results.plainFailed };
      }
    } else if (action === 'table') {
      const rows = toRows(text);
      next =
        rows.length >= 2
          ? { text: results.table(rows.length), rows }
          : { text: results.tableEmpty };
    } else if (action === 'calendar')
      next = { text: results.calendar(text.match(DATE)?.[0] ?? text) };
    else
      next = {
        text: /cup/i.test(text) ? results.translateSample : results.translate,
      };
    setResult(next);
    remember({
      action: selectTry.actions[action],
      text: text.length > 22 ? `${text.slice(0, 22)}…` : text,
    });
  };

  const place = (bar: Bar) => {
    const width = 336;
    const left = Math.max(12, Math.min(bar.x, window.innerWidth - width - 12));
    const top = Math.max(76, Math.min(bar.y, window.innerHeight - 220));
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
          aria-label={selectTry.label}
          style={place(state)}
        >
          <div className="tl-select-actions">
            {state.actions.map((id, index) => {
              return (
                <button
                  key={id}
                  type="button"
                  data-first={
                    (index === 0 && state.actions.length > 3) || undefined
                  }
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => void run(id)}
                >
                  <Ico icon={icons[id]} />
                  {selectTry.actions[id]}
                  <small data-ai={ai[id]}>
                    {ai[id] ? selectTry.ai : selectTry.local}
                  </small>
                </button>
              );
            })}
          </div>
          <div className="tl-select-foot">
            <output className="tl-select-result" aria-live="polite">
              {result ? (
                <>
                  {result.text}
                  {result.rows ? (
                    <table className="tl-select-table">
                      <tbody>
                        {result.rows.map(([name, value], index) => (
                          <tr key={index}>
                            <th scope="row">{name}</th>
                            <td className="num">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </>
              ) : (
                <span className="tl-select-idle">{selectTry.idle}</span>
              )}
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
