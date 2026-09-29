'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import './nocturne.css';

const title = ['始终好奇，', '持续创造'];
const statement =
  '技术应该回到人的尺度。我们做产品，是为了让人更从容地好奇、判断与创造。';

const fragment = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uFade;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = r * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float portrait = step(uRes.x, uRes.y);
  float t = uTime * 0.035;

  vec2 q = vec2(fbm(uv * 1.3 + t), fbm(uv * 1.3 - t + 5.2));
  vec2 w = vec2(
    fbm(uv * 1.7 + 3.2 * q + vec2(1.7, 9.2) + t * 1.4),
    fbm(uv * 1.7 + 3.2 * q + vec2(8.3, 2.8) - t)
  );
  float f = fbm(uv * 1.5 + 2.6 * w);

  vec2 source = mix(vec2(0.42, 0.16), vec2(0.08, 0.3), portrait) + uPointer * 0.12;
  float d = length((uv - source) * vec2(1.0, 1.25));
  float glow = exp(-d * mix(2.1, 3.6, portrait));

  vec3 amber = vec3(1.0, 0.58, 0.28);
  vec3 ember = vec3(0.95, 0.32, 0.18);
  vec3 cyan = vec3(0.28, 0.66, 1.0);
  vec3 violet = vec3(0.38, 0.26, 0.86);

  vec3 col = vec3(0.012, 0.014, 0.026);
  col += mix(ember, amber, w.y) * pow(f, 3.4) * glow * 3.6;
  vec2 cool = mix(vec2(-0.55, -0.28), vec2(-0.2, -0.45), portrait);
  float coolMask = smoothstep(1.2, 0.0, length(uv - cool));
  col += mix(violet, cyan, w.x) * pow(f, 5.0) * 2.2 * coolMask;
  col += amber * exp(-d * 11.0) * 0.55;
  col += vec3(1.0, 0.86, 0.7) * exp(-d * 34.0) * 0.5;

  float streak = exp(-abs(uv.y - source.y) * 90.0) * exp(-abs(uv.x - source.x) * 1.6);
  col += vec3(0.45, 0.62, 1.0) * streak * 0.22;

  col *= smoothstep(1.35, 0.1, length(uv * vec2(0.85, 1.05)));
  col *= uFade * mix(1.0, 0.6, portrait);
  col = 1.0 - exp(-col * 1.7);
  gl_FragColor = vec4(pow(col, vec3(0.92)), 1.0);
}
`;

function LightField({ fade }: { fade: React.RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      canvas.dataset.fallback = 'true';
      return;
    }
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(
      program,
      compile(
        gl.VERTEX_SHADER,
        'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}',
      ),
    );
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.dataset.fallback = 'true';
      return;
    }
    // Called via the prototype so hook lint rules do not mistake it for a React hook.
    WebGLRenderingContext.prototype.useProgram.call(gl, program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uPointer = gl.getUniformLocation(program, 'uPointer');
    const uFade = gl.getUniformLocation(program, 'uFade');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const scale = Math.min(0.6, 900 / Math.max(1, canvas.clientWidth));
      canvas.width = Math.round(canvas.clientWidth * scale);
      canvas.height = Math.round(canvas.clientHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const draw = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const seconds = reduced.matches ? 40 : (now - start) / 1000 + 40;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uFade, fade.current ?? 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (clockRef.current) {
        const elapsed = (now - start) / 1000;
        const frames = Math.floor((elapsed % 1) * 24);
        const s = Math.floor(elapsed) % 60;
        const m = Math.floor(elapsed / 60) % 60;
        clockRef.current.textContent = `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
      }
    };
    const loop = (now: number) => {
      draw(now);
      raf = visible && !reduced.matches ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      pointer.tx = event.clientX / window.innerWidth - 0.5;
      pointer.ty = 0.5 - event.clientY / window.innerHeight;
      if (reduced.matches) requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    const onScroll = () => {
      if (reduced.matches && visible) requestAnimationFrame(draw);
    };
    const onResize = () => {
      resize();
      requestAnimationFrame(draw);
    };

    resize();
    observer.observe(canvas);
    kick();
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [fade]);

  return (
    <>
      <canvas className="nc-field" ref={canvasRef} aria-hidden="true" />
      <span className="nc-timecode" ref={clockRef} aria-hidden="true">
        00:00:00:00
      </span>
    </>
  );
}

