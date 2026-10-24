import type { Cue, Scene } from './cue';

// 每一块屏幕怎么一拍一拍地演（specs/site-rebuild/tool-page.md 第 12 节）。光标带着人看：
// 先停一会儿 → 光标从画框外进来 → 选中（I 形，选中色跟着拖） → 松手，动作条出现在选区末端 →
// 光标走到动作上，停一下，按下 → 光标让开，结果就在原处发生 → 停久一点，留下一句「做完了」。
// 「选中 → 动作条 → 结果在旁边」只在首屏完整演一次；往下每屏演新东西。
// 名字对应画面里的 data-c，每一拍的样子写在 tool.css。

/** 松手以后：动作条出来，光标走到第一个动作上，停一下再按 */
async function pick(c: Cue, button: string) {
  c.cue('bar');
  await c.wait(600);
  c.arrow();
  await c.to(button, { at: [0.66, 0.58], dur: 520, bend: 0.22 });
  c.cue('hover');
  await c.wait(380);
  await c.press('press');
  await c.wait(260);
}

/** 拖选几行：一行一行地铺上选中色 */
async function sweep(c: Cue, name: string) {
  c.beam();
  await c.wait(240);
  for (const [index, part] of c.all(name).entries())
    await c.drag(part, part, { dur: index ? 300 : 420 });
  await c.wait(240);
}

/** 清理：粗细、缩进先退掉，再把每一截从原处收进一句 */
async function tidy(c: Cue, name: string, box?: string) {
  c.flag(name, 'tidy');
  await c.wait(220);
  await c.flip(c.all(name), () => c.flag(name, 'clean'), { box });
}

/** 字一个一个出来要多久（tool.css 里每字 32ms） */
const streamed = (c: Cue, name: string) =>
  (c.el(name)?.textContent?.length ?? 0) * 32 + 500;

/** 以前（左边那台）：选中三行，到程序坞开表格，贴进去，到菜单栏找「分列」，再带回笔记；每到一站插一枚带序号的签，下面的步数跟着走（1–4） */
async function was(c: Cue) {
  await c.enter('line-0', { at: [0, 0.55] });
  await sweep(c, 'line');
  c.arrow();
  await c.to('dock-表格', { at: [0.5, 0.35], dur: 1050, bend: -0.2 });
  await c.press('sheet');
  await c.wait(520);
  await c.to('cell', { at: [0.3, 0.5], dur: 900, bend: 0.16 });
  await c.press('paste');
  await c.wait(520);
  await c.to('menu', { at: [0.5, 0.55], dur: 900, bend: 0.2 });
  await c.press('menu');
  await c.wait(420);
  await c.to('pick', { at: [0.32, 0.5], dur: 460, bend: 0.03 });
  await c.press(() => {
    c.uncue('menu');
    c.cue('split');
  });
  await c.wait(700);
  await c.to('note', { at: [0.3, 0.62], dur: 1100, bend: 0.22 });
  await c.press('back');
  await c.wait(1200);
  await c.leave();
}

