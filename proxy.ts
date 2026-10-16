import { NextResponse, type NextRequest } from 'next/server';
import { LOCALE_HEADER, localeOf } from './app/_site/locale';

// 当前语言写进请求头（/en 开头是英文，其余是中文），根布局读它来写 <html lang>。
// 每个页面请求都重写这个头，外面带进来的同名头不算数。接口、静态文件不经过这里。
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, localeOf(request.nextUrl.pathname));
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!api/|_next/|site/|images/|favicon|.*\\.[a-z0-9]+$).*)'],
};
