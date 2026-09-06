import Link from 'next/link';
import { Header, Footer } from './shell';
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="not-found">
        <h1>这里还没长出东西。</h1>
        <p>这个页面不存在，或作品还没有搬过来。</p>
        <Link className="button primary" href="/">
          回到烤个梨呀
        </Link>
      </main>
      <Footer />
    </>
  );
}
