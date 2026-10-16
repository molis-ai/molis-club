// 公共部件里的字的英文（对应 content/site/ui.ts，形状一致）。
import type * as zh from '../ui';

export const ui: typeof zh.ui = {
  ending: {
    fit: 'When it helps',
    progress: 'Where it stands',
    have: 'What’s there',
    notYet: 'What isn’t yet',
    now: 'How to try it now',
    relation: 'How it relates',
    go: 'Next steps',
  },
  demo: {
    picture: (note, label) => `Picture (${note}): ${label}`,
    steps: 'What the picture shows',
    figure: (label, note) => `${label} (${note})`,
    segments: (name, total) => `${total} demos of ${name}`,
    pause: 'Pause the demo',
    play: 'Play the demo',
  },
  colon: ': ',
};
