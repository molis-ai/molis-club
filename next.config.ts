import type { NextConfig } from 'next';

// 旧地址退役（specs/site-rebuild/spec.md 第 3 节）：线上旧版的根路径页面，以及 /atelier、/edition-c、/compare，
// 全部转到新页面里对应的位置。现在是私有试用，先用临时重定向（307），正式公开时再改成永久（308）。
// /demos/** 的评审页不受影响。
// 「关于」收成一整页（C1，负责人 2026-10-18）：「认识我们」/team 退役，跳到「关于」里「我们是谁」那一屏；
// 一骏的旧个人页跳到他的名牌。文章、沿途仍是各自的页面。
const moved: [string, string][] = [
  ['/products', '/#products'],
  ['/solutions', '/enterprise'],
  ['/wiki', '/community/methods'],
  ['/wiki/artists', '/community/methods?type=artists'],
  ['/wiki/artists/:slug', '/community/methods/artists/:slug'],
  ['/wiki/:slug', '/community/methods/:slug'],
  ['/perspectives', '/essays'],
  ['/journal', '/essays'],
  ['/story/:slug', '/essays/:slug'],
  ['/studio', '/about'],
  ['/team', '/about#people'],
  ['/creators', '/about#people'],
  ['/community/adeptify', '/about#people'],
  ['/community/yijun', '/about#yijun'],
  ['/join', '/contact'],
  ['/works', '/along-the-way'],
  ['/works/:slug', '/along-the-way'],
  ['/atelier', '/'],
  ['/atelier/:path*', '/'],
  ['/edition-c', '/'],
  ['/edition-c/:path*', '/'],
  ['/compare', '/'],
  // 先不开放的产品详情页（负责人 2026-10-18）：页面代码留着，地址先转到首页产品区
  ['/life', '/#products'],
  ['/story', '/#products'],
  ['/world', '/#products'],
];

const nextConfig: NextConfig = {
  async redirects() {
    return moved.map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    }));
  },
};

export default nextConfig;
