'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  useRef,
  useState,
  useSyncExternalStore,
  type SubmitEvent,
} from 'react';
import {
  followIdea,
  form,
  intents,
  topics,
  type Intent,
} from '../../content/site/contact';
import {
  productIds,
  products,
  type ProductId,
} from '../../content/site/products';
import { COMMUNITY, CONTACT, ENTERPRISE, HOME, productHref } from './routes';
import './contact-form.css';

// 联系表单：企业合作页（来意固定为企业合作）与联系页共用。
// 行为与旧联系页（app/demos/brand/use-contact-form.ts）一致，后端 /api/join 不改：
// - 每次打开表单是一次提交：第一次发送时生成提交 id，失败重试沿用它，服务端不会多存一行；
// - 后端只认四种 role，规格的五种来意在 content/site/contact.ts 里映射过去；
// - topic 只记从哪个入口来：地址栏 ?topic= 优先，没有时用来意的 slug；
// - 成功以 response.ok 且 status === 'received' 为准，失败显示服务端的话或一句兜底。
// 没有 JS 时表单发不出去：发送键保持不可用，并照实写一句（.js 下藏起来）。

const TOPIC = /^[a-z0-9][a-z0-9-]{0,39}$/;

/** 不支持 randomUUID 的环境（非安全上下文）不带 id，由服务端生成 */
const newSubmissionId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : undefined;

// 地址栏的 topic 在这一页里不会变；直接读，站内跳转进来的第一帧就是预选好的样子
const noSubscription = () => () => {};
const readTopic = () =>
  new URLSearchParams(window.location.search).get('topic');
const serverTopic = () => null;
// 水合之前（以及没有 JS）发送键不可用
const onClient = () => true;
const onServer = () => false;

/** 成功标题出现时把焦点移过去，读屏和键盘都从这里继续 */
const focusOnMount = (node: HTMLHeadingElement | null) => node?.focus();

function slugOf(intent: Intent, product: ProductId | null) {
  if (intent === 'follow') return product ? `follow-${product}` : 'follow';
  if (intent === 'share') return 'share';
  return intent;
}

/** 提交成功后「回到来处」：按入口回企业合作 / 社区 / 对应产品页；不知道从哪来就只给首页 */
function backTo(entry: string | null) {
  if (!entry) return null;
  if (entry === 'enterprise')
    return { href: ENTERPRISE, label: form.back.enterprise };
  if (entry === 'feedback' || entry === 'creator' || entry.startsWith('share'))
    return { href: COMMUNITY, label: form.back.community };
  const product = topics[entry]?.product;
  return product
    ? {
        href: productHref[product],
        label: form.back.product(products[product].name),
      }
    : null;
}

