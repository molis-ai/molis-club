'use client';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { folioContact } from '../../../../../content/folio';
import { contact } from '../../../../../content/studio';
import { useContactForm } from '../../use-contact-form';
import { Box, Callout, Face, Line } from '../axo';
import {
  COMMUNITY,
  HOME,
  SOLUTIONS,
  pad,
  productHref,
  productIds,
} from '../routes';
import {
  Button,
  E2Page,
  Kicker,
  Plate,
  SectionHead,
  type Vars,
} from '../shell';
import './contact.css';

// E2 联系：表单为主的一页。左边说清能聊什么、表单交到哪里（私密收件箱，示意图），右边是编号的表单行；
// 提交成功后按地址栏的 topic 回到来处。表单逻辑沿用 ../../use-contact-form.ts（五个方向共用）。
// 目前不发邮件，也不开通账号，文案照 content/studio.ts 的 contact。页尾「隐私」链接指到本页 #privacy。
// 动效讲「你写的东西去了哪里」：每填好一行，行号变成勾、左边那张纸多写一行；提交成功，纸落进私密收件箱。

const IDEA_MAX = 1200;

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

/**
 * 私密收件箱：一张表悬在敞口的盒子上方。表上的四行对应表单的四行，填好一行就写上一行；
 * 提交成功后，这张表落进盒子里（只是示意，不代表数量）。盒子前面两面墙画在表后面，表才能落进去。
 */
function InboxDrawing({ progress, sent }: { progress: number; sent: boolean }) {
  const lines: [number, number][] = [
    [3.3, 6.4],
    [4.3, 8.2],
    [5.1, 8.2],
    [5.9, 6.8],
  ];
  return (
    <svg
      className="ec-drawing"
      viewBox="-9.5 -5.5 28 17"
      data-draw
      aria-hidden="true"
    >
      <g className="ec-d-tray">
        <Face
          tone="floor"
          p={[
            [0.5, 0.5, 0.3],
            [11.5, 0.5, 0.3],
            [11.5, 8.5, 0.3],
            [0.5, 8.5, 0.3],
          ]}
        />
        <Box at={[0, 0, 0]} size={[12, 0.5, 2.4]} top="cut" />
        <Box at={[0, 0, 0]} size={[0.5, 9, 2.4]} top="cut" />
      </g>
      <g className="ec-d-sheet" data-sent={sent || undefined}>
        <g className="ec-d-legs">
          <Line a={[3, 6.6, 4.9]} b={[3, 6.6, 3]} className="e2-faint" />
          <Line a={[9, 6.6, 4.9]} b={[9, 6.6, 3]} className="e2-faint" />
          <Line a={[9, 2.4, 4.9]} b={[9, 2.4, 3]} className="e2-faint" />
        </g>
        <Box at={[3, 2.4, 5.2]} size={[6, 4.2, 0.12]} />
        {lines.map(([y, end], index) => (
          <Line
            key={y}
            a={[3.8, y, 5.32]}
            b={[end, y, 5.32]}
            className={`ec-d-line${progress > index ? ' is-on' : ''}`}
          />
        ))}
        <Face
          tone="accent"
          p={[
            [7.3, 2.9, 5.32],
            [8.3, 2.9, 5.32],
            [8.3, 3.7, 5.32],
            [7.3, 3.7, 5.32],
          ]}
        />
      </g>
      <g className="ec-d-tray ec-d-front">
        <Box at={[0, 8.5, 0]} size={[12, 0.5, 2.4]} top="cut" />
        <Box at={[11.5, 0, 0]} size={[0.5, 9, 2.4]} top="cut" />
      </g>
      <g className="ec-d-callout">
        <Callout
          label="私密收件箱"
          from={[12, 4.5, 2.4]}
          to={[10.5, 1]}
          align="left"
        />
      </g>
    </svg>
  );
}

/** 一行填好了没有：行号变成勾 */
function RowNo({ n, done }: { n: number; done: boolean }) {
  return (
    <i aria-hidden="true" data-done={done || undefined}>
      {done ? <Check size={11} strokeWidth={3} /> : pad(n)}
    </i>
  );
}

