import { hero } from '../../../../../content/molis-work';
import WorkPage from './work-page';

export const metadata = {
  title: { absolute: 'Molis Work · 本地优先的 AI 工作台' },
  description: hero.lead,
};

export default function DaylightWorkPage() {
  return <WorkPage />;
}