/** 现在（右边那台）：同一处选中，光标旁一步，只有一枚「一步」；做完就停在表上，等左边那台走完 */
async function now(c: Cue) {
  await c.enter('line-0', { at: [0, 0.55] });
  await sweep(c, 'line');
  await pick(c, 'after-btn');
  c.uncue('bar');
  c.cue('table', 'one');
  await c.aside(1.8, 2.4);
  await c.wait(600);
  await c.leave();
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

  /** 以前与现在：只比路程。两台同一刻开始，各走各的；两台都做完了才一起停、一起从头 */
  shift: {
    settle: 1100,
    rest: 4200,
    async play(c) {
      await Promise.all([was(c.side('was')), now(c.side('now'))]);
    },
  },

  // ---------- 眼前的小事：三件事，三层，各演各的 ----------

  /** 光标旁：选中乱掉的一句，点「清理格式」，就在原处收拢 */
  'c-near': {
    settle: 900,
    rest: 3400,
    async play(c) {
      c.use();
      await c.enter('text-0', { at: [0, 0.55] });
      await c.wait(240);
      await sweep(c, 'text');
      await pick(c, 'btn');
      c.uncue('bar');
      await c.aside(1.4, 2.6);
      await tidy(c, 'text', 'paper');
      await c.wait(700);
      c.unflag('sel');
      c.cue('done');
      await c.leave();
    },
  },

  /** 身旁：点一下报价.pdf，选「取出几页」，旁边的小卡里挑第 2–4 页，另存一份；原件不动 */
  'c-beside': {
    settle: 900,
    rest: 3400,
    async play(c) {
      c.use();
      await c.enter('pdf', { at: [0.5, 0.42] });
      await c.wait(220);
      await c.press(() => c.flag('pdf', 'sel'));
      await c.wait(320);
      await pick(c, 'btn');
      c.uncue('bar');
      c.cue('card');
      await c.wait(800);
      for (const [index, page] of c.all('pg').slice(1, 4).entries()) {
        await c.to(page, {
          at: [0.5, 0.42],
          dur: index ? 420 : 900,
          bend: index ? 0.04 : 0.16,
        });
        await c.press(() => c.flag(page, 'sel'));
        await c.wait(140);
      }
      c.cue('range');
      await c.wait(520);
      await c.to('save', { at: [0.5, 0.55], dur: 640, bend: 0.1 });
      c.cue('s-hover');
      await c.wait(320);
      await c.press('saved');
      await c.aside(1.8, 2);
      await c.wait(500);
      c.cue('done');
      await c.leave();
    },
  },

  /**
   * 离开以后：选中日期，点「整理成日程」，草稿出来，收进菜单栏的「接续」；去做别的（窗口收下去，时间走了二十几分钟），
   * 回来从菜单栏打开接续，草稿等你确认，早上和午后做的也在
   */
  'c-later': {
    settle: 900,
    rest: 3600,
    async play(c) {
      c.use();
      await c.enter('when', { at: [0, 0.55] });
      c.beam();
      await c.wait(320);
      await c.drag('when', 'when', { dur: 820 });
      await c.wait(240);
      await pick(c, 'btn');
      c.uncue('bar');
      c.cue('draft');
      await c.aside(-1.6, 2.4);
      await c.wait(1500);
      c.cue('stow');
      await c.wait(900);
      await c.leave();
      c.cue('away');
      await c.wait(1300);
      c.cue('later');
      await c.wait(700);
      await c.enter('molis', { at: [0.5, 0.6], from: [0.62, 1.06] });
      c.cue('m-hover');
      await c.wait(320);
      await c.press('panel');
      await c.wait(1000);
      await c.to('row', { at: [0.42, 0.5], dur: 620, bend: 0.06 });
      c.cue('row');
      await c.wait(1400);
      await c.leave();
    },
  },

  /** 插件：拨开关 → 四处同时多出「生成字幕」→ 在光标旁点一下，生成访谈.srt → 再拨一下，四处收起，字幕还在 */
  plug: {
    settle: 1000,
    rest: 3200,
    async play(c) {
      c.use();
      await c.enter('plug-toggle', { at: [0.6, 0.6] });
      c.cue('hover');
      await c.wait(380);
      await c.press('on');
      c.uncue('hover');
      await c.aside(1.6, 3.4);
      for (const step of ['s1', 's2', 's3', 's4']) {
        c.cue(step);
        await c.wait(360);
      }
      await c.wait(900);
      await c.to('gen', { at: [0.6, 0.6], dur: 1000, bend: 0.16 });
      c.cue('g-hover');
      await c.wait(360);
      await c.press('made');
      c.uncue('g-hover');
      await c.aside(1.6, 2.2);
      await c.wait(1600);
      await c.to('plug-toggle', { at: [0.6, 0.6], dur: 1000, bend: -0.16 });
      c.cue('hover');
      await c.wait(320);
      await c.press(() => c.uncue('on', 's1', 's2', 's3', 's4'));
      await c.wait(500);
      c.uncue('hover');
      await c.leave();
    },
    acts: {
      on: (c) => c.set('on', 's1', 's2', 's3', 's4', 'made'),
      off: (c) => c.set('made'),
    },
  },
};
