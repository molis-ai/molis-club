import './shared.css';
export const metadata = {
  title: { absolute: 'Molis AI · 三站设计探索' },
  robots: { index: false, follow: false },
};
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="molis-demo">{children}</div>;
}
