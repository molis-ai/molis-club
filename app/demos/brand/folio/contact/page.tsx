'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { contact } from '../../../../../content/studio';
import { useContactForm } from '../../use-contact-form';
import { CoverArt } from '../art';
import { Phrases, pad } from '../kit';
import { Footer, HOME, SiteHeader, WORK, useFolioMotion } from '../shared';
import '../folio.css';
import '../kit.css';
import './contact.css';

// 联系页：表单逻辑在 ../../use-contact-form.ts，五个方向共用；产品页的「关注进展」都指到这里。
// 目前不发邮件，也不开通账号。

export default function FolioContactPage() {
  const rootRef = useFolioMotion();
  const { role, setRole, idea, setIdea, busy, done, error, submit } =
    useContactForm();

  return (
    <div className="fo-site fc-site" ref={rootRef}>
      <SiteHeader />

      <main id="main">
        <section className="fc-contact" aria-labelledby="fc-title">
          <div className="fc-intro">
            <span className="fo-kicker">{contact.kicker}</span>
            <h1 id="fc-title">
              {contact.title.map((line) => (
                <span className="fo-phrase" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p>{contact.lede}</p>
            <div className="fc-art" aria-hidden="true">
              <CoverArt />
            </div>
          </div>

          <div className="fc-panel">
            {done ? (
              <div className="fc-success" aria-live="polite" aria-atomic="true">
                <span className="fc-success-mark" aria-hidden="true">
                  <Check size={34} strokeWidth={3} />
                </span>
                <h2>{contact.success.title}</h2>
                <p>{contact.success.text}</p>
                <div className="fo-actions">
                  <Link className="fo-btn fo-btn-ink" href={HOME}>
                    {contact.successActions.home}
                  </Link>
                  <Link className="fo-btn fo-btn-ghost" href={WORK}>
                    {contact.successActions.work}
                  </Link>
                </div>
              </div>
            ) : (
              <form className="fc-form" onSubmit={submit}>
                <fieldset className="fc-roles">
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
                <div className="fc-row">
                  <label className="fc-field">
                    <span>{contact.fields.name}</span>
                    <input
                      name="name"
                      required
                      maxLength={40}
                      autoComplete="name"
                    />
                  </label>
                  <label className="fc-field">
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
                <label className="fc-field">
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
                <label className="fc-consent">
                  <input type="checkbox" name="consent" required />
                  <span>{contact.consent}</span>
                </label>
                <button className="fo-btn fo-btn-ink fc-submit" disabled={busy}>
                  {busy ? contact.sending : contact.submit}
                </button>
                <p role="alert" className="fc-error">
                  {error}
                </p>
                <p className="fc-note">
                  {contact.note}
                  <a href="#privacy">{contact.privacyTitle}</a>
                </p>
              </form>
            )}
          </div>
        </section>

        <section
          id="privacy"
          className="fo-section fc-privacy"
          data-bg="white"
          aria-labelledby="fc-privacy-title"
        >
          <div className="fo-split">
            <h2 id="fc-privacy-title">
              <Phrases text={contact.privacyTitle} />
            </h2>
            <ol className="fo-list">
              {contact.privacy.map((item, index) => (
                <li key={item}>
                  <span className="fo-index">{pad(index)}</span>
                  <strong>{item}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer tone="paper" />
    </div>
  );
}
