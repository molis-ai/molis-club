import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { Header } from './shell';
import StudioScene from './studio-scene';
import './studio-entrance.css';

export default function Community() {
  return (
    <div className="studio-home">
      <Header />
      <main id="main">
        <StudioScene>
          <div className="entrance-copy">
            <h1>
              把一点好奇，
              <br />
              做成真实的作品<span>。</span>
            </h1>
            <p className="entrance-english">
              <em>
                A curious mind.
                <br /> A human touch.
              </em>
            </p>
            <div className="entrance-introduction">
              <p>
                我们是 Molis AI，
                <br className="entrance-mobile-break" />
                一间与 AI 一起创作的工作室。
              </p>
              <p>
                做轻巧的工具、可玩的体验，
                <br />
                也分享做它们的方法。
              </p>
            </div>
            <div className="entrance-paths">
              <Link className="entrance-action" href="/products">
                <span>探索作品</span>
                <ArrowUpRight size={21} />
              </Link>
              <Link className="entrance-about" href="/community/adeptify">
                认识我们 <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <p className="entrance-art-note">
            <span>Curiosity takes shape.</span>
            <em>想法，在来回之间生长。</em>
          </p>
        </StudioScene>
      </main>
      <footer className="entrance-footer">
        <span>© 2026 Molis AI</span>
        <Link href="/join">
          有个想法？一起聊聊 <ArrowUpRight size={15} />
        </Link>
        <Link href="/privacy">隐私说明</Link>
      </footer>
    </div>
  );
}
