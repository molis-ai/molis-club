import { painters } from '../../../content/site/about';
import { ABOUT } from '../../_site/routes';
import '../../_site/review/comparison.css';

// 《黑客与画家》一章两版对照的切换条（负责人 2026-10-19「两版都先保留」）：只在带 ?makers= 时出现，样子同全站的样张比较条。
// 原版（?makers=trio）是三种媒介的三栏演示，新版（?makers=painters，也是不带参数时的默认）是画家与黑客一起推近。

export type Makers = 'trio' | 'painters';

export function MakersReview({ makers }: { makers: Makers }) {
  const { review } = painters;
  return (
    <aside className="m-review-bar" aria-label={`${review.label}样张比较`}>
      <span className="m-review-label">{review.label} · 本地样张比较</span>
      <nav aria-label={`${review.label}版本`}>
        {(['trio', 'painters'] as const).map((name) => (
          <a
            key={name}
            href={`${ABOUT}?makers=${name}#makers`}
            aria-current={makers === name ? 'page' : undefined}
          >
            {review[name]}
          </a>
        ))}
      </nav>
    </aside>
  );
}
