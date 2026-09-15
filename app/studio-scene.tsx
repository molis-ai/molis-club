'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play, MoveUpRight } from 'lucide-react';

// A half-twist ribbon: the cross-section turns once through 180° around the loop.
// Light, viewpoint and a small wave are the only moving parts of this scene.
const vertexSource = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;
const fragmentSource = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uHover;
uniform float uPulse;
mat2 turn(float a) { float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
vec3 local(vec3 p) {
  p.xy=turn(-.42+uPointer.x*.18)*p.xy;
  p.yz=turn(.48+uPointer.y*.20+sin(uTime*.24)*.045)*p.yz;
  p.xz=turn(-.30+uPointer.x*.15)*p.xz;
  return p;
}
float ribbon(vec3 world) {
  vec3 p=local(world);
  float a=atan(p.y,p.x);
  float radius=1.02+uHover*.045+uPulse*.035*sin(a*3.-uTime*2.);
  vec2 q=vec2(length(p.xy)-radius,p.z);
  q=turn(a*.5+uTime*.07)*q;
  vec2 d=abs(q)-vec2(.255,.043);
  return min(max(d.x,d.y),0.)+length(max(d,0.))-.025;
}
vec3 normalAt(vec3 p) {
  vec2 e=vec2(.0015,0.);
  return normalize(vec3(ribbon(p+e.xyy)-ribbon(p-e.xyy),ribbon(p+e.yxy)-ribbon(p-e.yxy),ribbon(p+e.yyx)-ribbon(p-e.yyx)));
}
void main() {
  vec2 uv=(gl_FragCoord.xy-.5*uResolution)/uResolution.y;
  vec3 paper=vec3(.96078,.94510,.92157);
  vec3 color=paper;
  float shadow=exp(-pow(uv.x*2.8,2.)-pow((uv.y+.39)*20.,2.))*.12;
  color-=vec3(.27,.29,.29)*shadow;
  vec3 origin=vec3(0.,0.,4.5);
  vec3 ray=normalize(vec3(uv*3.65,-4.5));
  float b=dot(origin,ray);
  float discriminant=b*b-dot(origin,origin)+2.1;
  if(discriminant>0.) {
    float distance=max(0.,-b-sqrt(discriminant));
    bool hit=false;
    vec3 p;
    for(int i=0;i<76;i++) {
      p=origin+ray*distance;
      float d=ribbon(p);
      if(d<.0014){hit=true;break;}
      distance+=d*.72;
      if(distance>6.)break;
    }
    if(hit) {
      vec3 n=normalAt(p);
      vec3 light=normalize(vec3(-2.8+uPointer.x*.5,4.,5.));
      float diffuse=max(dot(n,light),0.);
      float back=max(dot(n,normalize(vec3(2.,-.3,1.))),0.);
      vec3 lp=local(p);
      float ink=1.-smoothstep(-.65,.7,lp.y);
      vec3 material=mix(vec3(.73,.78,.74),vec3(.20,.31,.38),ink);
      float sheen=pow(max(dot(reflect(-light,n),-ray),0.),26.)*.18;
      color=material*(.47+diffuse*.66+back*.13)+vec3(.93,.89,.80)*sheen;
      float edge=pow(1.-max(dot(n,-ray),0.),3.);
      color+=vec3(.11,.095,.07)*edge;
    }
  }
  gl_FragColor=vec4(color,1.);
}
`;

export default function StudioScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      reducedRef.current = media.matches;
      setReduced(media.matches);
      drawRef.current();
    };
    syncPreference();
    media.addEventListener('change', syncPreference);
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) return () => media.removeEventListener('change', syncPreference);
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    if (!program || !buffer)
      return () => media.removeEventListener('change', syncPreference);
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return false;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return false;
      gl.attachShader(program, shader);
      return true;
    };
    const release = () => {
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
    if (
      !compile(gl.VERTEX_SHADER, vertexSource) ||
      !compile(gl.FRAGMENT_SHADER, fragmentSource)
    ) {
      release();
      return () => media.removeEventListener('change', syncPreference);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      release();
      return () => media.removeEventListener('change', syncPreference);
    }
    const activateProgram = gl.useProgram.bind(gl);
    activateProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(
      ['uResolution', 'uPointer', 'uTime', 'uHover', 'uPulse'].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ]),
    );
    let frame = 0;
    let previous = 0;
    let time = 0;
    let alive = true;
    let visible = true;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let hover = 0;
    let targetHover = 0;
    let pulse = 0;
    let rippleTimer: ReturnType<typeof setTimeout> | undefined;
    const isMoving = () => !pausedRef.current && !reducedRef.current;
    const render = (timestamp: number) => {
      frame = 0;
      if (!alive || !visible || document.hidden) return;
      if (timestamp - previous >= 40 || !isMoving()) {
        const elapsed = Math.min((timestamp - previous) / 1000, 0.06);
        previous = timestamp;
        if (isMoving()) {
          time += elapsed;
          x += (targetX - x) * 0.12;
          y += (targetY - y) * 0.12;
          hover += (targetHover - hover) * 0.09;
          pulse *= 0.92;
        }
        gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
        gl.uniform2f(
          uniforms.uPointer,
          reducedRef.current ? 0 : x,
          reducedRef.current ? 0 : y,
        );
        gl.uniform1f(uniforms.uTime, reducedRef.current ? 0 : time);
        gl.uniform1f(uniforms.uHover, reducedRef.current ? 0 : hover);
        gl.uniform1f(uniforms.uPulse, reducedRef.current ? 0 : pulse);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      if (isMoving()) frame = requestAnimationFrame(render);
    };
    const requestDraw = () => {
      if (!frame && alive) frame = requestAnimationFrame(render);
    };
    drawRef.current = requestDraw;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        rect.width < 600 ? 2 : 1.5,
      );
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      previous = 0;
      requestDraw();
    };
    const move = (event: PointerEvent) => {
      if (!isMoving() || event.pointerType === 'touch') return;
      const rect = root.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const target = event.target;
      targetHover =
        target instanceof Element && target.closest('.entrance-action') ? 1 : 0;
    };
    const leave = () => {
      targetX = 0;
      targetY = 0;
      targetHover = 0;
    };
    const focus = (event: FocusEvent) => {
      targetHover =
        event.target instanceof Element &&
        event.target.closest('.entrance-action')
          ? 1
          : 0;
    };
    const touch = (event: MouseEvent) => {
      if (
        !isMoving() ||
        (event.target instanceof Element && event.target.closest('a,button'))
      )
        return;
      const rect = root.getBoundingClientRect();
      root.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
      root.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
      root.classList.remove('has-ripple');
      void root.offsetWidth;
      root.classList.add('has-ripple');
      clearTimeout(rippleTimer);
      rippleTimer = setTimeout(() => root.classList.remove('has-ripple'), 1800);
      pulse = 1;
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        previous = 0;
        requestDraw();
      }
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      alive = false;
      cancelAnimationFrame(frame);
      setReady(false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        previous = 0;
        requestDraw();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersection.observe(root);
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    root.addEventListener('focusin', focus);
    root.addEventListener('focusout', leave);
    root.addEventListener('click', touch);
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onLost);
    resize();
    setReady(true);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      clearTimeout(rippleTimer);
      observer.disconnect();
      intersection.disconnect();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      root.removeEventListener('focusin', focus);
      root.removeEventListener('focusout', leave);
      root.removeEventListener('click', touch);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      media.removeEventListener('change', syncPreference);
      drawRef.current = () => {};
      release();
    };
  }, []);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    rootRef.current?.classList.remove('has-ripple');
    drawRef.current();
  };

  return (
    <section
      className={`studio-entrance${paused || reduced ? ' is-still' : ''}`}
      ref={rootRef}
      aria-label="Molis AI 创作工作室"
    >
      <div
        className={`entrance-object${ready ? ' is-ready' : ''}`}
        aria-hidden="true"
      >
        <svg className="entrance-fallback" viewBox="0 0 600 600" fill="none">
          <ellipse
            cx="310"
            cy="315"
            rx="157"
            ry="194"
            stroke="#b6c1b7"
            strokeWidth="46"
            transform="rotate(32 310 315)"
          />
          <path
            d="M197 155C338 47 516 266 416 437"
            stroke="#334e61"
            strokeWidth="42"
          />
        </svg>
        <canvas ref={canvasRef} />
      </div>
      <div className="entrance-ripple" aria-hidden="true" />
      {children}
      <div className="entrance-interaction">
        {ready && !paused && !reduced ? (
          <span>
            <MoveUpRight size={14} aria-hidden="true" />
            <span className="pointer-instruction">移动鼠标，轻点空白处</span>
            <span className="touch-instruction">轻点画面，让好奇发生</span>
          </span>
        ) : (
          <span>{paused ? '画面已暂停' : '让好奇，慢慢发生。'}</span>
        )}
        {ready && !reduced ? (
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? '继续背景动态' : '暂停背景动态'}
            aria-pressed={paused}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
            {paused ? '继续' : '暂停'}
          </button>
        ) : (
          <span className="entrance-static">静态画面</span>
        )}
      </div>
    </section>
  );
}
