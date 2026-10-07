'use client';
import { Check } from 'lucide-react';
import { contact } from '../../../../../content/studio';
import { useContactForm } from '../../use-contact-form';
import { Actions } from '../kit';
import {
  Footer,
  HOME,
  LeafShadow,
  MaskLines,
  Phrases,
  SiteHeader,
  WORK,
  useDaylight,
  type Vars,
} from '../shared';
import '../daylight.css';
import '../kit.css';
import './contact.css';

// 联系页：表单逻辑在 ../../use-contact-form.ts，五个方向共用；产品页的「关注进展」都指到这里。
// 左边是一面晒着太阳的墙和一道门，右边是一张纸色的信笺。目前不发邮件，也不开通账号。

export default function DaylightContactPage() {
  const siteRef = useDaylight();
  const { role, setRole, idea, setIdea, busy, done, error, submit } =
    useContactForm();

  return (
    <div className="dl-site dl-contact" ref={siteRef}>
      <SiteHeader />

      <main id="main">
        <section className="dl-contact-room" aria-labelledby="dl-contact-title">
          <div className="dl-contact-intro">
            <div className="dl-contact-sun" aria-hidden="true" />
            <LeafShadow className="dl-leaves dl-contact-leaves" />
            <span className="dl-eyebrow">{contact.kicker}</span>
            <h1 id="dl-contact-title" className="dl-reveal">
              <MaskLines lines={contact.title} />
            </h1>
            <p>{contact.lede}</p>
            <div className="dl-contact-photo">
              <img
                src="/images/atelier/threshold.jpg"
                width={1440}
                height={900}
                alt=""
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="dl-contact-panel">
            {done ? (
              <div
                className="dl-contact-success"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="dl-contact-check">
                  <Check size={26} aria-hidden="true" />
                </span>
                <h2>{contact.success.title}</h2>
                <p>{contact.success.text}</p>
                <Actions
                  items={[
                    { label: contact.successActions.home, href: HOME },
                    {
                      label: contact.successActions.work,
                      href: WORK,
                      tone: 'line',
                    },
                  ]}
                />
              </div>
            ) : (
              <form className="dl-contact-form" onSubmit={submit}>
                <fieldset className="dl-contact-roles">
                  <legend>{contact.roleLabel}</legend>
                  {contact.roles.map((item) => (
                    <label key={item}>
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
                </fieldset>
                <div className="dl-contact-pair">
                  <label className="dl-contact-field">
                    <span>{contact.fields.name}</span>
                    <input
                      name="name"
                      required
                      maxLength={40}
                      autoComplete="name"
                    />
                  </label>
                  <label className="dl-contact-field">
                    <span>{contact.fields.email}</span>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
                <label className="dl-contact-field">
                  <span>{contact.fields.idea}</span>
                  <textarea
                    name="idea"
                    required
                    minLength={5}
                    maxLength={1200}
                    rows={6}
                    value={idea}
                    onChange={(event) => setIdea(event.target.value)}
                    placeholder={contact.fields.ideaPlaceholder}
                  />
                </label>
                <label className="dl-contact-consent">
                  <input type="checkbox" name="consent" required />
                  <span>{contact.consent}</span>
                </label>
                <div className="dl-contact-send">
                  <button className="dl-button dl-button-ink" disabled={busy}>
                    {busy ? contact.sending : contact.submit}
                  </button>
                  <p role="alert" className="dl-contact-error">
                    {error}
                  </p>
                </div>
                <p className="dl-contact-note">
                  {contact.note}
                  <a href="#privacy">{contact.privacyTitle}</a>
                </p>
              </form>
            )}
          </div>
        </section>

        <section
          id="privacy"
          className="dl-contact-privacy"
          aria-labelledby="dl-privacy-title"
        >
          <h2 id="dl-privacy-title">
            <Phrases text={contact.privacyTitle} />
          </h2>
          <ul>
            {contact.privacy.map((item, index) => (
              <li
                key={item}
                className="dl-reveal"
                style={{ '--r': index } as Vars}
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
