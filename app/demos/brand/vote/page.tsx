import { ReviewFooter, ReviewHeader } from '../_review/chrome';
import { Ballot } from './ballot';
import '../_review/review.css';

export const metadata = {
  title: { absolute: 'Molis AI · 品牌方向投票' },
  description:
    '在日光、Folio、夜曲、深空与 Edition C 五个品牌方向中选出你更喜欢的一个，并说说理由。',
};

export default function VotePage() {
  return (
    <div className="rv-site">
      <ReviewHeader current="vote" />
      <main id="main" className="rv-vote">
        <Ballot />
      </main>
      <ReviewFooter />
    </div>
  );
}
