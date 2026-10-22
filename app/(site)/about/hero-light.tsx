'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import media from '../../_site/media.json';
import { pieces } from '../../../content/site/exhibit';
import { aboutNext } from '../../../content/site/about';
import { useVisible } from '../../_site/motion';
import type { Vars } from '../../_site/ui';
import plan from './light-plan.json';

// 「关于」首屏：Molis 图库「光-03 · 天光落下的地方」满幅铺开，地上的叶影缓缓地动
// （负责人 2026-10-19：「这个树影可以动起来吗，缓缓动起来」）。
// 照片本身是一张 <img>（没有 JS、减少动态、WebGL 不可用时就是它）；上面盖一层同样裁切的 WebGL 画布：
// - 天光块里：原图 ÷ 原来的叶影 × 挪过的叶影。叶影图由 scripts/about-light-shade.mjs 从照片里分出来，
//   所以动的只有影子，石纹与砖缝不晃；静止时和原图一模一样，画布淡入时看不出接缝；
// - 天窗里的树叶：跟着同一阵风轻轻挪一点，和地上的影子对得上；左边门外那棵树不动（负责人 2026-10-19）。
// 风是两层：整棵树一起慢慢摆（十几秒一个来回，摆幅十几个像素），叠一层枝叶各自的小晃；影子的浓淡也跟着轻轻起伏。
// 一进来是静止的照片，风在头 4 秒里慢慢起来（负责人 2026-10-19 看过第一版说看不出在动，加大了摆幅）。
// 每秒画 30 帧就够。
// 离开视口、页面隐藏、按了暂停时停；减少动态时不启动。右下角有暂停键（同首页首屏）。

const image = media['about-light'];
const PATCH = plan.patch.flat();
const SKY = plan.skylight.flat();

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_pos.x * 0.5 + 0.5, 0.5 - a_pos.y * 0.5);
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_img;
uniform sampler2D u_shade;
uniform float u_t;
uniform vec2 u_frame;
uniform vec4 u_box;
uniform vec2 u_patch[4];
uniform vec2 u_sky[4];

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float edge(vec2 p, vec2 a, vec2 b) {
  vec2 e = b - a;
  return dot(p - a, vec2(-e.y, e.x)) / length(e);
}
/* 点在四边形里多深（像素，里面为正；顶点顺时针、y 向下） */
float depth(vec2 p, vec2 q0, vec2 q1, vec2 q2, vec2 q3) {
  return min(min(edge(p, q0, q1), edge(p, q1, q2)), min(edge(p, q2, q3), edge(p, q3, q0)));
}
float shadeAt(vec2 p) {
  vec2 s = (p - u_box.xy) / u_box.zw;
  if (s.x < 0.0 || s.y < 0.0 || s.x > 1.0 || s.y > 1.0) return 1.0;
  return max(texture2D(u_shade, s).r, 0.3);
}

