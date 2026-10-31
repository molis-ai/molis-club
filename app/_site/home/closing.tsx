import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { homeClosing } from '../../../content/site/home';
import { ABOUT, COMMUNITY, ENTERPRISE } from '../routes';
import { mediaOf } from '../ui';

// 首页结尾（负责人 2026-10-22 / 10-23，D2 / B5）：画室那段影像挪去了社区结尾，这里回到纸面。
// 接着产品列表那张暖白纸，一屏：过渡句「让口味相近的人认出彼此。」居中，下面三张白卡横排——
// 企业合作、社区、关于我们（同「关于」结尾的去处）。整张卡都是链接，只留一颗圆形箭头；
// 鼠标停上去卡片浮起一点，箭头填黑。三个排法里负责人 10-23 定了这一种（纸面三卡）。
// 2026-10-24 负责人给这一屏配了一张照片（静图，不做动画）：薄雾里的远山，草坡山脊上远远站着一个人——
// 远处有人也为同一片天停了下来。照片铺满上部，天的上沿化进纸里，那句话写在空着的天上；
// 三张卡落在照片下面的纸上。2026-10-31 卡上去掉英文副标签，只留中文名。

const href = { enterprise: ENTERPRISE, community: COMMUNITY, about: ABOUT };

export function Closing() {
  const close = homeClosing;
  const photo = mediaOf('home-close');
  return (
    <section
      className="m-close"
      data-tone="paper"
      aria-labelledby="m-close-title"
    >
      <div
        className="m-close-sky"
        style={{ '--avg': photo.avg } as CSSProperties}
      >
        <img
          className="m-close-photo"
          src={photo.src}
          srcSet={photo.srcset.map(([src, w]) => `${src} ${w}w`).join(', ')}
          sizes="(max-width: 900px) 190vw, 100vw"
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
