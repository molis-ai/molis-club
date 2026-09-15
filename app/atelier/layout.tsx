import { AtelierHeader, AtelierFooter } from './chrome';
import './atelier.css';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="atelier-version">
        <AtelierHeader />
        {children}
        <AtelierFooter />
      </div>
    </>
  );
}
