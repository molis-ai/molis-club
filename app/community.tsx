import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
              A curious mind.
              <br />
              <em>A human touch.</em>
            </h1>
            <div className="entrance-summary">
              <p className="entrance-introduction">
                Molis AI，一间与 AI 一起创作的工作室。
                <br />
                做产品，也分享创作的方法。
              </p>
              <Link className="entrance-action" href="/products">
                <span>探索作品</span>
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>
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
