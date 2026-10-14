import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMetadata, siteUrl } from '../../../lib/site';
import { privacy } from '../../../content/site/privacy';
import { CONTACT, PRIVACY } from '../../_site/routes';
import { pad, Phrases, type Vars } from '../../_site/ui';
import './privacy.css';

export const metadata = pageMetadata(
  privacy.kicker,
  `${privacy.title}${privacy.lead}`,
  PRIVACY,
);

// 隐私说明：阅读版式（阅读栏 40rem、--t-read 字号、行距 2），节号挂在左边。
// 只写现在真的会发生的事；核对依据写在 content/site/privacy.ts 开头。打印时链接后面写出完整地址。
export default function PrivacyPage() {
  return (
    <article className="m-privacy">
      <header className="m-wrap m-top m-privacy-head">
        <p className="m-head-meta m-rise">
          <span className="m-kicker">{privacy.kicker}</span>
        </p>
        <h1 className="m-rise" style={{ '--delay': '80ms' } as Vars}>
          <Phrases text={privacy.title} />
        </h1>
        <p
          className="m-privacy-lead m-rise"
          style={{ '--delay': '160ms' } as Vars}
        >
          {privacy.lead}
        </p>
      </header>

      <div className="m-wrap m-privacy-body">
        {privacy.sections.map((section, index) => {
          const id = `privacy-${index + 1}`;
          return (
            <section key={section.title} aria-labelledby={id}>
              <span className="m-privacy-no num" aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h2 id={id}>{section.title}</h2>
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.link ? (
                <p>
                  <Link
                    className="m-link"
                    data-dir="right"
                    href={CONTACT}
                    data-url={`${siteUrl}${CONTACT}`}
                  >
                    {section.link}
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </article>
  );
}
