import { pageMetadata } from '../../../lib/site';
import { contactPage } from '../../../content/site/contact';
import { ContactForm } from '../../_site/contact-form';
import { CONTACT, PRIVACY } from '../../_site/routes';
import { More, Phrases, Window, type Vars } from '../../_site/ui';
import './contact.css';

const c = contactPage;

export const metadata = pageMetadata(c.title, c.description, CONTACT);

// 联系：左边一扇竖窗（白展厅里有人穿过门洞），右边表单。地址栏 ?topic= 预选来意（见 content/site/contact.ts），
// 提交后给「回到来处」的路。处理方式照实写，并画成一条三步小图：你写下几句 → 存进团队私密收件箱，不公开 → 目前不会自动回信。
// 窄屏上顺序是：标题 → 门洞（裁成横幅）→ 表单 → 处理方式。
export default function ContactPage() {
  return (
    <div className="m-contact m-wrap m-top">
      <div className="m-contact-door">
        <Window
          name="contact-door"
          ratio="3 / 4"
          focus="62% 74%"
          sizes="(max-width: 900px) 100vw, 40vw"
          eager
          alt={c.alt}
          caption={<span lang="en">{c.caption}</span>}
        />
      </div>
      <div className="m-contact-main">
        <header className="m-contact-head">
          <p className="m-kicker" data-reveal>
            {c.kicker}
          </p>
          <h1
            className="m-contact-title"
            data-reveal
            style={{ '--delay': '80ms' } as Vars}
          >
            <Phrases text={c.heading} />
          </h1>
          <p
            className="m-contact-lead"
            data-reveal
            style={{ '--delay': '160ms' } as Vars}
          >
            {c.lead}
          </p>
        </header>
        <div
          className="m-contact-form"
          data-reveal
          style={{ '--delay': '220ms' } as Vars}
        >
          <ContactForm idPrefix="contact" />
        </div>
        <aside className="m-contact-note" aria-labelledby="contact-note-title">
          <h2 id="contact-note-title" className="m-kicker">
            {c.handlingTitle}
          </h2>
          <ol className="m-contact-flow" data-reveal>
            {c.flow.map((step, index) => (
              <li key={step} style={{ '--i': index } as Vars}>
                <span className="m-contact-flow-dot" aria-hidden="true" />
                {step}
              </li>
            ))}
          </ol>
          <ul>
            {c.handling.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            <More href={PRIVACY}>{c.privacy}</More>
          </p>
        </aside>
      </div>
    </div>
  );
}
