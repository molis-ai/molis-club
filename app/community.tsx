import Link from './edition-link';
import { Header, Footer } from './shell';
import StudioScene from './studio-scene';
import StudioWater from './studio-water';
import './studio-entrance.css';

export default function Community() {
  return (
    <div className="studio-home">
      <Header />
      <main id="main">
        <section
          className="studio-water-scene"
          aria-label="Molis AI 创作工作室"
        >
          <StudioWater />
          <div className="water-introduction">
            <p>一间与 AI 一起创作的工作室。</p>
            <p>做产品，也分享创作的方法。</p>
            <Link className="entrance-action" href="/products">
              探索作品
            </Link>
          </div>
          <h1 className="water-wordmark">Molis AI</h1>
        </section>
        <StudioScene>
          <div className="entrance-summary">
            <p className="entrance-introduction">
              <em>A curious mind. A human touch.</em>
            </p>
            <span>让好奇，成为作品。</span>
          </div>
        </StudioScene>
      </main>
      <Footer />
    </div>
  );
}
