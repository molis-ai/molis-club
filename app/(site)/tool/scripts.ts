import type { Cue, Scene } from './cue';

// 每一段演示怎么一拍一拍地演（specs/site-rebuild/tool-page.md 第 11 节）。光标带着人看：
// 先停一会儿 → 光标从画框外进来 → 选中（I 形，选中色跟着拖） → 松手，动作条出现在选区末端 →
// 光标走到动作上，停一下，按下 → 光标让开，结果就在原处发生 → 停久一点，留下一句「做完了」。
// 名字对应画面里的 data-c，每一拍的样子写在 tool.css。

/** 松手以后：动作条出来，光标走到第一个动作上，停一下再按 */
async function pick(c: Cue, button: string) {
  c.cue('bar');
  await c.wait(700);
  c.arrow();
  await c.to(button, { at: [0.66, 0.58], dur: 560, bend: 0.22 });
  c.cue('hover');
  await c.wait(420);
  await c.press('press');
  await c.wait(300);
}

/** 拖选一句乱掉的话：一截一截地铺上选中色 */
async function sweep(c: Cue, name: string) {
  c.beam();
  await c.wait(240);
  for (const [index, part] of c.all(name).entries())
    await c.drag(part, part, { dur: index ? 240 : 320 });
  await c.wait(260);
}

/** 清理：圆点、下划线、灰字先退掉，再把每一截从原处收进一句 */
async function tidy(c: Cue, name: string, box?: string) {
  c.flag(name, 'tidy');
  await c.wait(220);
  await c.flip(c.all(name), () => c.flag(name, 'clean'), { box });
}

/** 字一个一个出来要多久（tool.css 里每字 32ms） */
const streamed = (c: Cue, name: string) =>
  (c.el(name)?.textContent?.length ?? 0) * 32 + 500;

/** 以前那一边做完的样子（访客亲手按「清理格式」时，左边直接摆好） */
function finishBefore(c: Cue) {
  c.all('app').forEach((app) => c.flag(app, 'sel'));
  c.all('dot').forEach((dot) => c.flag(dot, 'sel'));
  c.flag('before', 'tidy');
  c.flag('before', 'clean');
}

