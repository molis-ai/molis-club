'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { END_WIDTH, FULL, TARGET } from './painters-plan';

// 《黑客与画家》的轨道：[data-scene] 让全站的滚动钩子写入 --pin；这里只量框的尺寸，
// 把推近的起点、终点写成 CSS 变量（像素与倍数），推近本身由 painters.css 按 --pin 算。
// 框变了（窗口缩放、手机转屏）就重新量。

export function PaintersFit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const paintFrame = root.querySelector<HTMLElement>('.hp-frame-paint');
    const paint = root.querySelector<HTMLElement>('.hp-paint');
    const codeFrame = root.querySelector<HTMLElement>('.hp-frame-code');
    const sheet = root.querySelector<HTMLElement>('.hp-sheet');
    if (!paintFrame || !paint || !codeFrame || !sheet) return;

    const px = (value: number) => `${value.toFixed(2)}px`;
    const set = (node: HTMLElement, vars: Record<string, string | number>) => {
      for (const [name, value] of Object.entries(vars))
        node.style.setProperty(name, String(value));
    };

    const measure = () => {
      // 画：整幅先铺满框（多出的部分裁掉），终点处框宽里是原图的 END_WIDTH 像素
      {
        const w = paintFrame.clientWidth;
        const h = paintFrame.clientHeight;
        if (!w || !h) return;
        const ratio = FULL.w / FULL.h;
        const pw = w / h > ratio ? w : h * ratio;
        const ph = pw / ratio;
        const fx = TARGET.x / FULL.w;
        const fy = TARGET.y / FULL.h;
        set(paint, {
          '--fw': px(w),
          '--fh': px(h),
          '--pw': px(pw),
          '--ph': px(ph),
          '--fx': fx.toFixed(5),
          '--fy': fy.toFixed(5),
          '--x0': px((w - pw) / 2 + fx * pw),
          '--y0': px((h - ph) / 2 + fy * ph),
          '--se': ((w / END_WIDTH) * (FULL.w / pw)).toFixed(4),
        });
      }
      // 代码：整张样式表先装进框里，终点处注释里那句中文刚好占满框宽（后面的装饰线出框）
      {
        const w = codeFrame.clientWidth;
        const h = codeFrame.clientHeight;
        const rows = Array.from(
          sheet.querySelectorAll<HTMLElement>('[data-target]'),
        );
        if (!w || !h || rows.length < 2) return;
        sheet.style.transform = 'none';
        const box = sheet.getBoundingClientRect();
        const first = rows[0].getBoundingClientRect();
        const last = rows[rows.length - 1].getBoundingClientRect();
        const text = rows[0].firstChild;
        const range = document.createRange();
        if (text?.nodeType === Node.TEXT_NODE) {
          const data = (text as Text).data;
          const end = data.indexOf('）');
          range.setStart(text, data.search(/\S/));
          range.setEnd(text, end < 0 ? data.length : end + 1);
        } else range.selectNodeContents(rows[0]);
        const words = range.getBoundingClientRect();
        sheet.style.transform = '';
        const cw = sheet.offsetWidth;
        const ch = sheet.offsetHeight;
        const k0 = Math.min(w / cw, h / ch);
        const k1 = (w * 0.9) / words.width;
        const cx = words.left - box.left + words.width / 2;
        const cy = (first.top + last.bottom) / 2 - box.top;
        set(sheet, {
          '--k0': k0.toFixed(5),
          '--kr': (k1 / k0).toFixed(4),
          '--cx': px(cx),
          '--cy': px(cy),
          '--x0': px((w - cw * k0) / 2 + cx * k0),
          '--y0': px((h - ch * k0) / 2 + cy * k0),
          '--xe': px(w / 2),
          '--ye': px(h / 2),
        });
      }
      root.dataset.fit = '';
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(paintFrame);
    observer.observe(codeFrame);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hp" ref={ref} data-scene>
      {children}
    </div>
  );
}
