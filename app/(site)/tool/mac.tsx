import {
  Camera,
  Compass,
  FileAudio,
  FileText,
  FileVideo,
  Folder,
  Mail,
  NotebookPen,
  Table2,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { Tone, Wall } from '../../../content/site/tool';
import { mediaOf } from '../../_site/ui';

// Tool 页每一屏的主角：一块 Mac 屏幕。壁纸是莫奈的伦敦（早上、午后、傍晚，负责人 2026-10-24 选），
// 上面一条毛玻璃菜单栏，窗口、程序坞、动作条和小卡按真实界面的比例画（tool.css 里 --u 是这块屏幕上的 10 个点）。
// 屏幕的外框由外层给（.tl-mac）：首屏的演示外壳和往下钉住的那几块都是一块屏幕。不带 'use client'，两边都能用。

const walls = {
  morning: 'wall-morning',
  noon: 'wall-noon',
  dusk: 'wall-dusk',
} as const;

/** 一块屏幕里的东西：壁纸、菜单栏（应用名、菜单、右边的 Molis 图标和时间），再放窗口 */
export function Screen({
  className = '',
  wall,
  app,
  menus,
  clock,
  eager = false,
  sizes = '(max-width: 900px) 100vw, 60vw',
  children,
}: {
  /** 每块屏幕自己的排法（tool.css 里 .tl-s-*） */
  className?: string;
  wall: Wall;
  app: ReactNode;
  menus: ReactNode;
  clock: ReactNode;
  /** 首屏的壁纸先加载 */
  eager?: boolean;
  sizes?: string;
  children: ReactNode;
}) {
  const image = mediaOf(walls[wall]);
  return (
    <div className={`tl-screen ${className}`} data-wall={wall}>
      <img
        className="tl-screen-wall"
        src={image.src}
        srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : undefined}
      />
      <div className="tl-menubar" aria-hidden="true">
        <b className="tl-menubar-app">{app}</b>
        <span className="tl-menubar-menus">{menus}</span>
        <span className="tl-menubar-end">
          <span className="tl-menubar-icon" data-c="molis">
            <img src="/site/molis-logo-64.png" width="64" height="64" alt="" />
          </span>
          <span className="tl-menubar-clock">{clock}</span>
        </span>
      </div>
      {children}
    </div>
  );
}

/** 菜单栏里的几个菜单（c 给要被光标点到的那一个） */
export function Menus({ items, c }: { items: string[]; c?: string }) {
  return (
    <>
      {items.map((item, index) => (
        <span
          key={item}
          data-c={c && index === items.length - 1 ? c : undefined}
        >
          {item}
        </span>
      ))}
    </>
  );
}

/** 一扇窗：标题栏（三个灯、标题、右边的工具），下面是内容 */
export function Win({
  title,
  className,
  c,
  tools,
  children,
}: {
  title: ReactNode;
  className: string;
  c?: string;
  tools?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`tl-win ${className}`} data-c={c}>
      <div className="tl-win-bar" aria-hidden="true">
        <span className="tl-lights">
          <i />
          <i />
          <i />
        </span>
        <b>{title}</b>
        {tools}
      </div>
      {children}
    </div>
  );
}

const apps: Record<string, { icon: LucideIcon; tone: Tone }> = {
  文件: { icon: Folder, tone: 'sky' },
  浏览器: { icon: Compass, tone: 'sky' },
  邮件: { icon: Mail, tone: 'apricot' },
  笔记: { icon: NotebookPen, tone: 'butter' },
  表格: { icon: Table2, tone: 'sage' },
  照片: { icon: Camera, tone: 'rose' },
};

/** 应用图标：圆角方块里一个线描图形 */
export function AppIcon({ name }: { name: string }) {
  const { icon: Icon, tone } = apps[name] ?? apps.文件;
  return (
    <i className="tl-app-icon" data-tone={tone}>
      <Icon strokeWidth={1.8} />
    </i>
  );
}

/** 程序坞：一排应用图标，c 给要被点到的那一个（名字是 dock-<应用名>） */
export function Dock({ apps: names }: { apps: string[] }) {
  return (
    <div className="tl-dock" aria-hidden="true">
      {names.map((name) => (
        <span key={name} className="tl-dock-app" data-c={`dock-${name}`}>
          <AppIcon name={name} />
          <small>{name}</small>
        </span>
      ))}
    </div>
  );
}

const files = {
  audio: FileAudio,
  video: FileVideo,
  doc: FileText,
} as const;

/** 文件图标：一张折角的纸；PDF 写着 PDF，图片是缩略图，别的是一个线描图形 */
export function FileIcon({
  kind,
  thumb,
}: {
  kind: 'pdf' | 'audio' | 'video' | 'image' | 'doc';
  thumb?: string;
}) {
  if (kind === 'image' && thumb)
    return (
      <i className="tl-file-icon" data-kind="image">
        <img src={thumb} alt="" loading="lazy" decoding="async" />
      </i>
    );
  const Icon = kind === 'pdf' || kind === 'image' ? null : files[kind];
  return (
    <i className="tl-file-icon" data-kind={kind}>
      {Icon ? <Icon strokeWidth={1.6} /> : <b>PDF</b>}
    </i>
  );
}

/** 画面里的一枚标签：标出这一站、这一处（以前与现在的四站带序号，插件的四处是小圆点） */
export function Pin({
  c,
  k,
  n,
  children,
}: {
  c?: string;
  k?: string | number;
  /** 老路上的第几站：圆点换成序号 */
  n?: number;
  children: ReactNode;
}) {
  return (
    <span className="tl-pin" data-c={c} data-k={k} data-n={n}>
      {children}
    </span>
  );
}
