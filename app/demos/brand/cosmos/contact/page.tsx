'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { contact } from '../../../../../content/studio';
import { useContactForm } from '../../use-contact-form';
import { Ledger, Phrases, Stars } from '../kit';
import { Footer, HOME, SiteHeader, WORK, useReveal } from '../shared';
import '../cosmos.css';
import '../kit.css';
import './contact.css';

// 联系页：表单逻辑在 ../../use-contact-form.ts，五个方向共用；产品页的「关注进展」都指到这里。
// 目前不发邮件，也不开通账号。

export default function CosmosContactPage() {
  const siteRef = useReveal();
  const { role, setRole, idea, setIdea, busy, done, error, submit } =
    useContactForm();

  return (
    <div className="cs-site cs-contact" ref={siteRef}>
      <SiteHeader />

      <main id="main">
        <section className="cs-contact-main" aria-labelledby="cs-contact-title">
          <Stars />
          <div className="cs-contact-intro">
            <span className="cs-eyebrow">{contact.kicker}</span>
            <h1 id="cs-contact-title">
              {contact.title.map((line) => (
                <span className="cs-phrase" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p>{contact.lede}</p>
            <div className="cs-contact-port" aria-hidden="true">
              <img
                src="/images/atelier/threshold.jpg"
                width={1440}
                height={900}
                alt=""
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="cs-contact-panel">
            {done ? (
              <div
                className="cs-contact-success"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="cs-contact-check">
                  <Check size={30} aria-hidden="true" />
                </span>
                <h2>{contact.success.title}</h2>
                <p>{contact.success.text}</p>
                <div className="cs-actions">
                  <Link className="cs-button cs-button-primary" href={HOME}>
                    {contact.successActions.home}
                  </Link>
                  <Link className="cs-button" href={WORK}>
                    {contact.successActions.work}
                  </Link>
                </div>
              </div>
            ) : (
              <form className="cs-contact-form" onSubmit={submit}>
                <fieldset className="cs-contact-roles">
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
                <div className="cs-contact-row">
                  <label className="cs-contact-field">
                    <span>{contact.fields.name}</span>
                    <input
                      name="name"
                      required
                      maxLength={40}
                      autoComplete="name"
                    />
                  </label>
                  <label className="cs-contact-field">
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
                <label className="cs-contact-field">
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
                <label className="cs-contact-consent">
                  <input type="checkbox" name="consent" required />
                  <span>{contact.consent}</span>
                </label>
                <button
                  className="cs-button cs-button-primary cs-contact-submit"
                  disabled={busy}
                >
                  {busy ? contact.sending : contact.submit}
                </button>
                <p role="alert" className="cs-contact-error">
                  {error}
                </p>
                <p className="cs-contact-note">
                  {contact.note}
                  <a href="#privacy">{contact.privacyTitle}</a>
                </p>
              </form>
            )}
          </div>
        </section>

        <section
          id="privacy"
          className="cs-section cs-contact-privacy"
          aria-labelledby="cs-privacy-title"
        >
          <div className="cs-split">
            <div className="cs-head cs-reveal" data-align="start">
              <h2 id="cs-privacy-title">
                <Phrases text={contact.privacyTitle} />
              </h2>
            </div>
            <Ledger items={contact.privacy.map((title) => ({ title }))} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
