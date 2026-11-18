'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

let destination: string | null = null;
const event = 'molis:login-toast';
const snapshot = () => destination;
const empty = () => null;

function subscribe(update: () => void) {
  window.addEventListener(event, update);
  return () => window.removeEventListener(event, update);
}

export function showLoginToastOnArrival(href: string) {
  destination = new URL(href, window.location.origin).pathname;
  window.dispatchEvent(new Event(event));
}

export function LoginToast() {
  const path = usePathname();
  const target = useSyncExternalStore(subscribe, snapshot, empty);
  useEffect(() => {
    if (!target || target !== path) return;
    const dismiss = () => {
      destination = null;
      window.dispatchEvent(new Event(event));
    };
    const timer = window.setTimeout(dismiss, 3000);
    return () => {
      window.clearTimeout(timer);
      if (location.pathname !== target && destination === target) dismiss();
    };
  }, [path, target]);
  return (
    <output aria-live="polite" aria-atomic="true">
      {target && target === path && <span className="m-login-toast">登录成功</span>}
    </output>
  );
}