export function ContactForm({
  fixed,
  titleAs: Title = 'h2',
  idPrefix = 'cf',
}: {
  /** 固定的来意（企业合作页用）：不给选，也不读地址栏 */
  fixed?: Intent;
  /** 成功标题的层级：联系页是 h2，嵌在一节里时用 h3 */
  titleAs?: 'h2' | 'h3';
  idPrefix?: string;
}) {
  const path = usePathname() ?? CONTACT;
  const urlTopic = useSyncExternalStore(noSubscription, readTopic, serverTopic);
  const ready = useSyncExternalStore(noSubscription, onClient, onServer);
  // 入口：固定来意时就是它自己；否则是地址栏里合规的 topic
  const entry = fixed
    ? slugOf(fixed, null)
    : urlTopic && TOPIC.test(urlTopic)
      ? urlTopic
      : null;
  const preset = entry ? topics[entry] : undefined;

  // 访客自己选过、改过的以访客为准，没动过时用入口的预选与预填
  const [pickedIntent, setIntent] = useState<Intent | null>(null);
  const [pickedProduct, setProduct] = useState<ProductId | null>(null);
  const [typedIdea, setIdea] = useState<string | null>(null);
  const intent = fixed ?? pickedIntent ?? preset?.intent ?? null;
  const product = pickedProduct ?? preset?.product ?? null;
  const option = intents.find((item) => item.id === intent);
  const presetIdea =
    intent === 'follow'
      ? product
        ? followIdea(products[product].name)
        : ''
      : intent && intent === preset?.intent
        ? (preset.idea ?? '')
        : '';
  const idea = typedIdea ?? presetIdea;
  const sharing = intent === 'share';

  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const submission = useRef<string | undefined>(undefined);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!intent || !option) {
      setError(form.pickIntent);
      return;
    }
    if (intent === 'follow' && !product) {
      setError(form.pickProduct);
      return;
    }
    const data = new FormData(event.currentTarget);
    submission.current ??= newSubmissionId();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: submission.current,
          name: data.get('name'),
          email: data.get('email'),
          role: option.role,
          idea,
          topic: entry ?? slugOf(intent, product),
          consent: data.get('consent') === 'on',
          allowDisplay: sharing && data.get('allowDisplay') === 'on',
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        status?: string;
      } | null;
      if (!response.ok || result?.status !== 'received') {
        setError(result?.error || form.errorFallback);
        return;
      }
      setDone(true);
    } catch {
      setError(form.errorFallback);
    } finally {
      setBusy(false);
    }
  }

  const id = (name: string) => `${idPrefix}-${name}`;

  if (done) {
    const back = backTo(entry);
    return (
      <div className="m-form-done" aria-live="polite">
        <Title className="m-form-done-title" ref={focusOnMount} tabIndex={-1}>
          {form.success.title}
        </Title>
        <p className="m-form-done-text">{form.success.text}</p>
        <p className="m-actions">
          {back && back.href !== path ? (
            <Link className="m-btn" href={back.href}>
              {back.label}
            </Link>
          ) : null}
          <Link
            className={back && back.href !== path ? 'm-link' : 'm-btn'}
            href={HOME}
          >
            {form.back.home}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form
      className="m-form"
      method="post"
      onSubmit={submit}
      aria-describedby={id('handling')}
    >
      {fixed ? (
        <p className="m-form-fixed">
          <span className="m-form-label">{form.fixedLabel}</span>
          <span className="m-form-chip" data-on>
            <span>{option?.label}</span>
          </span>
          <Link className="m-link" href={CONTACT} data-dir="right">
            {form.elsewhere}
          </Link>
        </p>
      ) : (
        <fieldset className="m-form-set">
          <legend className="m-form-label">{form.intentLegend}</legend>
          <div className="m-form-chips">
            {intents.map((item) => (
              <label key={item.id} className="m-form-chip">
                <input
                  type="radio"
                  name="intent"
                  value={item.id}
                  required
                  checked={intent === item.id}
                  onChange={() => setIntent(item.id)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {intent === 'follow' ? (
        <fieldset className="m-form-set">
          <legend className="m-form-label">{form.productLegend}</legend>
          <div className="m-form-chips">
            {productIds.map((item) => (
              <label key={item} className="m-form-chip">
                <input
                  type="radio"
                  name="product"
                  value={item}
                  required
                  checked={product === item}
                  onChange={() => setProduct(item)}
                />
                <span lang="en">{products[item].name}</span>
              </label>
            ))}
          </div>
          {product ? (
            <p className="m-form-stage">
              <span
                className="m-status"
                data-concept={product === 'world' || undefined}
              >
                {products[product].stage}
              </span>
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="m-form-pair">
        <p className="m-form-field">
          <label className="m-form-label" htmlFor={id('name')}>
            {form.name}
          </label>
          <input
            id={id('name')}
            name="name"
            required
            maxLength={40}
            autoComplete="name"
          />
        </p>
        <p className="m-form-field">
          <label className="m-form-label" htmlFor={id('email')}>
            {form.email}
          </label>
          <input
            id={id('email')}
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            spellCheck={false}
            placeholder={form.emailPlaceholder}
          />
        </p>
      </div>

      <p className="m-form-field">
        <label className="m-form-label" htmlFor={id('idea')}>
          {form.idea}
          <span className="m-form-count num" aria-hidden="true">
            {idea.length} / 1200
          </span>
        </label>
        <textarea
          id={id('idea')}
          name="idea"
          required
          minLength={5}
          maxLength={1200}
          rows={6}
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder={option?.placeholder ?? intents[4].placeholder}
        />
      </p>

      <div className="m-form-checks">
        <label className="m-form-check">
          <input type="checkbox" name="consent" required />
          <span>{form.consent}</span>
        </label>
        {sharing ? (
          <label className="m-form-check">
            <input type="checkbox" name="allowDisplay" />
            <span>{form.allowDisplay}</span>
          </label>
        ) : null}
      </div>

      <p className="m-form-handling" id={id('handling')}>
        {form.handling}
        {sharing ? form.shareHandling : null}
      </p>

      <div className="m-form-send">
        <button
          className="m-btn"
          type="submit"
          disabled={!ready || busy}
          aria-busy={busy || undefined}
        >
          {busy ? form.sending : form.submit}
        </button>
        <p className="m-form-error" role="alert">
          {error}
        </p>
      </div>
      <p className="m-form-nojs">{form.noScript}</p>
    </form>
  );
}