export const scenes: Record<string, Scene> = {
  /** 首屏：先停在译文上，再演一遍——拖选两行英文 → 点「翻译」→ 译文带着出处贴在旁边 */
  desk: {
    start: 'done',
    rest: 3800,
    async play(c) {
      c.use();
      await c.enter('desk-0', { at: [0, 0.55] });
      c.beam();
      await c.wait(380);
      await c.drag('desk-0', 'desk-0', { dur: 1000 });
      await c.drag('desk-1', 'desk-1', { dur: 520 });
      await c.wait(260);
      await pick(c, 'desk-btn');
      await c.aside(-2.6, 2.4);
      c.cue('card');
      await c.wait(streamed(c, 'desk-out'));
      c.cue('src');
      await c.leave();
    },
  },

  /** 以前与现在：左边光标跑四个应用才收拾好；右边选中、点一下，就在原处收拢 */
  shift: {
    settle: 1300,
    rest: 3800,
    async play(c) {
      c.use('before');
      const apps = c.all('app');
      const dots = c.all('dot');
      for (const [index, app] of apps.entries()) {
        if (index) await c.to(app, { at: [0.5, 0.32], dur: 640 });
        else await c.enter(app, { at: [0.5, 0.32] });
        await c.wait(200);
        await c.press(() => {
          c.flag(app, 'sel');
          c.flag(dots[index], 'sel');
        });
        await c.wait(320);
      }
      await c.to('before-paper', { at: [0.6, 0.6], dur: 900 });
      await c.press();
      await tidy(c, 'before', 'before-paper');
      await c.leave();
      await c.wait(700);

      c.use('after');
      await c.enter('after-0', { at: [0, 0.55] });
      await sweep(c, 'after');
      await pick(c, 'after-btn');
      await c.aside();
      await c.wait(120);
      await tidy(c, 'after', 'after-paper');
      c.cue('done');
      await c.wait(700);
      await c.leave();
    },
    acts: {
      /** 访客按了「清理格式」：左边摆好，右边从乱的样子收拢 */
      async clean(c) {
        c.snap(() => {
          finishBefore(c);
          c.unflag(undefined, 'after');
          c.all('after').forEach((part) => c.flag(part, 'sel'));
          c.set('bar', 'hover');
        });
        await c.wait(60);
        c.cue('press');
        await tidy(c, 'after', 'after-paper');
        c.cue('done');
      },
      /** 再按一下：退回乱的样子，可以再做一遍 */
      async messy(c) {
        c.snap(() => {
          finishBefore(c);
          c.all('after').forEach((part) => c.flag(part, 'sel'));
          c.set('bar', 'hover');
        });
        await c.flip(c.all('after'), () => c.unflag(undefined, 'after'), {
          box: 'after-paper',
        });
      },
    },
  },

  /** 三层：光标旁选中日期记下 → 身旁框住海报出草稿 → 离开以后从菜单栏接续 */
  relay: {
    settle: 1100,
    rest: 3600,
    async play(c) {
      c.cue('at-near');
      c.use('near');
      await c.enter('near-hl', { at: [0, 0.55] });
      c.beam();
      await c.wait(320);
      await c.drag('near-hl', 'near-hl', { dur: 760 });
      await c.wait(240);
      await pick(c, 'near-btn');
      c.uncue('bar');
      await c.aside(1.6, 2.2);
      c.cue('near-done');
      await c.leave();
      await c.wait(1300);

      c.uncue('at-near');
      c.cue('at-beside');
      c.use('beside');
      await c.enter('beside-frame', { at: [0, 0] });
      await c.wait(260);
      await c.drag('beside-frame', 'beside-frame', { box: true, dur: 900 });
      await c.wait(380);
      c.cue('draft');
      await c.aside(-1.8, -0.6);
      await c.wait(900);
      await c.leave();
      await c.wait(1100);

      c.uncue('at-beside');
      c.cue('at-later');
      c.use('later');
      await c.enter('later-icon', { at: [0.5, 0.6] });
      c.cue('l-hover');
      await c.wait(420);
      await c.press('panel');
      await c.wait(1300);
      await c.to('later-back', { at: [0.3, 0.6], dur: 700 });
      c.cue('back');
      await c.wait(600);
      await c.leave();
      c.uncue('at-later');
    },
  },

  /** 插件：拨开关 → 四处入口依次亮起 → 一条链走下来 → 再拨一下，入口收起，字幕还在 */
  plug: {
    settle: 1000,
    rest: 3000,
    async play(c) {
      c.use();
      await c.enter('plug-toggle', { at: [0.62, 0.62] });
      c.cue('hover');
      await c.wait(380);
      await c.press('on');
      await c.aside(-1.2, 2.4);
      for (const step of ['s1', 's2', 's3', 's4']) {
        c.cue(step);
        await c.wait(420);
      }
      await c.wait(500);
      for (const step of ['c1', 'c2', 'c3', 'c4', 'c5']) {
        c.cue(step);
        await c.wait(480);
      }
      await c.wait(1600);
      await c.to('plug-toggle', { at: [0.62, 0.62], dur: 620 });
      await c.wait(320);
      await c.press(() => {
        c.uncue('on', 's1', 's2', 's3', 's4');
        c.cue('kept');
      });
      await c.wait(500);
      c.uncue('hover');
      await c.leave();
    },
    acts: {
      on: (c) =>
        c.set('on', 's1', 's2', 's3', 's4', 'c1', 'c2', 'c3', 'c4', 'c5'),
      off: (c) => c.set('c1', 'c2', 'c3', 'c4', 'c5', 'kept'),
    },
  },

  // ---------- 眼前的小事：六件各演各的 ----------

  'm-clean': {
    settle: 1100,
    async play(c) {
      c.use();
      await c.enter('text-0', { at: [0, 0.55] });
      await c.wait(260);
      await sweep(c, 'text');
      await pick(c, 'btn');
      c.uncue('bar');
      await c.aside();
      await tidy(c, 'text', 'paper');
      await c.wait(900);
      c.unflag('sel');
      c.cue('done');
      await c.leave();
    },
  },

  'm-pages': {
    settle: 1100,
    async play(c) {
      c.use();
      const pages = c.all('pg');
      await c.enter(pages[1], { at: [0.3, 0.45] });
      await c.wait(260);
      await c.press(() => c.flag(pages[1], 'sel'));
      for (const page of pages.slice(2, 4)) {
        await c.to(page, { at: [0.55, 0.45], dur: 440, bend: 0.03 });
        c.flag(page, 'sel');
      }
      await c.wait(300);
      await pick(c, 'btn');
      c.uncue('bar');
      await c.aside(2.4, 1.4);
      c.cue('copy');
      await c.wait(1100);
      c.cue('done');
      await c.leave();
    },
  },

  'm-table': {
    settle: 1100,
    async play(c) {
      c.use();
      await c.enter('line-0', { at: [0, 0.55] });
      c.beam();
      await c.wait(300);
      for (const [index, line] of c.all('line').entries())
        await c.drag(line, line, { dur: index ? 420 : 620 });
      await c.wait(260);
      await pick(c, 'btn');
      c.uncue('bar');
      await c.aside(2.2, 2.6);
      c.cue('table');
      await c.wait(1400);
      await c.to('price', { at: [0.55, 0.6], dur: 720 });
      c.cue('th');
      await c.wait(420);
      await c.press();
      await c.flip(c.all('row'), () => c.flag('table', 'sort'));
      await c.aside(1.4, 2);
      c.cue('done');
      await c.leave();
    },
  },

  'm-caption': {
    settle: 1100,
    async play(c) {
      c.use();
      await c.enter('photo', { at: [0.62, 0.48] });
      await c.wait(300);
      await c.press(() => c.flag('photo', 'sel'));
      await c.wait(360);
      await pick(c, 'btn');
      c.uncue('bar');
      await c.aside(-2.2, 2.4);
      c.cue('says');
      await c.wait(streamed(c, 'says'));
      c.unflag('sel');
      c.cue('done');
      await c.leave();
    },
  },

  'm-poster': {
    settle: 1100,
    async play(c) {
      c.use();
      await c.enter('frame', { at: [0, 0] });
      await c.wait(300);
      await c.drag('frame', 'frame', { box: true, dur: 900 });
      await c.wait(260);
      await pick(c, 'btn');
      c.uncue('bar');
      await c.aside(-1.6, 2.4);
      c.cue('draft');
      await c.wait(1200);
      c.cue('done');
      await c.leave();
    },
  },

  'm-todo': {
    settle: 1100,
    async play(c) {
      c.use();
      await c.enter('msg-0', { at: [0, 0.55] });
      c.beam();
      await c.wait(300);
      await c.drag('msg-0', 'msg-0', { dur: 720 });
      await c.drag('msg-1', 'msg-1', { dur: 520 });
      await c.wait(260);
      await pick(c, 'btn');
      c.uncue('bar');
      await c.aside(-2, 2.4);
      c.cue('list');
      await c.wait(1300);
      c.unflag('sel');
      c.cue('done');
      await c.leave();
    },
  },
};
