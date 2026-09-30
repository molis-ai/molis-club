import { ReviewFooter, ReviewHeader } from '../_review/chrome';
import { CompareBoard } from './board';
import '../_review/review.css';

export const metadata = {
  title: { absolute: 'Molis AI · 品牌方向预览台' },
  description:
    '日光、Folio、夜曲、深空与 Edition C 五个品牌方向的首页和 Molis Work 产品页，放在一起对比。',
};

export default function ComparePage() {
  return (
    <div className="rv-site">
      <ReviewHeader current="compare" />
      <main id="main">
        <CompareBoard />
      </main>
      <ReviewFooter />
    </div>
  );
}
