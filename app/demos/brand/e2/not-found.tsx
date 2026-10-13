'use client';
import { HOME } from './routes';
import { Actions, E2Page } from './shell';
import './missing.css';

// E2 的 404：图纸上的「缺页」——一张空白图框，编号写着 404
export default function E2NotFound() {
  return (
    <E2Page className="em" compactFooter>
      <section className="em-missing" aria-labelledby="em-title">
        <div className="em-sheet" aria-hidden="true">
          <span className="em-sheet-no" lang="en">
            Sheet 404
          </span>
          <span className="em-sheet-mark">404</span>
          <span className="em-sheet-foot">
            <span>Molis AI</span>
            <span>—</span>
          </span>
        </div>
        <div className="em-copy">
          <h1 id="em-title">这里还没长出东西。</h1>
          <p>这个页面不存在，或者已经换了地方。</p>
          <Actions
            items={[
              { label: '回到首页', href: HOME },
              {
                label: '看看我们的产品',
                href: `${HOME}#products`,
                tone: 'text',
              },
            ]}
          />
        </div>
      </section>
    </E2Page>
  );
}
