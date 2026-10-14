import type { ReactNode } from 'react';

// 文章正文的 Markdown 风格排版：只认文章里真的用到的几样——
// ## / ### 小标题、> 引文、有序与无序列表、--- 分隔（之后的部分按「附注」排小一号）、
// 行内 **加粗**、*斜体*、`代码`、[文字](地址)。从旧站的渲染逻辑改写而来，不引用旧文件。

/** back：分隔线之后的附注小标题（不编节号） */
export type Heading = { id: string; text: string; back: boolean };

type Block =
  | { kind: 'h2' | 'h3'; text: string; id: string }
  | { kind: 'quote' | 'p'; text: string }
  | { kind: 'ol'; start: number; items: string[] }
  | { kind: 'ul'; items: string[] }
  | { kind: 'hr' };

const ORDERED = /^\d+\.\s+/;
const BULLET = /^[-*]\s+/;

export function parseEssay(body: string) {
  const blocks: Block[] = [];
  const headings: Heading[] = [];
  const raw = body
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  for (const part of raw) {
    const lines = part.split('\n').map((line) => line.trim());
    if (part.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: part.slice(4), id: `t-${blocks.length}` });
    } else if (part.startsWith('## ')) {
      const id = `s-${headings.length + 1}`;
      const text = part.slice(3);
      headings.push({ id, text, back: blocks.some((b) => b.kind === 'hr') });
      blocks.push({ kind: 'h2', text, id });
    } else if (part === '---') {
      blocks.push({ kind: 'hr' });
    } else if (part.startsWith('>')) {
      blocks.push({
        kind: 'quote',
        text: lines.map((line) => line.replace(/^>\s?/, '')).join(''),
      });
    } else if (lines.every((line) => ORDERED.test(line))) {
      blocks.push({
        kind: 'ol',
        start: Number.parseInt(lines[0], 10),
        items: lines.map((line) => line.replace(ORDERED, '')),
      });
    } else if (lines.every((line) => BULLET.test(line))) {
      blocks.push({
        kind: 'ul',
        items: lines.map((line) => line.replace(BULLET, '')),
      });
    } else {
      blocks.push({ kind: 'p', text: lines.join('') });
    }
  }
  return { blocks, headings };
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
const latinOnly = (text: string) => /^[\x20-\x7e]+$/.test(text);

/** 行内记号：加粗、斜体（纯英文时才真的斜）、代码、链接（打印时链接后写出地址） */
export function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} lang={latinOnly(inner) ? 'en' : undefined}>
          {inner}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return <code key={index}>{part.slice(1, -1)}</code>;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const external = /^https?:\/\//.test(link[2]);
      return (
        <a
          key={index}
          className="m-inline"
          href={link[2]}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : null)}
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export function EssayBlocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case 'h2':
        return (
          <h2 key={index} id={block.id}>
            {inline(block.text)}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={index} id={block.id}>
            {inline(block.text)}
          </h3>
        );
      case 'quote':
        return (
          <blockquote key={index}>
            <p>{inline(block.text)}</p>
          </blockquote>
        );
      case 'ol':
        return (
          <ol key={index} start={block.start}>
            {block.items.map((item, at) => (
              <li key={at}>{inline(item)}</li>
            ))}
          </ol>
        );
      case 'ul':
        return (
          <ul key={index}>
            {block.items.map((item, at) => (
              <li key={at}>{inline(item)}</li>
            ))}
          </ul>
        );
      case 'hr':
        return <hr key={index} />;
      default:
        return <p key={index}>{inline(block.text)}</p>;
    }
  });
}
