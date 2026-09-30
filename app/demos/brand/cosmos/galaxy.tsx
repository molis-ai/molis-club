'use client';
import { useEffect, useRef } from 'react';

const vertexShader = `
attribute vec4 a_star;
attribute vec3 a_color;
uniform float u_time;
uniform float u_scroll;
uniform float u_aspect;
uniform float u_scale;
uniform float u_bg;
uniform vec2 u_pointer;
uniform vec2 u_offset;
uniform float u_zoom;
varying vec3 v_color;
varying float v_fade;

void main() {
  float r = a_star.x;
  float theta = a_star.y + u_time * (1.0 - u_bg) * 0.035 / (0.18 + r);
  vec3 p = vec3(cos(theta) * r, a_star.z, sin(theta) * r);

  float tilt = 0.98 - u_pointer.y * 0.12 - u_scroll * 0.62;
  float ct = cos(tilt);
  float st = sin(tilt);
  p = vec3(p.x, p.y * ct - p.z * st, p.y * st + p.z * ct);

  float yaw = u_pointer.x * 0.22 + u_scroll * 0.9 + u_time * u_bg * 0.004;
  float cy = cos(yaw);
  float sy = sin(yaw);
  p = vec3(p.x * cy - p.z * sy, p.y, p.x * sy + p.z * cy);

  float camera = mix(2.35, 0.62, u_scroll) + u_bg * 2.0;
  float depth = camera - p.z;
  if (depth < 0.04) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    v_fade = 0.0;
    return;
  }
  vec2 offset = u_offset * (1.0 - u_scroll);
  vec2 projected = p.xy / depth * u_zoom;
  gl_Position = vec4(projected.x / u_aspect + offset.x, projected.y + offset.y, 0.0, 1.0);
  gl_PointSize = min(a_star.w * u_scale * u_zoom / 1.55 / depth, 42.0 * u_scale);
  v_color = a_color;
  v_fade = smoothstep(0.04, 0.35, depth);
}
`;

const fragmentShader = `
precision mediump float;
varying vec3 v_color;
varying float v_fade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float glow = 1.0 - smoothstep(0.0, 0.5, d);
  glow *= glow;
  gl_FragColor = vec4(v_color * glow * v_fade * 2.6, 1.0);
}
`;

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  return (
    Math.sqrt(-2 * Math.log(rand() + 1e-6)) * Math.cos(2 * Math.PI * rand())
  );
}

function buildGalaxy(count: number) {
  const rand = mulberry(7);
  const stars = new Float32Array(count * 4);
  const colors = new Float32Array(count * 3);
  const arms = 3;
  for (let i = 0; i < count; i++) {
    const kind = rand();
    let r: number;
    let theta: number;
    let y: number;
    let size: number;
    let color: [number, number, number];
    if (kind < 0.2) {
      r = Math.abs(gaussian(rand)) * 0.12;
      theta = rand() * Math.PI * 2;
      y = gaussian(rand) * 0.045 * (1 - r * 3);
      size = 2 + rand() * 3;
      const w = 0.55 + rand() * 0.3;
      color = [0.34 * w + 0.1, 0.26 * w, 0.15 * w];
    } else if (kind < 0.36) {
      // diffuse disc between the arms
      r = 0.06 + Math.pow(rand(), 0.7) * 0.95;
      theta = rand() * Math.PI * 2;
      y = gaussian(rand) * 0.02;
      size = 1 + rand() * 1.6;
      color = [0.1, 0.11, 0.15];
    } else {
      r = 0.08 + Math.pow(rand(), 0.85) * 0.92;
      const arm = Math.floor(rand() * arms);
      const spread = gaussian(rand) * (0.09 + r * 0.12);
      theta = (arm / arms) * Math.PI * 2 + Math.log(r / 0.08) * 2.35 + spread;
      y = gaussian(rand) * 0.018;
      size = 1.2 + Math.pow(rand(), 4) * 5;
      const pick = rand();
      if (pick < 0.035) {
        color = [0.55, 0.16, 0.32];
        size += 3;
      } else if (pick < 0.5) {
        color = [0.13, 0.19, 0.34];
      } else if (pick < 0.8) {
        color = [0.22, 0.22, 0.27];
      } else {
        color = [0.3, 0.24, 0.16];
      }
      const falloff = 1.1 - r * 0.55;
      color = [color[0] * falloff, color[1] * falloff, color[2] * falloff];
    }
    stars.set([r, theta, y, size], i * 4);
    colors.set(color, i * 3);
  }
  return { stars, colors };
}

