import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { homeClosing } from '../../../content/site/home';
import { ABOUT, COMMUNITY, ENTERPRISE } from '../routes';
import { mediaOf } from '../ui';

// 首页结尾（负责人 2026-10-22 / 10-23，D2 / B5）：画室那段影像挪去了社区结尾，这里回到纸面。
// 过渡句「让口味相近的人认出彼此。」，下面三张卡横排——企业合作、社区、关于我们（同「关于」结尾的去处）。
// 整张卡都是链接，只留一颗圆形箭头；鼠标停上去卡片浮起一点、透得少一些，箭头填黑。
// 2026-10-31 负责人改成满版、换了照片：雾里的海面，一个人站在桨板上远远地划（静图）。
// 水面碎光压不住字，地平线放低到画面约八成处，那句话和三张卡都写在上面的雾里，人和水留在下面；
// 卡是半透明的纸，透得出后面的雾，上沿亮一点像迎着光。手机上照片只留那句话，三张卡落到照片下面的纸上。

const href = { enterprise: ENTERPRISE, community: COMMUNITY, about: ABOUT };

export function Closing() {
  const close = homeClosing;
  const photo = mediaOf('home-close');
  return (
    <section
      className="m-close"
      data-tone="paper"
      aria-labelledby="m-close-title"
      style={{ '--avg': photo.avg } as CSSProperties}
    >
      <div className="m-close-sky">
        <img
          className="m-close-photo"
          src={photo.src}
          srcSet={photo.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes="(max-width: 900px) 135vw, 100vw"
          width={photo.width}
          height={photo.height}
          alt={close.photoAlt}
          loading="lazy"
          decoding="async"
        />
        <div className="m-close-head m-wrap">
          <h2 id="m-close-title" className="m-close-lead">
            {close.lead.map((line, index) => (
              <span
                key={line}
                data-reveal
                style={{ '--delay': `${index * 360}ms` } as CSSProperties}
              >
                {line}
              </span>
            ))}
          </h2>
        </div>
      </div>
      <div className="m-close-in m-wrap">
        <ul className="m-close-doors">
          {close.paths.map((path, index) => (
            <li
              key={path.id}
              data-reveal
              style={{ '--delay': `${480 + index * 90}ms` } as CSSProperties}
            >
              <Link
                className="m-close-door"
                href={href[path.id]}
                aria-label={path.label}
              >
                <span className="m-close-door-head">{path.label}</span>
                <span className="m-close-door-title">
                  {path.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
                <span className="m-close-door-go" aria-hidden="true">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
