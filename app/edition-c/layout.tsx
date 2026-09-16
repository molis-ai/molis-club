import { CHeader, CFooter } from './chrome';
import '../editorial.css';
import './edition.css';
// Direction: specs/edition-c/spec.md. User-pinned Everyday composition; independent C surface.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="edition-c">
      <CHeader />
      {children}
      <CFooter />
    </div>
  );
}
