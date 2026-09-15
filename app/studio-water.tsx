'use client';
import { useEffect, useRef } from 'react';

const vertexSource = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;
const fragmentSource = `
precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
float surface(vec2 p) {
  float t = time * .13;
  p += vec2(sin(p.y * 1.8 + t), cos(p.x * 1.5 - t * .8)) * .28;
  float folds = sin(p.x * 3.2 + p.y * 2.1 + t + sin(p.y * 2.6 - t) * .8);
  folds += sin(p.y * 5.1 - p.x * 1.7 - t * .7 + sin(p.x * 2.4 + t) * .6) * .4;
  folds += sin(p.x * 7.6 + p.y * 3.8 + t * .6) * .095;
  vec2 d = p - (pointer - .5) * vec2(resolution.x / resolution.y, 1.0) * 3.0;
  return folds * .19 + exp(-dot(d, d) * 1.5) * .08;
}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = (uv - .5) * vec2(resolution.x / resolution.y, 1.0) * 3.0;
  float h = surface(p);
  float e = .008;
  vec2 slope = vec2(surface(p + vec2(e, 0.0)) - h, surface(p + vec2(0.0, e)) - h) / e;
  vec3 normal = normalize(vec3(-slope * 1.6, 1.0));
  vec3 light = normalize(vec3(-.45 + pointer.x * .2, .7 + pointer.y * .15, 1.2));
  float diffuse = dot(normal, light);
  float sheen = pow(max(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0), 9.0);
  float tone = smoothstep(.18, 1.0, diffuse);
  vec3 shadow = vec3(.61, .64, .62);
  vec3 paper = vec3(.86, .845, .795);
  vec3 color = mix(shadow, paper, tone);
  color += sheen * vec3(.12, .115, .09);
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - .5;
  color += grain * .026;
  gl_FragColor = vec4(color, 1.0);
}
`;

export default function StudioWater() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const region = canvas?.parentElement;
    if (!canvas || !region) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      shaders.forEach((shader) => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      return;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
      return;
    }
    const activateProgram = gl.useProgram.bind(gl);
    activateProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'resolution'),
      pointer: gl.getUniformLocation(program, 'pointer'),
      time: gl.getUniformLocation(program, 'time'),
    };
    let frame = 0;
    let visible = false;
    let lost = false;
    let previous = 0;
    let elapsed = 0;
    let x = 0.5,
      y = 0.5,
      targetX = 0.5,
      targetY = 0.5;
    let interval = 1000 / 30;
    const resize = () => {
      const rect = region.getBoundingClientRect();
      const ratio = Math.min(
        window.devicePixelRatio,
        1.25,
        Math.sqrt(900000 / (rect.width * rect.height)),
      );
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      interval = 1000 / (rect.width < 760 ? 24 : 30);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    };
    const draw = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || media.matches || lost) return;
      frame = requestAnimationFrame(draw);
      if (previous && now - previous < interval) return;
      elapsed += previous ? Math.min(now - previous, 80) / 1000 : 0;
      previous = now;
      x += (targetX - x) * 0.06;
      y += (targetY - y) * 0.06;
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform2f(uniforms.pointer, x, y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (canvas.dataset.ready !== 'true') canvas.dataset.ready = 'true';
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      canvas.dataset.ready =
        media.matches || lost ? 'false' : canvas.dataset.ready || 'false';
      if (visible && !document.hidden && !media.matches && !lost)
        frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = region.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width;
      targetY = 1 - (event.clientY - rect.top) / rect.height;
    };
    const leave = () => {
      targetX = 0.5;
      targetY = 0.5;
    };
    const contextLost = () => {
      lost = true;
      sync();
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      sync();
    });
    const resizeObserver = new ResizeObserver(resize);
    resize();
    observer.observe(region);
    resizeObserver.observe(region);
    region.addEventListener('pointermove', move, { passive: true });
    region.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', sync);
    media.addEventListener('change', sync);
    canvas.addEventListener('webglcontextlost', contextLost);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      region.removeEventListener('pointermove', move);
      region.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', sync);
      media.removeEventListener('change', sync);
      canvas.removeEventListener('webglcontextlost', contextLost);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="studio-water-canvas"
      aria-hidden="true"
    />
  );
}
