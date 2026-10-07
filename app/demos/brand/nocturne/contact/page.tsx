'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { contact } from '../../../../../content/studio';
import { useContactForm } from '../../use-contact-form';
import { Phrases } from '../kit';
import { Footer, HOME, SiteHeader, WORK, useNocturneMotion } from '../shared';
import '../nocturne.css';
import '../kit.css';
import './contact.css';

// 联系页：表单逻辑在 ../../use-contact-form.ts，五个方向共用；产品页的「关注进展」都指到这里。
// 目前不发邮件，也不开通账号。夜曲版：一道门里透出暖光，表单是一块发微光的玻璃。

export default function NocturneContactPage() {
  const rootRef = useNocturneMotion();
  const { role, setRole, idea, setIdea, busy, done, error, submit } =
    useContactForm();

  return (
    <div className="nc-site nc-contact" ref={rootRef}>
      <div className="nc-grain" aria-hidden="true" />
      <SiteHeader />

      <main id="main">
        <section
          className="nc-contact-stage"
          aria-labelledby="nc-contact-title"
        >
          <div className="nc-contact-intro">
            <span className="nc-kicker nc-rise">{contact.kicker}</span>
            <h1 id="nc-contact-title">
              {contact.title.map((line, index) => (
                <span
                  className="nc-line nc-rise"
                  key={line}
                  style={{ '--d': index + 1 } as React.CSSProperties}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p className="nc-rise" style={{ '--d': 3 } as React.CSSProperties}>
              {contact.lede}
            </p>
            <figure className="nc-threshold">
              <img
                src="/images/atelier/threshold.jpg"
                width="1440"
                height="900"
                alt=""
                fetchPriority="high"
              />
            </figure>
          </div>

          <div className="nc-contact-panel">
            {done ? (
              <div className="nc-success" aria-live="polite" aria-atomic="true">
                <span className="nc-success-mark">
                  <Check size={26} aria-hidden="true" />
                </span>
                <h2>{contact.success.title}</h2>
                <p>{contact.success.text}</p>
                <div className="nc-actions">
                  <Link className="nc-btn nc-btn-primary" href={HOME}>
                    {contact.successActions.home}
                  </Link>
                  <Link className="nc-btn nc-btn-ghost" href={WORK}>
                    {contact.successActions.work}
                  </Link>
                </div>
              </div>
            ) : (
              <form className="nc-form" onSubmit={submit}>
                <fieldset className="nc-roles">
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
                <div className="nc-row">
                  <label className="nc-entry">
                    <span>{contact.fields.name}</span>
                    <input
                      name="name"
                      required
                      maxLength={40}
                      autoComplete="name"
                    />
                  </label>
                  <label className="nc-entry">
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
                <label className="nc-entry">
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
                <label className="nc-consent">
                  <input type="checkbox" name="consent" required />
                  <span>{contact.consent}</span>
                </label>
                <button
                  className="nc-btn nc-btn-primary nc-submit"
                  disabled={busy}
                >
                  {busy ? contact.sending : contact.submit}
                </button>
                <p role="alert" className="nc-error">
                  {error}
                </p>
                <p className="nc-form-note">
                  {contact.note}
                  <a href="#privacy">{contact.privacyTitle}</a>
                </p>
              </form>
            )}
          </div>
        </section>

        <section
          id="privacy"
          className="nc-privacy"
          aria-labelledby="nc-privacy-title"
        >
          <h2 id="nc-privacy-title">
            <Phrases text={contact.privacyTitle} />
          </h2>
          <ol>
            {contact.privacy.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
