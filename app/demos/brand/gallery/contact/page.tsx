'use client';
import { Check } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { folioContact } from '../../../../../content/folio';
import { contact } from '../../../../../content/studio';
import { useContactForm } from '../../use-contact-form';
import { Btn, Phrases, Shell, type Vars } from '../kit';
import { COMMUNITY, HOME, SOLUTIONS, productHref, productIds } from '../routes';
import './contact.css';

// 联系页：美术馆的前台。墙上一盏吊灯，柜台上一本访客留言簿，表单就是留言簿的一页；
// 写字时灯会亮一点。表单逻辑在 ../../use-contact-form.ts，与 Folio 共用；地址栏 ?topic= 预选来意。
// 目前不发邮件，也不开通账号。提交成功后按 topic 给回去的路。

/** 提交成功后的第一个按钮：回到访客来的那一页；没有 topic 时不给，只留「回到首页」 */
function backTo(topic: string | null) {
  const { back } = folioContact;
  if (!topic) return null;
  if (topic === 'enterprise')
    return { label: back.enterprise, href: SOLUTIONS };
  if (topic === 'feedback' || topic === 'creator' || topic.startsWith('share-'))
    return { label: back.community, href: COMMUNITY };
  const product = productIds.find((id) => id === topic);
  return product ? { label: back[product], href: productHref[product] } : null;
}

const pad = (index: number) => String(index + 1).padStart(2, '0');

export default function GalleryContactPage() {
  const { role, setRole, idea, setIdea, topic, busy, done, error, submit } =
    useContactForm();
  const back = backTo(topic);
  // 分享类投稿：提示贴链接，另给一个「同意展示」，和「同意联系」分开
  const sharing = topic === 'creator' || Boolean(topic?.startsWith('share-'));
  const doneTitle = useRef<HTMLHeadingElement>(null);

  // 留言簿换成「收到了」那一页时，把焦点移到标题上，读屏和键盘都从这里继续
  useEffect(() => {
    if (done) doneTitle.current?.focus();
  }, [done]);

  return (
    <Shell current="contact">
      <section className="g-contact" aria-labelledby="g-contact-title">
        <div className="g-contact-desk">
          {/* 前台的墙：一盏吊灯，柜台和桌上的小立牌都是装饰 */}
          <span className="g-contact-lamp" aria-hidden="true">
            <i className="g-contact-lamp-cord" />
            <i className="g-contact-lamp-shade" />
          </span>
          <span className="g-contact-glow" aria-hidden="true" />
          <span className="g-contact-counter" aria-hidden="true">
            <i className="g-contact-counter-top" />
            <i className="g-contact-counter-front" />
          </span>
          <span className="g-contact-sign" aria-hidden="true">
            <span lang="en">Information</span>
          </span>

          <div className="g-contact-intro">
            <p className="g-contact-kicker" data-reveal>
              <span className="g-soft" lang="en" aria-hidden="true">
                Front desk
              </span>
              <span>{contact.kicker}</span>
            </p>
            <h1
              id="g-contact-title"
              className="g-contact-title"
              data-reveal
              style={{ '--delay': '80ms' } as Vars}
            >
              {contact.title.map((line) => (
                <span className="g-phrase" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p
              className="g-contact-lede"
              data-reveal
              style={{ '--delay': '160ms' } as Vars}
            >
              <Phrases text={contact.lede} />
            </p>
          </div>

          <div
            className="g-contact-book"
            data-reveal
            data-done={done}
            style={{ '--delay': '220ms' } as Vars}
          >
            <p className="g-contact-book-head" aria-hidden="true">
              <span className="g-soft" lang="en">
                Visitors’ book
              </span>
              <span lang="en">Molis AI</span>
            </p>

            {done ? (
              <div
                className="g-contact-done"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="g-contact-stamp" aria-hidden="true">
                  <Check size={30} strokeWidth={2.4} />
                </span>
                <h2 ref={doneTitle} tabIndex={-1}>
                  {contact.success.title}
                </h2>
                <p>{contact.success.text}</p>
                <div className="g-contact-done-actions">
                  {back ? <Btn href={back.href}>{back.label}</Btn> : null}
                  <Btn href={HOME} tone={back ? 'ghost' : 'ink'}>
                    {folioContact.home}
                  </Btn>
                </div>
              </div>
            ) : (
              <form className="g-contact-form" onSubmit={submit}>
                <fieldset className="g-contact-roles">
                  <legend>{contact.roleLabel}</legend>
                  <div className="g-contact-role-list">
                    {contact.roles.map((item) => (
                      <label key={item} className="g-contact-role">
                        <input
                          type="radio"
                          name="role"
                          value={item}
                          checked={role === item}
                          onChange={() => setRole(item)}
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="g-contact-pair">
                  <div className="g-contact-field">
                    <label htmlFor="g-contact-name">
                      {contact.fields.name}
                    </label>
                    <input
                      id="g-contact-name"
                      name="name"
                      required
                      maxLength={40}
                      autoComplete="name"
                    />
                  </div>
                  <div className="g-contact-field">
                    <label htmlFor="g-contact-email">
                      {contact.fields.email}
                    </label>
                    <input
                      id="g-contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="g-contact-field g-contact-field-idea">
                  <label htmlFor="g-contact-idea">{contact.fields.idea}</label>
                  <textarea
                    id="g-contact-idea"
                    name="idea"
                    required
                    minLength={5}
                    maxLength={1200}
                    rows={5}
                    value={idea}
                    onChange={(event) => setIdea(event.target.value)}
                    placeholder={contact.fields.ideaPlaceholder}
                    aria-describedby={
                      sharing ? 'g-contact-share-hint' : undefined
                    }
                  />
                  {sharing ? (
                    <small className="g-contact-hint" id="g-contact-share-hint">
                      {folioContact.shareHint}
                    </small>
                  ) : null}
                </div>

                <div className="g-contact-checks">
                  <label className="g-contact-check">
                    <input type="checkbox" name="consent" required />
                    <span>{contact.consent}</span>
                  </label>
                  {sharing ? (
                    <label className="g-contact-check">
                      <input type="checkbox" name="allowDisplay" />
                      <span>{folioContact.allowDisplay}</span>
                    </label>
                  ) : null}
                </div>

                <div className="g-contact-send">
                  <button className="g-contact-submit" disabled={busy}>
                    {busy ? contact.sending : contact.submit}
                  </button>
                  <p role="alert" className="g-contact-error">
                    {error}
                  </p>
                </div>
                <p className="g-contact-note">
                  {contact.note}
                  <a href="#privacy">{contact.privacyTitle}</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 隐私说明：像前台旁边的参观须知。整站页尾的「隐私」链接到这里（#privacy） */}
      <section
        id="privacy"
        className="g-contact-privacy"
        aria-labelledby="g-contact-privacy-title"
      >
        <header className="g-contact-privacy-head" data-reveal>
          <p className="g-soft" lang="en" aria-hidden="true">
            Visitor information
          </p>
          <h2 id="g-contact-privacy-title">
            <Phrases text={contact.privacyTitle} />
          </h2>
        </header>
        <ol className="g-contact-privacy-list">
          {contact.privacy.map((item, index) => (
            <li
              key={item}
              data-reveal
              style={{ '--delay': `${index * 90}ms` } as Vars}
            >
              <span className="g-soft" aria-hidden="true">
                {pad(index)}
              </span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>
    </Shell>
  );
}
