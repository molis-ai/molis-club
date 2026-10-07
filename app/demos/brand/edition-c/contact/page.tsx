'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { contact } from '../../../../../content/studio';
import { Phrases } from '../kit';
import { Footer, HOME, SiteHeader, WORK } from '../shared';
import '../edition-c.css';
import '../kit.css';
import './contact.css';

// 联系页：表单沿用 /api/join，存进团队的私密收件箱；「企业合作」是新增的方向。
// 地址栏的 ?topic= 预填方向和内容，产品页的「关注进展」都指到这里。目前不发邮件，也不开通账号。

export default function EditionCContactPage() {
  const [role, setRole] = useState<string>(contact.roles[0]);
  const [idea, setIdea] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get('topic');
    const preset = topic ? contact.topics[topic] : undefined;
    if (!preset) return;
    queueMicrotask(() => {
      setRole(preset.role);
      setIdea(preset.idea);
    });
  }, []);

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          role,
          idea,
          consent: data.get('consent') === 'on',
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error);
      setDone(true);
    } catch (caught) {
      setError(
        caught instanceof Error && caught.message
          ? caught.message
          : '这次没能发出去，请稍后再试。',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ec-site ek-site">
      <SiteHeader tone="paper" />

      <main id="main" className="ek-main">
        <section className="ek-contact" aria-labelledby="ek-title">
          <div className="ek-intro">
            <span className="ec-eyebrow">{contact.kicker}</span>
            <h1 id="ek-title">
              {contact.title.map((line) => (
                <span className="ec-phrase" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p>{contact.lede}</p>
            <img
              src="/images/atelier/threshold.jpg"
              width={1440}
              height={960}
              alt=""
              fetchPriority="high"
            />
          </div>

          <div className="ek-panel">
            {done ? (
              <div className="ek-success" aria-live="polite" aria-atomic="true">
                <Check size={34} aria-hidden="true" />
                <h2>{contact.success.title}</h2>
                <p>{contact.success.text}</p>
                <div className="ep-actions">
                  <Link className="ec-button" href={HOME}>
                    回到 Molis AI
                  </Link>
                  <Link className="ec-button ec-button-light" href={WORK}>
                    看看 Molis Work
                  </Link>
                </div>
              </div>
            ) : (
              <form className="ek-form" onSubmit={submit}>
                <fieldset className="ek-roles">
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
                <div className="ek-row">
                  <label className="ek-field">
                    <span>{contact.fields.name}</span>
                    <input
                      name="name"
                      required
                      maxLength={40}
                      autoComplete="name"
                    />
                  </label>
                  <label className="ek-field">
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
                <label className="ek-field">
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
                <label className="ek-consent">
                  <input type="checkbox" name="consent" required />
                  <span>{contact.consent}</span>
                </label>
                <button className="ec-button ek-submit" disabled={busy}>
                  {busy ? contact.sending : contact.submit}
                </button>
                <p role="alert" className="ek-error">
                  {error}
                </p>
                <p className="ek-note">
                  {contact.note}
                  <a href="#privacy">{contact.privacyTitle}</a>
                </p>
              </form>
            )}
          </div>
        </section>

        <section
          id="privacy"
          className="ek-privacy"
          aria-labelledby="ek-privacy-title"
        >
          <h2 id="ek-privacy-title">
            <Phrases text={contact.privacyTitle} />
          </h2>
          <ul>
            {contact.privacy.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