void main() {
  vec2 p = v_uv * u_frame;
  float t = u_t;
  /* 风：整棵树一起慢慢摆，主要是左右；再叠一层枝叶各自的小晃 */
  vec2 sway = vec2(sin(t * 0.41) * 0.7 + sin(t * 0.17 + 1.1) * 0.45, sin(t * 0.29 + 0.4) * 0.3);
  vec2 q = p / 85.0;
  vec2 leaf = vec2(noise(q + vec2(t * 0.3, 0.0)), noise(q + vec2(7.3, t * 0.26))) - 0.5;
  /* 一进来是静止的照片，风在头 4 秒里慢慢起来；摆幅十几个像素，看得出在动，又不晃眼 */
  float wind = smoothstep(0.0, 4.0, t);
  vec2 d = (sway * 11.0 + leaf * 8.0) * wind;
  /* 叶子一疏一密，影子也跟着一浓一淡 */
  float breath = 1.0 + (sin(t * 0.53) * 0.6 + sin(t * 1.1 + 2.0) * 0.4) * 0.14 * wind;

  vec4 col = texture2D(u_img, v_uv);

  /* 地上的天光块：只挪叶影 */
  float mp = smoothstep(1.0, 6.0, depth(p, u_patch[0], u_patch[1], u_patch[2], u_patch[3]));
  if (mp > 0.0) {
    float s0 = shadeAt(p);
    float s1 = clamp(1.0 - (1.0 - shadeAt(p - d)) * breath, 0.25, 1.0);
    col.rgb = min(col.rgb / s0 * mix(s0, s1, mp), vec3(1.0));
  }

  /* 天窗里的树叶：跟着同一阵风挪一点（左边门外那棵树不动，负责人 2026-10-19） */
  float mt = smoothstep(1.0, 8.0, depth(p, u_sky[0], u_sky[1], u_sky[2], u_sky[3]));
  if (mt > 0.0) {
    vec4 moved = texture2D(u_img, (p - d * 0.6) / u_frame);
    col = mix(col, moved, mt);
  }

  gl_FragColor = vec4(col.rgb, 1.0);
}`;

function load(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const node = new Image();
    node.decoding = 'async';
    node.onload = () => resolve(node);
    node.onerror = reject;
    node.src = src;
  });
}

export function HeroLight() {
  const box = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const visible = useVisible(box, 0.01);
  /** WebGL 起来了、画过第一帧 */
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const run = useRef({ playing: false });
  useEffect(() => {
    run.current.playing = visible && !paused;
  }, [visible, paused]);

  useEffect(() => {
    const node = canvas.current;
    const img = photo.current;
    if (!node || !img) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const gl = node.getContext('webgl', {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    let frame = 0;
    let stopped = false;
    let last = 0;
    let clock = 0;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader) ?? 'shader');
      return shader;
    };
    const texture = (unit: number, source: TexImageSource, format: number) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, source);
    };

    /** 画布的像素：和照片铺满后的显示大小一样（乘设备像素比，最多 2 倍、最宽 2560），比例是照片的比例 */
    const size = () => {
      const { clientWidth: w, clientHeight: h } = node;
      const ratio = image.width / image.height;
      const shown = Math.max(w, h * ratio) * Math.min(devicePixelRatio || 1, 2);
      const width = Math.round(Math.min(2560, image.width, shown));
      node.width = width;
      node.height = Math.round(width / ratio);
      gl.viewport(0, 0, node.width, node.height);
    };

    const start = async () => {
      if (!img.complete)
        await new Promise((r) =>
          img.addEventListener('load', r, { once: true }),
        );
      const [picture, shade] = await Promise.all([
        load(img.currentSrc || img.src),
        load('/site/about-light-shade.png'),
      ]);
      if (stopped) return;
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      // 名字以 use 开头，React 的检查会把它当成钩子；从原型上调用，避开误报
      WebGLRenderingContext.prototype.useProgram.call(gl, program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const at = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);

      texture(0, picture, gl.RGB);
      texture(1, shade, gl.LUMINANCE);
      const u = (name: string) => gl.getUniformLocation(program, name);
      gl.uniform1i(u('u_img'), 0);
      gl.uniform1i(u('u_shade'), 1);
      gl.uniform2f(u('u_frame'), plan.frame[0], plan.frame[1]);
      gl.uniform4f(
        u('u_box'),
        plan.box[0],
        plan.box[1],
        plan.box[2],
        plan.box[3],
      );
      gl.uniform2fv(u('u_patch'), PATCH);
      gl.uniform2fv(u('u_sky'), SKY);
      const time = u('u_t');

      size();
      const draw = () => {
        gl.uniform1f(time, clock);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      draw();
      setReady(true);

      const tick = (now: number) => {
        frame = requestAnimationFrame(tick);
        if (!run.current.playing || document.hidden) {
          last = 0;
          return;
        }
        // 每秒 30 帧
        if (last && now - last < 32) return;
        clock += last ? Math.min(0.1, (now - last) / 1000) : 0;
        last = now;
        draw();
      };
      frame = requestAnimationFrame(tick);

      const observer = new ResizeObserver(() => {
        size();
        draw();
      });
      observer.observe(node);
      cleanup.push(() => observer.disconnect());
    };

    const cleanup: Array<() => void> = [];
    start().catch(() => {
      // 出错就留着照片，不动
    });
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      cleanup.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <div
        className="an-hero-plate"
        ref={box}
        style={{ '--avg': image.avg } as Vars}
      >
        <img
          ref={photo}
          src={image.src}
          srcSet={image.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes="100vw"
          width={image.width}
          height={image.height}
          alt={pieces['about-light'].alt}
          fetchPriority="high"
          decoding="async"
        />
        <canvas
          ref={canvas}
          className="an-hero-leaves"
          data-on={ready || undefined}
          aria-hidden="true"
        />
      </div>
      {ready ? (
        <button
          type="button"
          className="m-pause an-hero-pause"
          aria-pressed={paused}
          aria-label={paused ? aboutNext.hero.play : aboutNext.hero.pause}
          onClick={() => setPaused(!paused)}
        >
          {paused ? (
            <Play size={11} fill="currentColor" aria-hidden="true" />
          ) : (
            <Pause size={11} fill="currentColor" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </>
  );
}