export default function E2ContactPage() {
  const { role, setRole, idea, setIdea, topic, busy, done, error, submit } =
    useContactForm();
  const back = backTo(topic);
  // 分享类投稿：提示贴链接，另给一个「同意展示」，和「同意联系」分开
  const sharing = topic === 'creator' || Boolean(topic?.startsWith('share-'));
  const successTitle = useRef<HTMLHeadingElement>(null);
  // 名字和邮箱不受控，用输入时的校验结果记下「这一行好了没有」
  const [filled, setFilled] = useState({ name: false, email: false });
  const track =
    (key: 'name' | 'email') => (event: { currentTarget: HTMLInputElement }) => {
      const input = event.currentTarget;
      const ok = input.value.trim().length > 0 && input.validity.valid;
      setFilled((value) =>
        value[key] === ok ? value : { ...value, [key]: ok },
      );
    };
  const rows = [
    Boolean(role),
    filled.name,
    filled.email,
    idea.trim().length >= 5,
  ];
  const progress = rows.filter(Boolean).length;
  useEffect(() => {
    if (done) successTitle.current?.focus();
  }, [done]);

  return (
    <E2Page current="contact" className="ec" compactFooter>
      <section className="ec-contact" aria-labelledby="ec-title">
        <div className="ec-intro">
          <Kicker>{contact.kicker}</Kicker>
          <h1 id="ec-title">
            {contact.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="ec-lede">{contact.lede}</p>
          <div data-reveal className="ec-figure">
            <Plate
              fig="Fig. 01"
              caption={
                done
                  ? '已放进私密收件箱'
                  : progress
                    ? `表单 → 私密收件箱 · 已填 ${progress} / 4`
                    : '表单 → 私密收件箱'
              }
              note="示意"
              className="ec-plate"
            >
              <InboxDrawing progress={progress} sent={done} />
            </Plate>
          </div>
        </div>

        <div className="ec-panel">
          {done ? (
            <div className="ec-success" aria-live="polite" aria-atomic="true">
              <span className="ec-success-mark" aria-hidden="true">
                <Check size={26} strokeWidth={2} />
              </span>
              <h2 ref={successTitle} tabIndex={-1}>
                {contact.success.title}
              </h2>
              <p>{contact.success.text}</p>
              <div className="e2-actions">
                {back ? <Button label={back.label} href={back.href} /> : null}
                <Button
                  label={folioContact.home}
                  href={HOME}
                  tone={back ? 'ghost' : 'ink'}
                />
              </div>
            </div>
          ) : (
            <form
              className="ec-form"
              onSubmit={submit}
              style={{ '--done': progress / 4 } as Vars}
            >
              <div
                className="ec-row"
                role="radiogroup"
                aria-labelledby="ec-role-label"
              >
                <span className="ec-label" id="ec-role-label">
                  <RowNo n={0} done={rows[0]} />
                  {contact.roleLabel}
                </span>
                <div className="ec-roles">
                  {contact.roles.map((item) => (
                    <label key={item} className="ec-role">
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
              </div>
              <label className="ec-row e2-field">
                <span className="ec-label">
                  <RowNo n={1} done={rows[1]} />
                  {contact.fields.name}
                </span>
                <input
                  onInput={track('name')}
                  name="name"
                  required
                  maxLength={40}
                  autoComplete="name"
                />
              </label>
              <label className="ec-row e2-field">
                <span className="ec-label">
                  <RowNo n={2} done={rows[2]} />
                  {contact.fields.email}
                </span>
                <input
                  onInput={track('email')}
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>
              <div className="ec-row">
                <label className="ec-label" htmlFor="ec-idea">
                  <RowNo n={3} done={rows[3]} />
                  {contact.fields.idea}
                </label>
                <div className="ec-control e2-field">
                  <textarea
                    id="ec-idea"
                    name="idea"
                    required
                    minLength={5}
                    maxLength={IDEA_MAX}
                    rows={6}
                    value={idea}
                    onChange={(event) => setIdea(event.target.value)}
                    placeholder={contact.fields.ideaPlaceholder}
                    aria-describedby={sharing ? 'ec-share-hint' : undefined}
                  />
                  <div className="ec-under">
                    {sharing ? (
                      <small className="ec-hint" id="ec-share-hint">
                        {folioContact.shareHint}
                      </small>
                    ) : (
                      <span />
                    )}
                    <small className="ec-count" aria-hidden="true">
                      {idea.length} / {IDEA_MAX}
                    </small>
                  </div>
                </div>
              </div>
              <div className="ec-row ec-row-end">
                <span className="ec-label" aria-hidden="true" />
                <div className="ec-control">
                  <label className="ec-check">
                    <input type="checkbox" name="consent" required />
                    <span>{contact.consent}</span>
                  </label>
                  {sharing ? (
                    <label className="ec-check">
                      <input type="checkbox" name="allowDisplay" />
                      <span>{folioContact.allowDisplay}</span>
                    </label>
                  ) : null}
                  <div className="ec-submit-row">
                    <button
                      type="submit"
                      className="e2-button e2-button-ink"
                      disabled={busy}
                    >
                      {busy ? contact.sending : contact.submit}
                    </button>
                  </div>
                  <p role="alert" className="ec-error">
                    {error}
                  </p>
                  <p className="ec-note">
                    {contact.note}
                    <a href="#privacy">{contact.privacyTitle}</a>
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      <section
        id="privacy"
        className="ec-privacy"
        aria-labelledby="ec-privacy-title"
      >
        <SectionHead
          id="ec-privacy-title"
          title={contact.privacyTitle}
          layout="split"
        >
          <ol className="ec-privacy-list">
            {contact.privacy.map((item, index) => (
              <li key={item}>
                <i aria-hidden="true">{pad(index)}</i>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </SectionHead>
      </section>
    </E2Page>
  );
}
