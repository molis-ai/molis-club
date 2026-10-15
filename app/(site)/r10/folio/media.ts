import site from '../../../_site/media.json';
import folio from './media.json';

// 这一版用到的配图：新站已压好的（app/_site/media.json）加上本目录压的截图与照片（scripts/r10-folio-media.mjs）。

export type Picture = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  /** 载入前铺的平均色 */
  color: string;
};

type SiteEntry = {
  src: string;
  srcset: (string | number)[][];
  width: number;
  height: number;
  avg: string;
};

type FolioEntry = {
  src: string;
  srcset: (string | number)[][];
  width: number;
  height: number;
  color: string;
};

const srcSet = (list: (string | number)[][]) =>
  list.map(([src, w]) => `${src} ${w}w`).join(', ');

export type FolioKey = keyof typeof folio;
export type SiteKey = keyof typeof site;

export function picture(key: FolioKey | SiteKey): Picture {
  if (key in folio) {
    const entry = (folio as Record<string, FolioEntry>)[key];
    return {
      src: entry.src,
      srcSet: srcSet(entry.srcset),
      width: entry.width,
      height: entry.height,
      color: entry.color,
    };
  }
  const entry = (site as Record<string, SiteEntry>)[key];
  return {
    src: entry.src,
    srcSet: srcSet(entry.srcset),
    width: entry.width,
    height: entry.height,
    color: entry.avg,
  };
}
