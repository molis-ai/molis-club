'use client';
import type { RefObject } from 'react';
import { useCue as useSharedCue } from '../../_site/cue';
import { scenes } from './scripts';

// 编排引擎在 app/_site/cue.ts（Work 页也用）；Tool 这边按名字从 scripts.ts 取那一段编排。
export { Cue, type Scene } from '../../_site/cue';

export function useCue(
  ref: RefObject<HTMLElement | null>,
  name: string,
  options: Parameters<typeof useSharedCue>[2],
) {
  useSharedCue(ref, scenes[name], options);
}
