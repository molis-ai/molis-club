'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { htmlLang, localeOf, type Locale } from './locale';

/** 客户端组件拿当前语言：从地址读（/en 开头是英文），换页时跟着变 */
export function useLocale(): Locale {
  return localeOf(usePathname() ?? '/');
}

/**
 * 站内换页（不刷新）跨了语言时，<html lang> 跟着改。
 * 首次打开时服务端已经写对了（proxy.ts → app/layout.tsx），这里只管之后的换页。
 */
export function LangSync() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = htmlLang[locale];
  }, [locale]);
  return null;
}

/** 跳到正文：根布局里的第一个链接，评审页也用 */
export function SkipLink() {
  const locale = useLocale();
  return (
    <a className="skip-link" href="#main">
      {locale === 'en' ? 'Skip to content' : '跳到主要内容'}
    </a>
  );
}
