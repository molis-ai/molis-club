'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import {
  GITHUB_URL,
  screenshotNote,
  screenshots,
} from '../../../../content/molis-work';
import { demo } from '../../../../content/molis-tool';
import {
  coreProduct,
  ending,
  heroActions,
  lineImages,
  lines,
  linesIntro,
  positioning,
  solutions,
  team,
  vision,
} from '../../../../content/studio';
import { Actions, Closing, Frame, Phrases, Screen, Status, pad } from './kit';
import {
  COMMUNITY,
  Footer,
  SiteHeader,
  WORK,
  contactHref,
  lineHref,
  useNocturneMotion,
  type Vars,
} from './shared';
import { LifeVisual, StoryVisual, ToolVisual } from './visuals';
import './nocturne.css';
import './kit.css';

// 文案来自 content/studio.ts，五个方向共用；这里只换成夜曲的视觉：
// 光场首屏、亮起的一块屏、逐字点亮的长句、吸顶切换的三条产品线、地平线页尾。

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

/** 首屏的实时光场：随鼠标流动，首屏离场时渐暗；减少动态时停在一帧 */
function LightField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;
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
    // 经原型调用，免得 hooks 规则把它当成 React hook
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
      const box = hero.getBoundingClientRect();
      const gone = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height)));
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, seconds);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uFade, 1 - gone * 0.85);
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
  }, []);

  return (
    <>
      <canvas className="nc-field" ref={canvasRef} aria-hidden="true" />
      <span className="nc-timecode" ref={clockRef} aria-hidden="true">
        00:00:00:00
      </span>
    </>
  );
}

