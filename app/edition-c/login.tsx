import { LoginForm } from '../login/form';
export function CLogin() {
  return (
    <main className="c-auth" id="main">
      <aside className="c-auth-scene">
        <img
          src="/images/edition-c/studio-light.jpg"
          alt=""
          width="1672"
          height="941"
          fetchPriority="high"
        />
        <div>
          <p>把好奇留住。</p>
          <span>A space for your curiosity.</span>
        </div>
      </aside>
      <LoginForm compactProviders />
    </main>
  );
}