function WorkVisual() {
  const threads = [
    'M-20 150 C 160 150, 220 300, 420 300',
    'M-20 300 C 160 300, 240 300, 420 300',
    'M-20 450 C 160 450, 220 300, 420 300',
  ];
  return (
    <div className="nc-visual nc-visual-work" aria-hidden="true">
      <svg viewBox="0 0 600 600">
        <defs>
          <linearGradient id="nc-ledger" x1="0" x2="1">
            <stop offset="0" stopColor="#ffb46b" stopOpacity="0" />
            <stop offset="0.25" stopColor="#ffb46b" />
            <stop offset="1" stopColor="#ffe3c2" />
          </linearGradient>
        </defs>
        {threads.map((d, i) => (
          <g key={d}>
            <path d={d} className="nc-thread" />
            <path
              d={d}
              className="nc-thread-flow"
              style={{ '--i': i } as React.CSSProperties}
            />
          </g>
        ))}
        {['会话 A', '会话 B', '会话 C'].map((label, i) => (
          <text key={label} x="22" y={138 + i * 150} className="nc-svg-label">
            {label}
          </text>
        ))}
        <line
          x1="400"
          y1="300"
          x2="620"
          y2="300"
          stroke="url(#nc-ledger)"
          strokeWidth="2.5"
        />
        <circle cx="420" cy="300" r="7" className="nc-node" />
        <circle cx="420" cy="300" r="26" className="nc-node-ring" />
      </svg>
      <div className="nc-ledger-card">
        <small>共同账本</small>
        <ul>
          <li>
            <span>目标</span>做好第一版访谈指南
          </li>
          <li>
            <span>决定</span>先访谈三位用户
          </li>
          <li>
            <span>依赖</span>等你确认问题顺序
          </li>
          <li className="nc-ledger-current">
            <span>证据</span>两份访谈记录
          </li>
        </ul>
        <em>示意</em>
      </div>
    </div>
  );
}

function LifeVisual() {
  const items = ['账单到期', '活动安排', '想读的书', '临时起意'];
  return (
    <div className="nc-visual nc-visual-life" aria-hidden="true">
      <div className="nc-orbits">
        {[0, 1, 2].map((ring) => (
          <div className={`nc-orbit nc-orbit-${ring}`} key={ring} />
        ))}
        <div className="nc-orbit-spin">
          {items.map((item, i) => (
            <span
              className="nc-orbit-item"
              key={item}
              style={{ '--a': `${i * 90 + 20}deg` } as React.CSSProperties}
            >
              <b>{item}</b>
            </span>
          ))}
        </div>
      </div>
      <div className="nc-core">
        <span>下一步</span>
      </div>
      <em className="nc-visual-note">概念示意</em>
    </div>
  );
}

