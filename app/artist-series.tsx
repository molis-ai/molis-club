import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { artistSkills } from '../content/artists';
export function ArtistSeries({ full = false }: { full?: boolean }) {
  return (
    <section className="artist-series" id="artist-skills">
      <div className="edition-section-head">
        <div>
          <h2>艺术家 Skill 系列</h2>
          <p>从一种观看世界的方式，开始创作。</p>
        </div>
        {!full && (
          <Link className="edition-link" href="/wiki/artists">
            探索整个系列 <ArrowUpRight size={17} />
          </Link>
        )}
      </div>
      <div className="artist-gallery">
        {artistSkills
          .filter((skill) => skill.image)
          .map((skill) => (
            <Link
              href={`/wiki/artists/${skill.slug}`}
              className={`artist-gallery-item artist-${skill.slug}`}
              key={skill.slug}
            >
              <figure>
                <img
                  src={skill.image}
                  width={skill.width}
                  height={skill.height}
                  alt={skill.imageAlt}
                  loading="lazy"
                />
              </figure>
              <div>
                <h3>{skill.name}</h3>
                <ArrowUpRight size={18} />
              </div>
              <em>{skill.english}</em>
              <p>{skill.description}</p>
            </Link>
          ))}
      </div>
      <p className="artist-disclosure">
        图像来自 Artist-skill 的 AI 创作试样，非艺术家原作。
      </p>
      {full && (
        <Link
          className="artist-builder"
          href="/wiki/artists/art-style-skill-builder"
        >
          <div>
            <h3>构建你自己的风格 Skill</h3>
            <p>把原作观察、研究与成图反馈，变成可复用的创作方法。</p>
          </div>
          <span className="edition-link">
            了解构建方法 <ArrowUpRight size={18} />
          </span>
        </Link>
      )}
    </section>
  );
}
