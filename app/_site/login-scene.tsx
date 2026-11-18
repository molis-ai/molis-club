'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { studio } from '../../content/site/studio';
import { SkyFootage, FootageToggle, useFootagePlaying } from './home/footage';

export function LoginScene({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => { router.prefetch('/'); }, [router]);
  const { playing, toggle } = useFootagePlaying();
  return (
    <section
      className="m-auth m-auth-login m-auth-sky"
      data-tone="film"
      aria-label="Molis 账号登录"
    >
      <div className="m-auth-sky-media" aria-hidden="true">
        <SkyFootage playing={playing} />
        <span className="m-film-scrim" />
      </div>
      <div className="m-auth-card">
        <button type="button" className="m-auth-close" onClick={() => router.push('/')}
          aria-label="关闭登录，返回首页" title="关闭登录">
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        {children}
      </div>
      <div className="m-real-foot">
        <FootageToggle playing={playing} toggle={toggle} />
        <p className="m-keys">
          {studio.keywords.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
