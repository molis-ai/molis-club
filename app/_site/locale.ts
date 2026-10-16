// 中英文两种语言的地址规则。中文在根路径（/work），英文在 /en 前缀下（/en/work）。
// 服务端、客户端都能用；客户端组件拿当前语言用 use-locale.ts 里的 useLocale()。
// 铺开到新的一页：把它的中文地址加进 englishPages，在 app/(site)/en/ 下建同名页面（见 docs/i18n.md）。

export type Locale = 'zh' | 'en';

export const locales: Locale[] = ['zh', 'en'];

/** 写进 <html lang> 与 hreflang 的语言代码 */
export const htmlLang: Record<Locale, string> = { zh: 'zh-CN', en: 'en' };
export const ogLocale: Record<Locale, string> = { zh: 'zh_CN', en: 'en_US' };

/** proxy.ts 把当前语言写在请求头里，根布局读它来写 <html lang> */
export const LOCALE_HEADER = 'x-molis-locale';

/** 从英文页跳到还没有英文的页面时，带上这个参数；顶栏看到它就说一声，再把它从地址里拿掉 */
export const FROM_EN = 'from';

/**
 * 已经有英文的页面（写中文地址）。顶栏切换、站内链接、hreflang、站点地图都读这里。
 * 不在这里的页面，切到英文时给一句提示、留在中文页。
 */
export const englishPages = ['/', '/work'];

const EN = '/en';

export function localeOf(path: string): Locale {
  return path === EN || path.startsWith(`${EN}/`) ? 'en' : 'zh';
}

/** 去掉 /en 前缀，得到这一页的中文地址 */
export function stripLocale(path: string): string {
  if (path === EN) return '/';
  return path.startsWith(`${EN}/`) ? path.slice(EN.length) : path;
}

/** 把站内地址拆成路径、查询、锚点 */
function split(href: string) {
  const hashAt = href.indexOf('#');
  const hash = hashAt >= 0 ? href.slice(hashAt) : '';
  const rest = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const queryAt = rest.indexOf('?');
  return {
    path: (queryAt >= 0 ? rest.slice(0, queryAt) : rest) || '/',
    query: queryAt >= 0 ? rest.slice(queryAt + 1) : '',
    hash,
  };
}

export function hasEnglish(path: string): boolean {
  return englishPages.includes(stripLocale(split(path).path));
}

/** 一个中文地址的英文版地址（不管有没有英文） */
export function englishPath(path: string): string {
  return path === '/' ? EN : `${EN}${path}`;
}

/**
 * 站内链接按语言换地址：中文原样；英文有这一页就换成 /en 地址，
 * 还没有英文就仍去中文页，带上 ?from=en 让那一页说明一声。外链与 mailto 原样返回。
 */
export function localize(href: string, locale: Locale): string {
  if (locale === 'zh' || !href.startsWith('/') || href.startsWith('//'))
    return href;
  const { path, query, hash } = split(href);
  if (localeOf(path) === 'en') return href;
  if (englishPages.includes(path))
    return `${englishPath(path)}${query ? `?${query}` : ''}${hash}`;
  const params = new URLSearchParams(query);
  params.set(FROM_EN, 'en');
  return `${path}?${params}${hash}`;
}

/** 顶栏切换：这一页在另一种语言里的地址；对面还没有这一页时是 null */
export function counterpart(path: string, to: Locale): string | null {
  const zh = stripLocale(path);
  if (to === 'zh') return zh;
  return englishPages.includes(zh) ? englishPath(zh) : null;
}

/**
 * 页面元数据里的 alternates：自己的 canonical，加上两种语言互相标的 hreflang（x-default 指向中文）。
 * 只有两种语言都有的页面才标 hreflang。
 */
export function alternates(path: string, locale: Locale, origin: string) {
  const zh = stripLocale(path);
  const own = locale === 'en' ? englishPath(zh) : zh;
  const canonical = `${origin}${own === '/' ? '/' : own}`;
  if (!englishPages.includes(zh)) return { canonical };
  return {
    canonical,
    languages: {
      [htmlLang.zh]: `${origin}${zh}`,
      [htmlLang.en]: `${origin}${englishPath(zh)}`,
      'x-default': `${origin}${zh}`,
    },
  };
}