function buildBackground(count: number) {
  const rand = mulberry(42);
  const stars = new Float32Array(count * 4);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    // encode a point on a sphere of radius 2.6 via r / theta / y
    const radius = 2.6;
    const r = s * radius;
    stars.set([r, phi, u * radius, 1 + Math.pow(rand(), 6) * 5], i * 4);
    const b = 0.25 + rand() * 0.5;
    const warm = rand() > 0.7;
    colors.set(warm ? [b, b * 0.85, b * 0.7] : [b * 0.8, b * 0.88, b], i * 3);
  }
  return { stars, colors };
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function startGalaxy(canvas: HTMLCanvasElement, track: string) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'high-performance',
  });
  if (!gl) {
    canvas.classList.add('is-fallback');
    return;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.innerWidth < 760;
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.classList.add('is-fallback');
    return;
  }
  gl.useProgram(program);

  const layers = [
    { data: buildGalaxy(narrow ? 16000 : 34000), bg: 0 },
    { data: buildBackground(narrow ? 1400 : 2600), bg: 1 },
  ].map(({ data, bg }) => {
    const starBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, starBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.stars, gl.STATIC_DRAW);
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.colors, gl.STATIC_DRAW);
    return { starBuffer, colorBuffer, count: data.stars.length / 4, bg };
  });

  const aStar = gl.getAttribLocation(program, 'a_star');
  const aColor = gl.getAttribLocation(program, 'a_color');
  const u = (name: string) => gl.getUniformLocation(program, name);
  const uTime = u('u_time');
  const uScroll = u('u_scroll');
  const uAspect = u('u_aspect');
  const uScale = u('u_scale');
  const uBg = u('u_bg');
  const uPointer = u('u_pointer');
  const uOffset = u('u_offset');
  const uZoom = u('u_zoom');
  gl.enableVertexAttribArray(aStar);
  gl.enableVertexAttribArray(aColor);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.clearColor(0.016, 0.02, 0.04, 1);

  let width = 0;
  let height = 0;
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 1.75);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointer.tx = event.clientX / window.innerWidth - 0.5;
    pointer.ty = event.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener('pointermove', onPointer);

  const trackEl = document.querySelector<HTMLElement>(track);
  let frame = 0;
  let smoothScroll = 0;
  const start = performance.now();
  const render = (now: number) => {
    frame = requestAnimationFrame(render);
    const span = trackEl
      ? trackEl.offsetHeight - window.innerHeight
      : window.innerHeight;
    const raw = Math.max(0, window.scrollY) / Math.max(1, span);
    const hidden = raw > 1.08;
    canvas.style.opacity = hidden
      ? '0'
      : String(Math.min(1, Math.max(0, (1.08 - raw) / 0.2)));
    if (hidden) return;
    const target = Math.min(1, raw);
    smoothScroll += (target - smoothScroll) * (reduce.matches ? 1 : 0.08);
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    const time = reduce.matches ? 40 : (now - start) / 1000 + 40;
    const wide = width > 900;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, time);
    gl.uniform1f(uScroll, smoothScroll);
    gl.uniform1f(uAspect, width / Math.max(1, height));
    gl.uniform1f(uScale, dpr * Math.min(1.4, Math.max(0.75, height / 820)));
    gl.uniform2f(uPointer, pointer.x, pointer.y);
    gl.uniform2f(uOffset, wide ? 0.36 : 0.05, wide ? 0.04 : 0.42);
    gl.uniform1f(uZoom, wide ? 2.05 : 1.9);
    for (const layer of layers) {
      gl.uniform1f(uBg, layer.bg);
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.starBuffer);
      gl.vertexAttribPointer(aStar, 4, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, layer.colorBuffer);
      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, layer.count);
    }
  };
  frame = requestAnimationFrame(render);
  canvas.classList.add('is-ready');

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointer);
  };
}

export default function Galaxy({ track }: { track: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startGalaxy(canvas, track);
  }, [track]);

  return <canvas ref={canvasRef} className="cs-galaxy" aria-hidden="true" />;
}
