'use client';
import { useEffect } from 'react';

// 控制台里给同类留一句话：只说一次。
let said = false;
export function Console() {
  useEffect(() => {
    if (said) return;
    said = true;
    console.info(
      '%cMolis AI%c 这个网站也是作品。看到哪里别扭，欢迎来改：https://github.com/molis-ai',
      'font: 300 14px Jost, sans-serif; letter-spacing: .02em',
      'color: #69665f',
    );
  }, []);
  return null;
}