function StoryVisual() {
  return (
    <div className="nc-visual nc-visual-story" aria-hidden="true">
      <div className="nc-portal">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            className="nc-arch"
            key={i}
            style={{ '--i': i } as React.CSSProperties}
          />
        ))}
        <span className="nc-portal-light" />
        {Array.from({ length: 14 }, (_, i) => (
          <i
            className="nc-mote"
            key={i}
            style={
              {
                '--x': `${(i * 37) % 100}%`,
                '--d': `${6 + (i % 5) * 1.7}s`,
                '--delay': `${-i * 0.9}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <em className="nc-visual-note">概念示意</em>
    </div>
  );
}

const products = [
  {
    index: '01',
    stage: '持续开发',
    name: 'Molis Work',
    lead: '换一个会话，工作也接得上。',
    text: '做一件跨越几天、几周的复杂工作时，AI 一换会话就忘了目标和进度。Molis Work 把目标、决定、依赖和完成证据保存成共同账本，让人和不同 AI 随时接着做。',
    href: '/demos/product',
    Visual: WorkVisual,
  },
  {
    index: '02',
    stage: '原型探索',
    name: 'Molis Life',
    lead: '把散落的日常，接成下一步。',
    text: '账单到期、活动安排、想读的书和临时起意，常常散落在不同地方。Molis Life 在得到授权后理解你的偏好，汇总这些日常事项，并把下一步准备好。',
    Visual: LifeVisual,
  },
  {
    index: '03',
    stage: '概念设计',
    name: 'Molis Story',
    lead: '以自己的身份，走进一段故事。',
    text: '想放松或进入一段故事时，现有内容大多只能被动观看。Molis Story 让你以自己的身份进入独立世界，通过阅读、交流、探索和行动参与其中，离开后还能继续这段经历。',
    Visual: StoryVisual,
  },
];

const capabilities = [
  {
    title: '把真正的问题看清',
    text: '我们从真实工作现场出发，把模糊的“AI 提效”拆成具体流程、关键判断和可以验证的结果。',
    people: [
      {
        image: '/images/daylight/team/zhuangshi.png',
        role: 'AI 数据产品与复杂业务设计',
        experience:
          '曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。',
        aside: 'Molis 创始合伙人、首席布道人。Google 搜得到的女人。',
      },
    ],
  },
  {
    title: '把复杂想法落地',
    text: '从AI Agent、企业知识库到AI Native应用，我们把设想做成可以使用、维护和继续生长的产品。',
    people: [
      {
        image: '/images/daylight/team/yijun.png',
        role: '系统架构、产品与技术管理',
        experience:
          '曾在美团、字节、滴滴、LinkedIn 及多家硅谷创业公司的核心研发团队负责架构与管理，长期建设和演进高复杂度核心系统。',
        aside: 'Molis AI Founder。首席 Token 官，也是一个幻想家。',
      },
      {
        image: '/images/daylight/team/xiejun.jpeg',
        position: '50% 48%',
        role: 'AI Native 与 Agent 工程',
        experience:
          '8 年美团研发经验，较早参与企业知识库、RAG、Prompt Engineering 与 Agent 实践；长期深耕数据、计算、平台架构和复杂系统工程化，目前聚焦 AI Agent、AI Coding 与 AI Native 软件架构。',
        aside: '从北京骑回南宁的工程师。叫我谢尊。',
      },
    ],
  },
  {
    title: '带来可量化的价值',
    text: '我们不只交付原型，也和业务团队一起把产品带进真实流程，创造真正的业务指标增量。',
    people: [
      {
        image: '/images/daylight/team/xinyi.jpg',
        position: '50% 54%',
        role: '业务增长与客户共创',
        experience:
          '曾在美团、字节、小红书核心团队负责数据运营，对接 100+ 客户团队，参与共创月百万级业务增量，持续寻找 AI 能力真正进入业务的落点。',
        aside: 'Molis AI 下一任 CEO 候选人之一。',
      },
    ],
  },
];

const companies = [
  {
    src: '/images/daylight/company_logo/美团/美团横式色彩标识.png',
    w: 1896,
    h: 687,
    alt: '美团',
    cls: 'meituan',
  },
  {
    src: '/images/daylight/company_logo/douyin-group.jpg',
    w: 1749,
    h: 800,
    alt: '抖音集团',
    cls: 'douyin',
  },
  {
    src: '/images/daylight/company_logo/didi.jpg',
    w: 823,
    h: 800,
    alt: '滴滴',
    cls: 'didi',
  },
  {
    src: '/images/daylight/company_logo/linkedin-svgrepo-com.svg',
    w: 382,
    h: 382,
    alt: 'LinkedIn',
    cls: 'linkedin',
  },
  {
    src: '/images/daylight/company_logo/red.jpeg',
    w: 4804,
    h: 3200,
    alt: '小红书',
    cls: 'red',
  },
];

export default function NocturneDirection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef(1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add('is-ready');
    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    const showcase = root.querySelector<HTMLElement>('.nc-showcase');
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) continue;
        const mode = scene.dataset.scene;
        let p: number;
        if (mode === 'pin') p = -rect.top / Math.max(1, rect.height - vh);
        else if (mode === 'exit') p = -rect.top / Math.max(1, rect.height);
        else p = (vh - rect.top) / (vh + rect.height);
        p = Math.min(1, Math.max(0, p));
        scene.style.setProperty('--p', p.toFixed(4));
        if (mode === 'exit') fadeRef.current = 1 - p * 0.85;
        if (scene === showcase) {
          const active = String(Math.min(2, Math.floor(p * 3)));
          if (showcase.dataset.active !== active)
            showcase.dataset.active = active;
        }
      }
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    root
      .querySelectorAll('[data-reveal]')
      .forEach((element) => reveal.observe(element));
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    return () => {
      cancelAnimationFrame(raf);
      reveal.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);

  const characters = Array.from(statement);

  return (
    <div className="nc-site" ref={rootRef}>
      <div className="nc-grain" aria-hidden="true" />
      <header className="nc-header">
        <Link href="/demos/brand/nocturne" className="nc-logo">
          <img src="/images/molis-logo.png" width="36" height="36" alt="" />
          <span>Molis AI</span>
        </Link>
        <nav className="nc-nav" aria-label="主导航">
          <a href="#products">作品</a>
          <Link href="/demos/community">社区</Link>
          <a href="#capabilities">关于我们</a>
          <Link href="/join" className="nc-nav-cta">
            聊一聊
          </Link>
        </nav>
      </header>

      <main id="main">
        <section
          className="nc-hero"
          data-scene="exit"
          aria-labelledby="nc-title"
        >
          <LightField fade={fadeRef} />
          <div className="nc-hero-frame" aria-hidden="true">
            <span>Molis AI — 产品工作室</span>
            <span>Scene 01 · 好奇</span>
          </div>
          <div className="nc-hero-copy">
            <h1 id="nc-title">
              {title.map((line, l) => (
                <span className="nc-title-line" key={line}>
                  {Array.from(line).map((character, c) => (
                    <span
                      key={c}
                      style={{ '--i': l * 5 + c } as React.CSSProperties}
                    >
                      {character}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <p>
              Molis AI 是一间产品工作室。
              <br />
              我们和 AI 一起，把好奇心做成真正帮到人的作品。
            </p>
            <a href="#statement" className="nc-scroll-cue">
              <span>向下，进入</span>
              <ArrowDown size={16} />
            </a>
          </div>
          <a
            className="nc-hero-card"
            href="https://github.com/molis-ai/molis-work"
            target="_blank"
            rel="noreferrer"
          >
            <small>正在做</small>
            <strong>Molis Work</strong>
            <span>换一个会话，工作也接得上</span>
            <ArrowUpRight size={18} />
          </a>
        </section>

        <section
          id="statement"
          className="nc-statement"
          data-scene="pin"
          aria-label="我们的立场"
        >
          <div className="nc-statement-stage">
            <span className="nc-flare" aria-hidden="true" />
            <span className="nc-kicker">Scene 02 · 立场</span>
            <p className="nc-sr-only">{statement}</p>
            <p
              className="nc-statement-text"
              aria-hidden="true"
              style={{ '--n': characters.length } as React.CSSProperties}
            >
              {characters.map((character, index) => (
                <span
                  key={index}
                  style={{ '--i': index } as React.CSSProperties}
                >
                  {character}
                </span>
              ))}
            </p>
          </div>
        </section>

        <section
          id="products"
          className="nc-products"
          aria-labelledby="nc-products-title"
        >
          <div className="nc-products-intro" data-reveal>
            <span className="nc-kicker">Scene 03 · 我们正在做什么</span>
            <h2 id="nc-products-title">
              把复杂的事一起做好，
              <br />
              把珍贵的时间留给生活。
            </h2>
            <p>
              Molis 从工作、生活和沉浸式体验三个方向，让 AI
              接住复杂任务与日常琐事，也为人的兴趣、选择和想象留出空间。
            </p>
          </div>

          <div className="nc-showcase" data-scene="pin" data-active="0">
            <div className="nc-showcase-stage">
              <ol className="nc-showcase-index" aria-hidden="true">
                {products.map((product) => (
                  <li key={product.index}>
                    <span>{product.index}</span>
                    {product.name}
                  </li>
                ))}
              </ol>
              {products.map(
                ({ index, stage, name, lead, text, href, Visual }) => (
                  <article className="nc-product" key={name}>
                    <Visual />
                    <div className="nc-product-copy">
                      <span className="nc-product-meta">
                        {index} <i /> {stage}
                      </span>
                      <h3>{name}</h3>
                      <p className="nc-product-lead">{lead}</p>
                      <p>{text}</p>
                      {href && (
                        <Link href={href} className="nc-link">
                          了解 {name} <ArrowUpRight size={17} />
                        </Link>
                      )}
                    </div>
                  </article>
                ),
              )}
              <span className="nc-showcase-bar" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className="nc-capabilities"
          aria-labelledby="nc-capabilities-title"
        >
          <div className="nc-capabilities-intro" data-reveal>
            <span className="nc-kicker">Scene 04 · 谁在把这些事情做出来</span>
            <h2 id="nc-capabilities-title">
              一群真正做过，
              <br />
              也真正交付过的人。
            </h2>
            <p>
              我们负责过大型核心系统的架构与管理，也在硅谷创业公司和国内互联网核心团队里，反复经历从
              0 到 1、从 1 到规模化。今天，我们把这些经验带进 Molis。
            </p>
          </div>

          <div className="nc-credits" aria-label="团队成员的职业经历">
            <p>团队成员的职业经历包括</p>
            <div className="nc-logos">
              {companies.map((company) => (
                <span
                  className={`nc-logo-item nc-logo-${company.cls}`}
                  key={company.cls}
                >
                  <img
                    src={company.src}
                    width={company.w}
                    height={company.h}
                    alt={company.alt}
                    loading="lazy"
                  />
                  {company.cls === 'linkedin' && <b>LinkedIn</b>}
                </span>
              ))}
            </div>
          </div>

          <div className="nc-capability-list">
            {capabilities.map((capability, i) => (
              <article
                className="nc-capability"
                key={capability.title}
                data-reveal
              >
                <span className="nc-capability-index">0{i + 1}</span>
                <div className="nc-capability-copy">
                  <h3>{capability.title}</h3>
                  <p>{capability.text}</p>
                </div>
                <div className="nc-cast">
                  {capability.people.map((person) => (
                    <div className="nc-person" key={person.image}>
                      <img
                        src={person.image}
                        width="96"
                        height="96"
                        alt=""
                        loading="lazy"
                        style={{ objectPosition: person.position }}
                      />
                      <div>
                        <strong>{person.role}</strong>
                        <p>{person.experience}</p>
                        <em>{person.aside}</em>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="nc-footer" data-scene="view">
        <div className="nc-horizon" aria-hidden="true" />
        <div className="nc-footer-invite" data-reveal>
          <span className="nc-kicker">Scene 05 · 相遇</span>
          <h2>你正在好奇什么？</h2>
          <p>
            从一个还没想清楚的念头，到一个已经卡了很久的具体问题，都可以成为相遇的开始。
          </p>
        </div>
        <div className="nc-footer-paths">
          <Link href="/demos/community" className="nc-path">
            <small>如果你也在创造</small>
            <h3>来看看一群人，怎样把新的可能一起做出来。</h3>
            <span>
              去社区看看 <ArrowUpRight size={18} />
            </span>
          </Link>
          <Link href="/join" className="nc-path">
            <small>如果你来自企业或团队</small>
            <h3>带着一个具体问题来，我们先一起把它看清。</h3>
            <span>
              和我们聊聊 <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>
        <div className="nc-footer-meta">
          <span>Molis AI</span>
          <Link
            href="https://github.com/molis-ai"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
