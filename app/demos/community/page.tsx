'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Plus,
} from 'lucide-react';
import { knowledge, knowledgePrompt } from '../../../content/knowledge';
import { artistSkills } from '../../../content/artists';
import './community.css';

const stagger = knowledge.find((entry) => entry.slug === 'stagger');
const accordion = knowledge.find((entry) => entry.slug === 'accordion');
const monet = artistSkills.find(
  (entry) => entry.slug === 'monet-impressionism',
);
if (!stagger || !accordion || !monet) {
  throw new Error('社区精选方法缺少对应的原始内容条目。');
}

const methods = [
  {
    id: 'stagger',
    name: '让内容，依次出现',
    note: '认识「错落入场」',
    description: stagger.description,
    prompt: knowledgePrompt(stagger),
    href: stagger.source.url,
  },
  {
    id: 'accordion',
    name: '把复杂信息，轻轻折起',
    note: '认识「折叠展开」',
    description: accordion.description,
    prompt: knowledgePrompt(accordion),
    href: accordion.source.url,
  },
  {
    id: 'monet',
    name: '借一双眼睛，重新观察',
    note: '莫奈的光与色',
    description: monet.description,
    prompt: monet.prompt,
    href: '/wiki/artists/monet-impressionism',
  },
];

export default function CommunityDemo() {
  const [bloom, setBloom] = useState(62);
  const [copied, setCopied] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [manualCopy, setManualCopy] = useState('');
  const drawing = useRef<SVGSVGElement>(null);

  const saveText = (
    text: string,
    name: string,
    type = 'text/plain;charset=utf-8',
  ) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const saveFlower = () => {
    if (!drawing.current) return;
    saveText(
      new XMLSerializer().serializeToString(drawing.current),
      '一朵好奇-Molis-AI.svg',
      'image/svg+xml;charset=utf-8',
    );
    setDownloaded(true);
  };
  const copyPrompt = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setManualCopy('');
    } catch {
      setManualCopy(id);
    }
  };

  return (
    <div className="sc-site">
      <header className="sc-header">
        <a className="sc-logo" href="#main" aria-label="Molis AI 社区首页">
          <img src="/images/molis-logo.png" width="31" height="31" alt="" />
          <span>Molis AI</span>
        </a>
        <nav aria-label="社区导航">
          <a href="#works">作品</a>
          <a href="#knowledge">方法</a>
          <a href="#people">我们</a>
        </nav>
      </header>
      <main id="main">
        <section className="sc-hero" aria-labelledby="sc-hero-title">
          <div className="sc-hero-copy">
            <p className="sc-intro">始终好奇，持续创造。</p>
            <h1 id="sc-hero-title">
              来，一起做点
              <br />
              有意思的事。
            </h1>
            <p className="sc-description">
              这里是 Molis AI 的创作社区。
              <br />
              我们分享正在做的产品、试过的方法，
              <br className="sc-desktop-break" />
              也欢迎还没想明白的问题。
            </p>
            <a className="sc-hero-link" href="#works">
              看看大家在做什么
              <ArrowDown size={18} />
            </a>
          </div>
          <div className="sc-playground">
            {/* oxlint-disable jsx-a11y/prefer-tag-over-role -- 此 SVG 的椭圆由滑杆实时修改并可导出，需保留内联图形与完整图像语义，不能替换为 img。 */}
            <svg
              ref={drawing}
              className="sc-flower"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 560 470"
              role="img"
              aria-labelledby="sc-flower-title"
            >
              <title id="sc-flower-title">{`一朵由 24 个椭圆组成的线条花，展开程度 ${bloom}% — Molis AI`}</title>
              <g
                transform="translate(280 235) rotate(-21)"
                fill="none"
                stroke="#335cba"
                strokeWidth="1.15"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <ellipse
                    key={i}
                    rx={195}
                    ry={15 + bloom * 0.96}
                    transform={`rotate(${i * (3.1 + bloom * 0.073)})`}
                  />
                ))}
              </g>
            </svg>
            {/* oxlint-enable jsx-a11y/prefer-tag-over-role */}
            <div className="sc-flower-controls">
              <div className="sc-flower-caption">
                <p>拖动滑杆，让一条线长成一朵花。</p>
                <button
                  onClick={saveFlower}
                  type="button"
                  aria-label="下载这朵花的 SVG 图片"
                  title="下载这朵花"
                >
                  {downloaded ? <Check size={20} /> : <Download size={20} />}
                </button>
              </div>
              <div className="sc-range-row">
                <span>收拢</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bloom}
                  aria-label="花朵展开程度"
                  onChange={(e) => {
                    setBloom(Number(e.target.value));
                    setDownloaded(false);
                  }}
                />
                <span>展开</span>
              </div>
              <p className="sc-download-status" aria-live="polite">
                {downloaded
                  ? '已开始下载。这朵花，送给你。'
                  : '一个小实验。你可以把它带走。'}
              </p>
            </div>
          </div>
        </section>

        <section
          className="sc-works sc-section"
          id="works"
          aria-labelledby="sc-works-title"
        >
          <div className="sc-section-heading">
            <h2 id="sc-works-title">
              认真做一些
              <br />
              小小的东西。
            </h2>
            <p>
              从「如果可以」开始，
              <br />
              把一个想法，做成可以使用的作品。
            </p>
          </div>
          <article className="sc-project sc-niul">
            <a
              className="sc-project-picture sc-niul-picture"
              href="https://github.com/molis-ai/niul.ai"
              target="_blank"
              rel="noreferrer"
              aria-label="查看 niul.ai 公开仓库"
            >
              <div className="sc-niul-speech">干完啦，到你了。</div>
              <img
                src="/images/products/niulai.png"
                alt="niul.ai 黄色桌面牛形象"
                width="192"
                height="192"
                loading="lazy"
              />
              <span className="sc-niul-shadow" />
            </a>
            <div className="sc-project-copy">
              <span className="sc-project-status">公开仓库</span>
              <h3>niul.ai</h3>
              <p className="sc-project-line">
                Agent 干完了，不会敲你。
                <br />
                牛会。
              </p>
              <p>
                一头趴在 Mac 桌面上的牛，替你留意 AI
                会话的进度。谁还在忙，谁在等你，不必再反复切窗口。
              </p>
              <a
                className="sc-text-link"
                href="https://github.com/molis-ai/niul.ai"
                target="_blank"
                rel="noreferrer"
              >
                去 GitHub 牵头牛
                <ArrowUpRight size={17} />
              </a>
            </div>
          </article>
          <article className="sc-project sc-artist">
            <a
              className="sc-project-picture sc-artist-picture"
              href="https://github.com/molis-ai/artist-skill"
              target="_blank"
              rel="noreferrer"
              aria-label="查看 Artist Skill 公开仓库"
            >
              <img
                src="/images/artists/monet-pond.jpg"
                alt="Artist Skill 的 AI 创作试样：雨后池塘、垂柳、睡莲与白椅"
                width="1440"
                height="960"
                loading="lazy"
              />
              <span>AI 创作试样</span>
            </a>
            <div className="sc-project-copy">
              <span className="sc-project-status">公开仓库</span>
              <h3>Artist Skill</h3>
              <p className="sc-project-line">
                换一种观察方式，
                <br />
                看见不一样的世界。
              </p>
              <p>
                从光、笔触、空间与构图出发，把艺术家的创作方法写成可使用的
                Skill。带上你自己的题目，看看它会长成什么样。
              </p>
              <a
                className="sc-text-link"
                href="https://github.com/molis-ai/artist-skill"
                target="_blank"
                rel="noreferrer"
              >
                探索创作方法
                <ArrowUpRight size={17} />
              </a>
            </div>
          </article>
          <article className="sc-project sc-drop">
            <a
              className="sc-project-picture sc-drop-picture"
              href="https://github.com/molis-ai/DropAgent"
              target="_blank"
              rel="noreferrer"
              aria-label="查看 DropAgent 公开仓库"
            >
              <div className="sc-drop-letter">
                <span />
                <span />
                <span />
                <span />
                <i />
              </div>
              <svg
                className="sc-drop-path"
                viewBox="0 0 220 160"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 20v45c0 30 18 44 45 44h130M176 92l17 17-17 17"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <div className="sc-drop-output">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </a>
            <div className="sc-project-copy">
              <span className="sc-project-status">公开下载 · 持续开发</span>
              <h3>DropAgent</h3>
              <p className="sc-project-line">
                把材料放下，
                <br />
                把结果带走。
              </p>
              <p>
                一个 Mac 菜单栏小托盘。把文件、网页或文字交给本地
                Agent，让它处理副本，再把结果带回手头的工作。
              </p>
              <a
                className="sc-text-link"
                href="https://github.com/molis-ai/DropAgent"
                target="_blank"
                rel="noreferrer"
              >
                查看使用说明
                <ArrowUpRight size={17} />
              </a>
            </div>
          </article>
          <Link
            className="sc-all-projects"
            href="/products"
            target="_blank"
            rel="noreferrer"
          >
            还有一些想法，正在慢慢成形。
            <span>
              看看其他作品
              <ArrowUpRight size={17} />
            </span>
          </Link>
        </section>

        <section
          className="sc-knowledge"
          id="knowledge"
          aria-labelledby="sc-knowledge-title"
        >
          <div className="sc-knowledge-inner">
            <div className="sc-knowledge-intro">
              <h2 id="sc-knowledge-title">
                把方法分享出来，
                <br />
                让下一次创造
                <br />
                更容易一点。
              </h2>
              <p>
                我们把试过的东西整理成小笔记。
                <br />
                看懂一个方法，带走一份提示词，
                <br />
                然后做出自己的版本。
              </p>
              <Link
                className="sc-text-link"
                href="/wiki"
                target="_blank"
                rel="noreferrer"
              >
                完整百科
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="sc-methods">
              {methods.map((method) => (
                <details className="sc-method" key={method.id}>
                  <summary>
                    <span>
                      <small>{method.note}</small>
                      <strong>{method.name}</strong>
                    </span>
                    <Plus size={21} />
                  </summary>
                  <div className="sc-method-content">
                    <p>{method.description}</p>
                    <div className="sc-method-actions">
                      <button
                        type="button"
                        onClick={() => copyPrompt(method.prompt, method.id)}
                      >
                        {copied === method.id ? (
                          <Check size={17} />
                        ) : (
                          <Copy size={17} />
                        )}
                        <span>
                          {copied === method.id ? '已复制提示词' : '复制提示词'}
                        </span>
                      </button>
                      <Link href={method.href} target="_blank" rel="noreferrer">
                        阅读原理
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>
                    {manualCopy === method.id && (
                      <div className="sc-manual-copy">
                        <p>可以在下方选中文字，手动复制。</p>
                        <textarea
                          aria-label={`${method.name}提示词`}
                          readOnly
                          value={method.prompt}
                        />
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          className="sc-people sc-section"
          id="people"
          aria-labelledby="sc-people-title"
        >
          <div className="sc-people-intro">
            <h2 id="sc-people-title">
              做东西的人，
              <br />
              也在认真想事情。
            </h2>
            <div>
              <p>
                我们关心 AI
                能做什么，也关心它把人带向哪里。做产品、写代码、分享还在形成的想法，是我们认识世界的方式。
              </p>
              <Link
                className="sc-text-link"
                href="/creators"
                target="_blank"
                rel="noreferrer"
              >
                认识创作者
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="sc-writing" id="perspectives">
            <Link href="/story/human-scale" target="_blank" rel="noreferrer">
              <div className="sc-writing-index" aria-hidden="true">
                人
              </div>
              <div>
                <span>一骏</span>
                <h3>
                  人的尺度：
                  <br />
                  理想主义在 AI 时代的生与死
                </h3>
                <p>关于机器与人，以及我们要把判断留在哪里。</p>
              </div>
              <ArrowUpRight size={22} />
            </Link>
            <Link href="/story/idealism" target="_blank" rel="noreferrer">
              <div className="sc-writing-index" aria-hidden="true">
                想
              </div>
              <div>
                <span>一骏</span>
                <h3>
                  落地主义：
                  <br />
                  一种不承认自己是哲学的哲学
                </h3>
                <p>先讲清楚这件事为什么值得存在，然后一笔一笔算账。</p>
              </div>
              <ArrowUpRight size={22} />
            </Link>
          </div>
        </section>

        <section className="sc-join" id="join" aria-labelledby="sc-join-title">
          <h2 id="sc-join-title">
            你的好奇心，
            <br />
            在这里有个位置。
          </h2>
          <p>
            用一下我们的作品，问一个具体的问题，
            <br />
            或者贡献一次小小的改进。一起创造，从这里开始。
          </p>
          <a
            href="https://github.com/molis-ai"
            target="_blank"
            rel="noreferrer"
            className="sc-join-button"
          >
            在 GitHub 参与
            <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <footer className="sc-footer">
        <a className="sc-footer-brand" href="#main">
          Molis AI<span>始终好奇，持续创造。</span>
        </a>
        <div>
          <Link href="/wiki" target="_blank" rel="noreferrer">
            百科
          </Link>
          <Link href="/products" target="_blank" rel="noreferrer">
            所有作品
          </Link>
          <Link href="/creators" target="_blank" rel="noreferrer">
            创作者
          </Link>
        </div>
        <span className="sc-copyright">© 2026 Molis AI</span>
      </footer>
    </div>
  );
}
