import type { Cue, Scene } from '../../_site/cue';
import type { TourChapterId } from '../../../content/site/work';

// 每一屏怎么一拍一拍地演（画面在 scenes.tsx，样子在 work.css）。和 Tool 页同一套编排（app/_site/cue.ts）：
// 光标是「你」，杏橙色，只在你动手的时候出现；AI 不用光标，它在写的那行字后面亮一个插入光标和灰名牌，写完就收。
// 一次只动一样：AI 写的时候你不动，你动的时候 AI 停着。每一遍：先停一会儿 → 发生 → 停久一点。

/** 演到这一拍：data-step / data-mid 的那几样出现 */
const on = (c: Cue, ...names: string[]) => names.forEach((name) => c.flag(name, 'on'));
/** 收起：data-mid / data-gone 的那几样退场 */
const off = (c: Cue, ...names: string[]) => names.forEach((name) => c.flag(name, 'off'));

/** AI 写一行：名牌亮起，字从左往右显出来，写完名牌收起 */
async function write(c: Cue, text: string, ai?: string, ms = 1150) {
  if (ai) c.flag(ai, 'on');
  c.flag(text, 'on');
  await c.wait(ms);
  if (ai) c.flag(ai, 'off');
}

/** 你按一下：光标落到按钮上，停一下再按 */
async function tap(c: Cue, target: string, then?: () => void, at: readonly [number, number] = [0.42, 0.58]) {
  await c.to(target, { at, dur: 760 });
  await c.wait(320);
  await c.press(then);
  await c.wait(160);
}

export const heroScene: Scene = {
  start: 'done',
  rest: 4600,
  async play(c) {
    c.use();
    await c.wait(500);
    for (const index of [0, 1, 2]) {
      on(c, `h-${index}`);
      await c.wait(420);
      await write(c, `h-${index}-w`, `h-${index}-ai`, 1250);
      await c.wait(260);
    }
    on(c, 'h-wait');
    await c.wait(1000);
    await c.enter('h-2-tag', { at: [0.3, 0.62] });
    c.cue('hover');
    await c.wait(2000);
    await c.leave();
  },
};

/* ---------- 全景：六段各演一遍，演完换下一段（stages.tsx 的 Tour）。镜头先推过去，停稳了光标再动 ---------- */

const CAM = 1150;

export const tourScenes: Record<TourChapterId, Scene> = {
  project: {
    settle: CAM,
    rest: 2400,
    async play(c) {
      c.cue('tabs');
      await c.wait(2800);
    },
  },
  plugins: {
    settle: CAM,
    rest: 1800,
    async play(c) {
      c.use();
      await c.enter('t-dock', { at: [0.5, 0.55] });
      await c.wait(260);
      await c.press(() => on(c, 't-plugins'));
      await c.wait(800);
      await c.to('t-made', { at: [0.3, 0.6], dur: 820 });
      c.flag('t-made', 'lit');
      await c.wait(2000);
    },
  },
  ask: {
    settle: CAM,
    rest: 2000,
    async play(c) {
      c.use();
      await c.enter('t-sel', { at: [0, 0.55] });
      c.beam();
      await c.wait(300);
      await c.drag('t-sel', 't-sel', { dur: 1100 });
      c.arrow();
      on(c, 't-ctx');
      await c.wait(650);
      await tap(c, 't-give', () => {
        off(c, 't-ctx');
        on(c, 't-ask');
      });
      await c.aside(2.4, 1.6);
      await c.wait(400);
      await write(c, 't-ask-w', 't-ask-ai', 1500);
      on(c, 't-ask-src');
      await c.wait(500);
      on(c, 't-op');
      await c.wait(700);
      await c.to('t-allow', { at: [0.45, 0.6], dur: 800 });
      c.cue('hover');
      await c.wait(1500);
    },
  },
  agents: {
    settle: CAM,
    rest: 2200,
    async play(c) {
      on(c, 't-term');
      await c.wait(600);
      for (const index of [0, 1, 2, 3, 4]) {
        on(c, `t-term-${index}`);
        await c.wait(index === 0 ? 850 : 650);
      }
      off(c, 't-row-was');
      on(c, 't-row-now');
      await c.wait(900);
      on(c, 't-agents');
      await c.wait(1800);
    },
  },
  talk: {
    settle: CAM,
    rest: 2200,
    async play(c) {
      c.use();
      await c.enter('t-talk-tab', { at: [0.5, 0.6] });
      await c.wait(240);
      await c.press(() => {
        c.cue('talk');
        on(c, 't-talk');
      });
      await c.leave();
      for (const index of [0, 1, 2, 3, 4]) {
        await c.wait(index === 2 ? 1000 : 750);
        on(c, `t-talk-${index}`);
      }
      await c.wait(1700);
    },
  },
  wait: {
    settle: CAM,
    rest: 2200,
    async play(c) {
      c.use();
      await c.enter('t-wait', { at: [0.5, 0.6] });
      await c.wait(260);
      await c.press(() => on(c, 't-waitlist'));
      await c.wait(700);
      await c.to('t-check', { at: [0.45, 0.6], dur: 800 });
      c.cue('hover');
      await c.wait(1800);
    },
  },
};
