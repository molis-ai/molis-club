import { useId } from 'react';

export type PlanetKind = 'work' | 'life' | 'tool' | 'story' | 'horizon';

const textures: Record<
  PlanetKind,
  { frequency: string; octaves: number; seed: number; matrix: string }
> = {
  // banded gas giant, ivory and amber
  work: {
    frequency: '0.004 0.06',
    octaves: 4,
    seed: 4,
    matrix: '0 0 0 0 0.94  0 0 0 0 0.74  0 0 0 0 0.46  1.5 0 0 0 -0.35',
  },
  // warm terrestrial world, ochre continents over deep teal
  life: {
    frequency: '0.018',
    octaves: 5,
    seed: 11,
    matrix: '0 0 0 0 0.93  0 0 0 0 0.62  0 0 0 0 0.38  0 0 0 5 -2.4',
  },
  // 银蓝色的小卫星，表面是细碎的环形坑；外面绕着一颗探针，像跟在光标旁边
  tool: {
    frequency: '0.028 0.026',
    octaves: 4,
    seed: 31,
    matrix: '0 0 0 0 0.86  0 0 0 0 0.92  0 0 0 0 1  2.6 0 0 0 -1.05',
  },
  // violet ice world with long swirls
  story: {
    frequency: '0.006 0.022',
    octaves: 5,
    seed: 23,
    matrix: '0 0 0 0 0.86  0 0 0 0 0.78  0 0 0 0 1  2.2 0 0 0 -0.7',
  },
  horizon: {
    frequency: '0.0025 0.03',
    octaves: 4,
    seed: 5,
    matrix: '0 0 0 0 0.72  0 0 0 0 0.78  0 0 0 0 0.98  1.2 0 0 0 -0.4',
  },
};

export default function Planet({
  kind,
  className = '',
}: {
  kind: PlanetKind;
  className?: string;
}) {
  const id = useId().replace(/:/g, '');
  const texture = textures[kind];
  return (
    <span
      className={`cs-planet cs-planet-${kind} ${className}`}
      aria-hidden="true"
    >
      <span className="cs-planet-body">
        <svg
          className="cs-planet-surface"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          <filter id={`t${id}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={texture.frequency}
              numOctaves={texture.octaves}
              seed={texture.seed}
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values={texture.matrix} />
          </filter>
          <rect width="800" height="400" filter={`url(#t${id})`} />
        </svg>
      </span>
      {kind === 'work' ? <span className="cs-planet-ring" /> : null}
      {kind === 'tool' ? (
        <span className="cs-planet-probe">
          <i />
        </span>
      ) : null}
    </span>
  );
}