/** 片头式标题：逐字从模糊里显影，后半句染上琥珀光 */
function TitleCard({ text }: { text: string }) {
  const at = text.indexOf('，') + 1;
  const rows = [text.slice(0, at), text.slice(at)];
  return (
    <h1 id="nc-title">
      {rows.map((row, r) => (
        <span className="nc-title-line" key={row}>
          {Array.from(row).map((character, c) => (
            <span key={c} style={{ '--i': (r ? at : 0) + c, '--j': c } as Vars}>
              {character}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/** 长句吸顶，随滚动一个字一个字点亮；仍按逗号断行 */
function LitLine({ id, text }: { id: string; text: string }) {
  let count = 0;
  const phrases = text.split(/(?<=[，、。])/);
  const total = Array.from(text).length;
  return (
    <h2 id={id} className="nc-lit" style={{ '--n': total } as Vars}>
      {phrases.map((phrase) => (
        <span className="nc-phrase" key={phrase}>
          {Array.from(phrase).map((character) => {
            const index = count++;
            return (
              <span key={index} style={{ '--i': index } as Vars}>
                {character}
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
}

function CoreProduct() {
  const shot = screenshots.goal;
  return (
    <section id="products" className="nc-core" aria-labelledby="nc-core-title">
      <div className="nc-core-intro">
        <div className="nc-core-copy" data-reveal>
          <span className="nc-kicker">{coreProduct.kicker}</span>
          <h2 id="nc-core-title">{coreProduct.name}</h2>
          <p>{coreProduct.line}</p>
        </div>
        <div className="nc-core-side" data-reveal>
          <ol className="nc-core-points">
            {coreProduct.highlights.map((item, index) => (
              <li key={item}>
                <span>{pad(index)}</span>
                <strong>{item}</strong>
              </li>
            ))}
          </ol>
          <Status items={coreProduct.status} />
          <Actions
            items={[
              { label: coreProduct.actions.more, href: WORK, tone: 'primary' },
              {
                label: coreProduct.actions.github,
                href: GITHUB_URL,
                external: true,
              },
            ]}
          />
        </div>
      </div>
      <Screen note={screenshotNote}>
        <Frame src={shot.src} w={shot.w} h={shot.h} label={shot.label} />
      </Screen>
    </section>
  );
}

function Solutions() {
  return (
    <section
      id="solutions"
      className="nc-solutions"
      aria-labelledby="nc-solutions-title"
    >
      <div className="nc-statement" data-scene="pin">
        <div className="nc-statement-stage">
          <span className="nc-flare" aria-hidden="true" />
          <span className="nc-kicker">{solutions.kicker}</span>
          <LitLine id="nc-solutions-title" text={solutions.title} />
          <p className="nc-statement-lede">
            <Phrases text={solutions.lede} />
          </p>
        </div>
      </div>
      <div className="nc-solutions-body">
        <ol className="nc-steps">
          {solutions.steps.map((step, index) => (
            <li key={step} data-reveal style={{ '--r': index } as Vars}>
              <span className="nc-step-dot" aria-hidden="true" />
              <span className="nc-step-index">{pad(index)}</span>
              <h3>{step}</h3>
            </li>
          ))}
        </ol>
        <div className="nc-directions" data-reveal>
          <h3 className="nc-kicker">{solutions.directionsLabel}</h3>
          <ul>
            {solutions.directions.map((direction) => (
              <li key={direction.title}>
                <strong>{direction.title}</strong>
                <em>{direction.status}</em>
              </li>
            ))}
          </ul>
          <Actions
            items={[
              {
                label: solutions.action,
                href: contactHref('enterprise'),
                tone: 'primary',
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

const lineVisuals = {
  life: <LifeVisual note={lineImages.life.note} />,
  tool: <ToolVisual actions={demo.actions} note={lineImages.tool.note} />,
  story: <StoryVisual note={lineImages.story.note} />,
};

function Lines() {
  return (
    <section id="lines" className="nc-lines" aria-labelledby="nc-lines-title">
      <div className="nc-lines-intro" data-reveal>
        <h2 id="nc-lines-title">
          <Phrases text={linesIntro.title} />
        </h2>
      </div>
      <div
        className="nc-showcase"
        data-scene="pin"
        data-steps={lines.length}
        data-active="0"
      >
        <div className="nc-showcase-stage">
          <ol className="nc-showcase-index" aria-hidden="true">
            {lines.map((line, index) => (
              <li key={line.id}>
                <span>{pad(index)}</span>
                {line.name}
              </li>
            ))}
          </ol>
          {lines.map((line, index) => (
            <article
              className="nc-product"
              key={line.id}
              data-step={index}
              aria-labelledby={`nc-line-${line.id}`}
            >
              {lineVisuals[line.id]}
              <div className="nc-product-copy">
                <span className="nc-product-meta">
                  {line.area}
                  <i aria-hidden="true" />
                  {line.status}
                </span>
                <h3 id={`nc-line-${line.id}`}>{line.name}</h3>
                <p>
                  <Phrases text={line.line} />
                </p>
                <Link className="nc-more" href={lineHref[line.id]}>
                  {line.more}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
          <span className="nc-showcase-bar" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

// 团队区这轮不动：人、照片和公司标识保持原样，只挪到页末；长经历收进悬停 / 点按的注释里
const people = [
  {
    image: '/images/daylight/team/zhuangshi.jpg',
    role: 'AI 数据产品与复杂业务设计',
    experience:
      '曾任字节、美团核心团队 AI 数据产品资深专家；参与抖音数据管理及功能建设，拥有相关软件著作权，并受邀在 DataFun、美团大学与 CSDI Summit 分享实践。',
    aside: 'Molis 创始合伙人、首席布道人。Google 搜得到的女人。',
  },
  {
    image: '/images/daylight/team/yijun.jpg',
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
  {
    image: '/images/daylight/team/xinyi.jpg',
    position: '50% 54%',
    role: '业务增长与客户共创',
    experience:
      '曾在美团、字节、小红书核心团队负责数据运营，对接 100+ 客户团队，参与共创月百万级业务增量，持续寻找 AI 能力真正进入业务的落点。',
    aside: 'Molis AI 下一任 CEO 候选人之一。',
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

function Team() {
  const [open, setOpen] = useState<number | null>(null);
  const cast = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (open === null) return;
    const outside = (event: PointerEvent) => {
      if (!cast.current?.contains(event.target as Node)) setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <section id="about" className="nc-team" aria-labelledby="nc-team-title">
      <div className="nc-team-intro" data-reveal>
        <span className="nc-kicker">{team.kicker}</span>
        <h2 id="nc-team-title">
          {team.title[0]}
          <br />
          {team.title[1]}
        </h2>
        <p>{team.text}</p>
      </div>

      <div className="nc-credits">
        <p>{team.proof}</p>
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

      <ul className="nc-cast" ref={cast}>
        {people.map((person, index) => (
          <li
            className="nc-person"
            key={person.image}
            data-open={open === index || undefined}
            data-reveal
            style={{ '--r': index } as Vars}
          >
            <button
              type="button"
              aria-label={person.role}
              aria-expanded={open === index}
              aria-controls={`nc-person-${index}`}
              onClick={() =>
                setOpen((current) => (current === index ? null : index))
              }
            >
              <img
                src={person.image}
                width="96"
                height="96"
                alt=""
                loading="lazy"
                style={{ objectPosition: person.position }}
              />
            </button>
            <strong>{person.role}</strong>
            <em>{person.aside}</em>
            <div className="nc-person-note" id={`nc-person-${index}`}>
              <p>{person.experience}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function NocturneDirection() {
  const rootRef = useNocturneMotion();
  const { community, contact } = ending.paths;

  return (
    <div className="nc-site nc-home" ref={rootRef}>
      <div className="nc-grain" aria-hidden="true" />
      <SiteHeader />

      <main id="main">
        <section
          className="nc-hero"
          data-scene="exit"
          aria-labelledby="nc-title"
        >
          <LightField />
          <div className="nc-hero-copy">
            <TitleCard text={vision} />
            <p>{positioning}</p>
            <Actions
              items={[
                { label: heroActions.primary, href: WORK, tone: 'primary' },
                { label: heroActions.secondary, href: '#lines' },
              ]}
            />
            <span className="nc-scroll-cue" aria-hidden="true">
              <i />
              <ArrowDown size={16} />
            </span>
          </div>
        </section>

        <CoreProduct />
        <Solutions />
        <Lines />
        <Team />
      </main>

      <Footer>
        <Closing id="nc-ending-title" title={ending.title}>
          <div className="nc-paths" data-reveal>
            {[
              { path: community, href: COMMUNITY },
              { path: contact, href: contactHref('enterprise') },
            ].map(({ path, href }) => (
              <Link href={href} className="nc-path" key={href}>
                <small>{path.label}</small>
                <h3>
                  {path.title.map((line) => (
                    <span className="nc-line" key={line}>
                      {line}
                    </span>
                  ))}
                </h3>
                <span>
                  {path.action}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Closing>
      </Footer>
    </div>
  );
}
