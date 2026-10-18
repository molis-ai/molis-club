import { pageMetadata } from '../../../lib/site';
import { contactPage } from '../../../content/site/contact';
import { ContactForm } from '../../_site/contact-form';
import { CONTACT, PRIVACY } from '../../_site/routes';
import { More, Phrases, Window, type Vars } from '../../_site/ui';
import './contact.css';

const c = contactPage;

export const metadata = pageMetadata(c.title, c.description, CONTACT);

// 联系：左边一扇竖窗（白展厅里有人穿过门洞），下面是处理说明；右边标题和表单。
// 地址栏 ?topic= 预选来意（见 content/site/contact.ts），提交后给「回到来处」的路。
// 处理方式照实写：存进团队私密收件箱，不公开，目前不会自动回信。
// 桌面首屏只放联系这一件事（负责人 2026-10-18 验收）；排法见 contact.css。
export default function ContactPage() {
  return (
    <div className="m-contact m-wrap">
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
        <aside className="m-contact-note" aria-labelledby="contact-note-title">
          <h2 id="contact-note-title" className="m-kicker">
            {c.handlingTitle}
          </h2>
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
      <div className="m-contact-main">
        <header className="m-contact-head">
          <h1
            className="m-contact-title"
            data-reveal
            style={{ '--delay': '80ms' } as Vars}
          >
            <Phrases text={c.heading} />
          </h1>
        </header>
        <div
          className="m-contact-form"
          data-reveal
          style={{ '--delay': '220ms' } as Vars}
        >
          <ContactForm idPrefix="contact" />
        </div>
      </div>
    </div>
  );
}
