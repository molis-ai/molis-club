import { Header, Footer } from '../shell';
import { LoginForm } from './form';
export default function Login() {
  return (
    <>
      <Header />
      <main className="auth-page" id="main">
        <aside className="auth-art">
          <img
            src="/images/molis-makers-studio.png"
            alt=""
            width="1536"
            height="1024"
          />
          <div>
            <p>
              A space for
              <br />
              <em>your curiosity.</em>
            </p>
            <span>有意思的相遇，从这里开始。</span>
          </div>
        </aside>
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
