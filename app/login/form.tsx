'use client';
import { useEffect, useState } from 'react';
import Link, { useEditionPath } from '../edition-link';
import { useSearchParams } from 'next/navigation';
import { Code2, Mail } from 'lucide-react';
import { authClient } from '../../lib/auth-client';
import { formText } from '../../lib/forms';
export function LoginForm({
  compactProviders = false,
}: {
  compactProviders?: boolean;
}) {
  const editionPath = useEditionPath();
  const [mode, setMode] = useState<'login' | 'signup'>('login'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState({ google: false, github: false });
  const [providerError, setProviderError] = useState(false);
  const { data: session } = authClient.useSession();
  useEffect(() => {
    fetch('/api/auth-options')
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => setProviders(d as { google: boolean; github: boolean }))
      .catch(() => setProviderError(true));
  }, []);
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      const values = {
        email: formText(f, 'email').trim(),
        password: formText(f, 'password'),
      };
      const result =
        mode === 'signup'
          ? await authClient.signUp.email({
              ...values,
              name: formText(f, 'name').trim(),
            })
          : await authClient.signIn.email(values);
      if (result.error) {
        setError(
          result.error.status === 429
            ? '尝试太频繁，请稍等一分钟再试。'
            : mode === 'login'
              ? '邮箱或密码不正确，请检查后重试。'
              : '未能创建账号。请检查邮箱和密码，或尝试登录已有账号。',
        );
        return;
      }
      window.location.assign(editionPath('/account'));
    } catch {
      setError('账号服务暂时没有响应，请稍后重试。');
    } finally {
      setBusy(false);
    }
  }
  async function social(provider: 'google' | 'github') {
    setBusy(true);
    setError('');
    try {
      const r = await authClient.signIn.social({
        provider,
        callbackURL: editionPath('/account'),
        errorCallbackURL: editionPath('/login?error=oauth'),
      });
      if (r.error) setError('这次授权未能开始，请稍后重试。');
    } catch {
      setError('连接失败，请稍后重试。');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-panel">
      {session ? (
        <div>
          <h1>你已经登录了。</h1>
          <p>{session.user.name}，欢迎回来。</p>
          <Link className="button primary" href="/account">
            查看我的账号
          </Link>
        </div>
      ) : (
        <>
          <div className="auth-heading">
            <h1>{mode === 'login' ? '欢迎回来。' : '很高兴认识你。'}</h1>
            <p>
              {mode === 'login'
                ? '登录，留下一点你的想法。'
                : '创建账号，和作品的作者聊聊。'}
            </p>
          </div>
          {(!compactProviders || providers.google || providers.github) && (
            <div className="social-buttons">
              {(!compactProviders || providers.google) && (
                <button
                  disabled={!providers.google || busy}
                  onClick={() => social('google')}
                >
                  <Mail size={18} />
                  <span>Google</span>
                  {!providers.google && <small>待开放</small>}
                </button>
              )}
              {(!compactProviders || providers.github) && (
                <button
                  disabled={!providers.github || busy}
                  onClick={() => social('github')}
                >
                  <Code2 size={18} />
                  <span>GitHub</span>
                  {!providers.github && <small>待开放</small>}
                </button>
              )}
            </div>
          )}
          {(!compactProviders ||
            providerError ||
            providers.google ||
            providers.github) && (
            <p className="form-caption">
              {providerError
                ? '第三方登录状态暂时无法读取，可先使用邮箱。'
                : !providers.google || !providers.github
                  ? '第三方登录正在接入，邮箱注册已开放。'
                  : '只读取基本账号资料，不读取邮件或代码。'}
            </p>
          )}
          <div className="auth-divider">
            使用邮箱{mode === 'login' ? '登录' : '注册'}
          </div>
          <form onSubmit={submit}>
            {mode === 'signup' && (
              <label className="field">
                <span>怎么称呼你</span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={40}
                  placeholder="你的名字"
                />
              </label>
            )}
            <label className="field">
              <span>邮箱</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                maxLength={254}
                placeholder="you@example.com"
              />
            </label>
            <label className="field">
              <span>密码</span>
              <input
                type="password"
                name="password"
                required
                minLength={12}
                maxLength={128}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                placeholder="至少 12 位字符"
              />
            </label>
            {mode === 'signup' && (
              <label className="consent">
                <input type="checkbox" required />
                <span>
                  我已阅读并同意<Link href="/privacy">隐私说明</Link>。
                </span>
              </label>
            )}
            <button className="button primary wide" disabled={busy}>
              {busy ? '请稍候…' : mode === 'login' ? '登录' : '创建账号'}
            </button>
            <p className="feedback error" role="alert">
              {error ??
                (searchParams.has('error')
                  ? '这次第三方登录没有完成。你可以重新授权，或使用邮箱登录。'
                  : '')}
            </p>
          </form>
          <p className="auth-switch">
            {mode === 'login' ? '还没有账号？' : '已经有账号？'}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? '注册一个' : '去登录'}
            </button>
          </p>
          <p className="form-caption">
            试用阶段暂未开通密码找回邮件，请妥善保存密码。登录后可以修改密码。
          </p>
        </>
      )}
    </section>
  );
}
