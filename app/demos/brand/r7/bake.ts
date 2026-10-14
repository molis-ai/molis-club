'use client';
import { useEffect, useState } from 'react';

// 带滤镜的 SVG（木纹、水彩、画布肌理）挂在会被镜头推近的墙上，缩放时浏览器会反复重算滤镜。
// 这里在页面打开后把它们各画一次成位图，推镜时缩放的只是一张图。没有脚本时直接显示 SVG。

export const svgUri = (svg: string) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** 把一段 SVG 画成位图，返回可直接放进 src 或 url() 的地址；fallback 决定画好之前用什么 */
export function useBaked(
  svg: string,
  width: number,
  height: number,
  {
    scale = 2,
    fallback = 'svg',
  }: { scale?: number; fallback?: 'svg' | 'none' } = {},
) {
  const [src, setSrc] = useState(() => (fallback === 'svg' ? svgUri(svg) : ''));
  useEffect(() => {
    let url = '';
    let cancelled = false;
    const image = new Image();
    image.src = svgUri(svg);
    image
      .decode()
      .then(() => {
        if (cancelled) return;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const context = canvas.getContext('2d');
        if (!context) return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob || cancelled) return;
            url = URL.createObjectURL(blob);
            setSrc(url);
          },
          'image/webp',
          0.9,
        );
      })
      .catch(() => {
        // 画不出来就留着 SVG
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [svg, width, height, scale]);
  return src;
}
