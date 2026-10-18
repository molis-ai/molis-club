import { pageMetadata } from '../../../lib/site';
import { contactPage } from '../../../content/site/contact';
import { ContactForm } from '../../_site/contact-form';
import { ReviewSwitch } from '../../_site/review/comparison';
import { CONTACT, PRIVACY } from '../../_site/routes';
import { More, Phrases, Window, type Vars } from '../../_site/ui';
import './contact.css';
import './contact-compact.css';

const c = contactPage;

export const metadata = pageMetadata(c.title, c.description, CONTACT);

// 联系：左边一扇竖窗（白展厅里有人穿过门洞），右边表单。地址栏 ?topic= 预选来意（见 content/site/contact.ts），
// 提交后给「回到来处」的路。处理方式照实写：存进团队私密收件箱，不公开，目前不会自动回信。
// 桌面默认是紧凑版（负责人 2026-10-18 切成默认）：门洞、处理方式在左，标题与整张表在右，连页尾一屏放下；
// 低于 1100px 照旧自然排列，窄屏上顺序是：标题 → 门洞（裁成横幅）→ 表单 → 处理方式。
// ?study=current 暂留旧版作对照，负责人看过后连同 contact.css 里只给旧版用的部分一起删。
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ study?: string; topic?: string }>;
}) {
  const { study, topic } = await searchParams;
  const current = study === 'current';
  const review = current || study === 'compact';
  const topicQuery = topic ? `topic=${encodeURIComponent(topic)}` : '';
  const handling = (
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
  );
  return (
    <div
      className="m-contact m-wrap m-top"
      data-study={current ? 'current' : undefined}
    >
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
        {current ? null : handling}
        {review ? (
          <div className="m-contact-review">
            <ReviewSwitch
              label="联系页"
              names={['旧版', '默认']}
              variant={current ? 'current' : 'sample'}
              currentHref={`${CONTACT}?study=current${topicQuery && `&${topicQuery}`}`}
              sampleHref={`${CONTACT}${topicQuery && `?${topicQuery}`}`}
            />
          </div>
        ) : null}
      </div>
      <div className="m-contact-main">
        <header className="m-contact-head">
          {current ? (
            <p className="m-kicker" data-reveal>
              {c.kicker}
            </p>
          ) : null}
          <h1
            className="m-contact-title"
            data-reveal
            style={{ '--delay': '80ms' } as Vars}
          >
            <Phrases text={c.heading} />
          </h1>
          {current ? (
            <p
              className="m-contact-lead"
              data-reveal
              style={{ '--delay': '160ms' } as Vars}
            >
              {c.lead}
            </p>
          ) : null}
        </header>
        <div
          className="m-contact-form"
          data-reveal
          style={{ '--delay': '220ms' } as Vars}
        >
          <ContactForm idPrefix="contact" />
        </div>
        {current ? handling : null}
      </div>
    </div>
  );
}
