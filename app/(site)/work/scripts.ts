import type { Cue, Scene } from '../../_site/cue';
import type { MomentId, TourChapterId } from '../../../content/site/work';

// 每一屏怎么一拍一拍地演（画面在 scenes.tsx，样子在 work.css）。和 Tool 页同一套编排（app/_site/cue.ts）：
// 光标是「你」，杏橙色，只在你动手的时候出现；AI 不用光标，它在写的那行字后面亮一个插入光标和灰名牌，写完就收。
// 一次只动一样：AI 写的时候你不动，你动的时候 AI 停着。每一遍：先停一会儿 → 发生 → 停久一点。
// 要你定的两下（第 4、6 个时刻）交给访客：鼠标变成「你」，五六秒没人按，画面里的「你」替你按。

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

/** AI 连着写几行，名牌跟着最后一行 */
async function writeLines(c: Cue, lines: string[], ai: string, ms = 1000) {
  c.flag(ai, 'on');
  for (const line of lines) {
    c.flag(line, 'on');
    await c.wait(ms);
  }
  c.flag(ai, 'off');
}

/** 你按一下：光标落到按钮上，停一下再按 */
async function tap(c: Cue, target: string, then?: () => void, at: readonly [number, number] = [0.42, 0.58]) {
  await c.to(target, { at, dur: 760 });
  await c.wait(320);
  await c.press(then);
  await c.wait(160);
}

/** 分拍里光标去按下一样：上一拍演完、光标还在画面里，就接着走过去；上一拍是直接摆上的（光标已收起），就从画框外进来 */
async function reach(c: Cue, target: string, at: readonly [number, number]) {
  if (c.stage.querySelector('[data-hand][data-on]')) await c.to(target, { at });
  else await c.enter(target, { at });
}

/** 第 4 个时刻的选择带到第 6 个（导出到 Anki 挪没挪），首屏不受影响 */
function remember(pick: 'yes' | 'no') {
  document.documentElement.dataset.wkAnki = pick;
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

/* ---------- 全景：七段各演一遍，演完换下一段（tour.tsx） ---------- */

export const tourScenes: Record<TourChapterId, Scene> = {
  win: {
    settle: 300,
    rest: 2200,
    async play(c) {
      c.cue('tabs');
      await c.wait(2600);
    },
  },
  dock: {
    settle: 300,
    rest: 1800,
    async play(c) {
      c.use();
      await c.enter('t-dock', { at: [0.5, 0.55] });
      await c.wait(260);
      await c.press(() => on(c, 't-plugins'));
      await c.wait(700);
      await c.to('t-made', { at: [0.5, 0.6], dur: 820 });
      c.flag('t-made', 'lit');
      await c.wait(1900);
    },
  },
  rail: {
    settle: 300,
    rest: 1800,
    async play(c) {
      c.use();
      await c.enter('t-shelf-1', { at: [0.45, 0.6] });
      c.flag('t-shelf-1', 'lit');
      await c.wait(500);
      on(c, 't-drop');
      await c.wait(2200);
    },
  },
  float: {
    settle: 300,
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
      await tap(c, 't-todo', () => {
        off(c, 't-ctx');
        on(c, 't-toast');
      });
      await c.aside();
      await c.wait(1300);
    },
  },
  ask: {
    settle: 300,
    rest: 2000,
    async play(c) {
      c.use();
      await c.enter('t-ph', { at: [0.2, 0.55] });
      await c.wait(240);
      await c.press(() => on(c, 't-ask'));
      await c.aside(2.4, 1.6);
      await c.wait(500);
      await write(c, 't-ask-w', 't-ask-ai', 1500);
      on(c, 't-op');
      await c.wait(600);
      await c.to('t-allow', { at: [0.45, 0.6], dur: 800 });
      c.cue('hover');
      await c.wait(1500);
    },
  },
  agents: {
    settle: 300,
    rest: 2200,
    async play(c) {
      on(c, 't-term');
      await c.wait(600);
      on(c, 't-term-0');
      await c.wait(800);
      on(c, 't-term-1');
      await c.wait(900);
      c.flag('t-term-ai', 'on');
      on(c, 't-term-2');
      await c.wait(1100);
      c.flag('t-term-ai', 'off');
      on(c, 't-agents');
      await c.wait(1800);
    },
  },
  wait: {
    settle: 300,
    rest: 2200,
    async play(c) {
      c.use();
      on(c, 't-cap');
      await c.wait(900);
      await c.enter('t-wait', { at: [0.5, 0.6] });
      await c.wait(260);
      await c.press(() => on(c, 't-waitlist'));
      await c.aside(1.5, -2.5);
      await c.wait(1800);
    },
  },
};

/* ---------- 一个周末：六个时刻（weekend.tsx 的画廊，换到哪个演哪个） ---------- */

export const momentScenes: Record<MomentId, Scene> = {
  /** 资料拖进来 → 读 → 项目建议（助理写）→ 你按「采用」→ 一个有内容的项目 */
  idea: {
    settle: 800,
    rest: 4200,
    async play(c) {
      c.use();
      await c.wait(300);
      for (const file of ['i-f0', 'i-f1', 'i-f2']) {
        on(c, file);
        await c.wait(180);
      }
      await c.wait(800);
      for (const file of ['i-f0', 'i-f1', 'i-f2']) {
        c.flag(file, 'in');
        await c.wait(150);
      }
      c.flag('i-zone', 'lit');
      await c.wait(800);
      on(c, 'i-read');
      await c.wait(1900);
      off(c, 'i-arrive');
      on(c, 'i-prop');
      await c.wait(600);
      await writeLines(c, ['i-w0', 'i-w1', 'i-w2'], 'i-ai', 1100);
      await c.wait(500);
      await c.enter('i-adopt', { at: [0.42, 0.6] });
      await c.wait(380);
      await c.press(() => {
        off(c, 'i-prop', 'i-tab0');
        on(c, 'i-tab1', 'i-proj');
      });
      await c.leave();
    },
  },

  /** 从本机导入角色 → 勾三样 → 我的做法 → 三条规矩落进三个 AI 的活里 */
  rules: {
    settle: 800,
    rest: 4200,
    async play(c) {
      c.use();
      await c.wait(300);
      await c.enter('r-import', { at: [0.32, 0.6] });
      await c.wait(300);
      await c.press(() => on(c, 'r-dlg'));
      await c.wait(600);
      for (const box of ['r-c0', 'r-c1', 'r-c2']) {
        await c.to(box, { at: [0.08, 0.55], dur: 520 });
        await c.wait(140);
        await c.press(() => c.flag(box, 'sel'));
        await c.wait(120);
      }
      await tap(c, 'r-go', () => {
        off(c, 'r-dlg');
        on(c, 'r-role');
      });
      await c.leave();
      await c.wait(700);
      for (const index of [0, 1, 2]) {
        c.flag(`r-rule-${index}`, 'lit');
        on(c, `r-o${index}`);
        await c.wait(380);
        await write(c, `r-o${index}-w`, `r-o${index}-ai`, 1050);
        await c.wait(360);
        c.unflag('lit', `r-rule-${index}`);
      }
    },
  },

  /** Claude Code 额度用完 → 「接着做」→ 一排可选的 → 用你自己的 Key 在 Coding 里继续 → 它读到了做到哪 */
  relay: {
    settle: 800,
    rest: 4200,
    async play(c) {
      c.use();
      await c.wait(400);
      c.flag('l-term', 'warn');
      await c.wait(1500);
      await c.enter('l-go', { at: [0.4, 0.6] });
      await c.wait(300);
      await c.press(() => on(c, 'l-menu'));
      await c.wait(500);
      for (const index of [0, 1, 2, 3, 4]) {
        c.flag(`l-w${index}`, 'lit');
        await c.wait(230);
        c.unflag('lit', `l-w${index}`);
      }
      await c.to('l-own', { at: [0.3, 0.55], dur: 700 });
      c.flag('l-own', 'lit');
      await c.wait(520);
      await c.press(() => {
        off(c, 'l-menu', 'l-term', 'l-goal', 'l-tab0');
        on(c, 'l-tab', 'l-dock', 'l-coding', 'dock-cur');
      });
      await c.leave();
      await c.wait(500);
      on(c, 'l-read');
      await c.wait(800);
      await writeLines(c, ['l-w-0', 'l-w-1', 'l-w-2'], 'l-ai', 1050);
      await c.wait(300);
      on(c, 'l-step');
    },
  },

  /** Codex 发来决定请求 → 你打开 → 访客亲手选同意 / 不同意（没人按就替你按「同意」）→ 约定改了，时间线记一笔 */
  nod: {
    settle: 800,
    rest: 4600,
    async play(c) {
      c.use();
      delete c.stage.dataset.pick;
      await c.wait(900);
      await c.enter('n-open', { at: [0.3, 0.62] });
      await c.wait(380);
      await c.press(() => on(c, 'n-form'));
      await c.aside(2.2, 3.2, 700);
      const pick = (await c.ask(['n-yes', 'n-no'], 'n-yes', { wait: 6400, at: [0.08, 0.5] })) === 'n-no' ? 'no' : 'yes';
      c.flag(pick === 'yes' ? 'n-yes' : 'n-no', 'sel');
      c.stage.dataset.pick = pick;
      remember(pick);
      await c.wait(650);
      off(c, 'n-form', 'n-ask', 'n-row', 'n-wait');
      on(c, 'n-state', 'n-log');
      await c.leave();
    },
  },

  /** 底栏说一句 → 创作台给方案、写代码、过检查、试跑 → 底栏多一颗 → 3/4 → Claude Code 用同一个检查台，4/4 */
  tool: {
    settle: 800,
    rest: 4200,
    async play(c) {
      await c.wait(400);
      off(c, 'o-ph');
      on(c, 'o-typed');
      await c.wait(2600);
      c.flag('o-typed', 'sent');
      c.flag('o-ph', 'back');
      off(c, 'o-home', 'o-tab0');
      on(c, 'o-tab1', 'o-builder');
      await c.wait(700);
      await write(c, 'o-plan-w', 'o-plan-ai', 900);
      on(c, 'o-plan-d');
      await c.wait(400);
      on(c, 'o-plan-i');
      await c.wait(900);
      on(c, 'o-steps');
      for (const step of ['o-s0', 'o-s1', 'o-s2']) {
        await c.wait(620);
        c.flag(step, 'ok');
      }
      await c.wait(700);
      off(c, 'o-builder', 'o-tab1');
      on(c, 'o-new', 'o-tab2', 'o-tool', 'dock-cur');
      await c.wait(1900);
      on(c, 'o-term', 'o-t0');
      await c.wait(1100);
      on(c, 'o-t1', 'o-run1');
      c.flag('o-tool', 'pass');
      await c.wait(900);
      on(c, 'o-t2');
    },
  },

  /** Claude Code 报完成 → 收尾未生效，手机上的登录待你验收 → 访客亲手点「验收通过」→ 已完成，上线 */
  done: {
    settle: 800,
    rest: 4600,
    async play(c) {
      c.use();
      await c.wait(700);
      on(c, 'd-log0');
      await c.wait(1800);
      on(c, 'd-gate', 'd-wait');
      c.flag('d-me', 'need');
      await c.wait(700);
      await c.enter('d-me', { at: [0.62, 1.9] });
      await c.ask(['d-ok'], 'd-ok', { wait: 6400, at: [0.4, 0.58] });
      c.flag('d-me', 'ok');
      off(c, 'd-gate', 'd-wait');
      on(c, 'd-state', 'd-closed', 'd-log1');
      await c.leave();
      await c.wait(900);
      on(c, 'd-ship');
    },
  },
};

/* ---------- 一个周末：宽屏钉住时按滚动分拍 ----------
   往下滚一拍演一拍，往回滚就摆回上一拍演完的样子（CSS 过渡自己倒回去）；窄屏和没钉住时仍用上面的 momentScenes。
   第 0 拍是开场的空白；要访客亲手定的那一下（第 4、6 个时刻）放在最后一拍，定了就演到结果。 */

export type Beat = {
  /** 这一拍新添的记号：几拍叠起来就是演到这一拍的样子（倒着滚、跳着滚时直接摆上） */
  mark?: (c: Cue) => void;
  /** 从上一拍演到这一拍，最后落在和 mark 叠起来一样的样子；第 0 拍是开场的空白，不演 */
  play?: (c: Cue) => Promise<void>;
};

const IDEA_FILES = ['i-f0', 'i-f1', 'i-f2'];
const IDEA_LINES = ['i-w0', 'i-w1', 'i-w2'];
const RULES_BOXES = ['r-c0', 'r-c1', 'r-c2'];
const RELAY_LINES = ['l-w-0', 'l-w-1', 'l-w-2'];
const RELAY_GONE = ['l-menu', 'l-term', 'l-goal', 'l-tab0'];
const RELAY_CODING = ['l-tab', 'l-dock', 'l-coding', 'dock-cur'];
const TOOL_STEPS = ['o-s0', 'o-s1', 'o-s2'];

/** 第 4 个时刻定下来的样子：同意或不同意，约定和时间线跟着变 */
function nodded(c: Cue, pick: 'yes' | 'no') {
  c.flag(pick === 'yes' ? 'n-yes' : 'n-no', 'sel');
  c.stage.dataset.pick = pick;
  off(c, 'n-form', 'n-ask', 'n-row', 'n-wait');
  on(c, 'n-state', 'n-log');
}

/** 第 6 个时刻验收以后：收尾生效、已完成 */
function accepted(c: Cue) {
  c.flag('d-me', 'ok');
  off(c, 'd-gate', 'd-wait');
  on(c, 'd-state', 'd-closed', 'd-log1');
}

export const momentBeats: Record<MomentId, Beat[]> = {
  /** 空的新项目 → 三份资料丢进来、读完 → 助理写成项目建议 → 你按「采用」，一个有内容的项目 */
  idea: [
    {},
    {
      mark(c) {
        on(c, ...IDEA_FILES);
        IDEA_FILES.forEach((file) => c.flag(file, 'in'));
        c.flag('i-zone', 'lit');
        on(c, 'i-read');
      },
      async play(c) {
        await c.wait(200);
        for (const file of IDEA_FILES) {
          on(c, file);
          await c.wait(160);
        }
        await c.wait(600);
        for (const file of IDEA_FILES) {
          c.flag(file, 'in');
          await c.wait(140);
        }
        c.flag('i-zone', 'lit');
        await c.wait(600);
        on(c, 'i-read');
      },
    },
    {
      mark(c) {
        off(c, 'i-arrive');
        on(c, 'i-prop', ...IDEA_LINES);
      },
      async play(c) {
        off(c, 'i-arrive');
        on(c, 'i-prop');
        await c.wait(550);
        await writeLines(c, IDEA_LINES, 'i-ai', 950);
      },
    },
    {
      mark(c) {
        off(c, 'i-prop', 'i-tab0');
        on(c, 'i-tab1', 'i-proj');
      },
      async play(c) {
        c.use();
        await c.wait(200);
        await c.enter('i-adopt', { at: [0.42, 0.6] });
        await c.wait(320);
        await c.press(() => {
          off(c, 'i-prop', 'i-tab0');
          on(c, 'i-tab1', 'i-proj');
        });
        await c.leave();
      },
    },
  ],

  /** 角色页 → 从本机导入，勾三样 → 导入，「我的做法」三条 → 三条规矩各落进一个 AI 的活里 */
  rules: [
    {},
    {
      mark(c) {
        on(c, 'r-dlg');
        RULES_BOXES.forEach((box) => c.flag(box, 'sel'));
      },
      async play(c) {
        c.use();
        await c.wait(200);
        await c.enter('r-import', { at: [0.32, 0.6] });
        await c.wait(260);
        await c.press(() => on(c, 'r-dlg'));
        await c.wait(500);
        for (const box of RULES_BOXES) {
          await c.to(box, { at: [0.08, 0.55], dur: 480 });
          await c.wait(120);
          await c.press(() => c.flag(box, 'sel'));
          await c.wait(100);
        }
      },
    },
    {
      mark(c) {
        off(c, 'r-dlg');
        on(c, 'r-role');
      },
      async play(c) {
        c.use();
        await reach(c, 'r-go', [0.42, 0.58]);
        await c.wait(300);
        await c.press(() => {
          off(c, 'r-dlg');
          on(c, 'r-role');
        });
        await c.wait(160);
        await c.leave();
      },
    },
    {
      mark(c) {
        for (const index of [0, 1, 2]) on(c, `r-o${index}`, `r-o${index}-w`);
      },
      async play(c) {
        await c.wait(300);
        for (const index of [0, 1, 2]) {
          c.flag(`r-rule-${index}`, 'lit');
          on(c, `r-o${index}`);
          await c.wait(340);
          await write(c, `r-o${index}-w`, `r-o${index}-ai`, 950);
          await c.wait(280);
          c.unflag('lit', `r-rule-${index}`);
        }
      },
    },
  ],

  /** Claude Code 额度用完 → 你按「接着做」，一排能接手的 → 选在 Coding 里用你的 Key 继续，它先读目标 → 接着写，改动等你审查 */
  relay: [
    {},
    {
      mark(c) {
        c.flag('l-term', 'warn');
        on(c, 'l-menu');
      },
      async play(c) {
        c.use();
        await c.wait(200);
        c.flag('l-term', 'warn');
        await c.wait(1100);
        await c.enter('l-go', { at: [0.4, 0.6] });
        await c.wait(260);
        await c.press(() => on(c, 'l-menu'));
        await c.wait(400);
        for (const index of [0, 1, 2, 3, 4]) {
          c.flag(`l-w${index}`, 'lit');
          await c.wait(210);
          c.unflag('lit', `l-w${index}`);
        }
      },
    },
    {
      mark(c) {
        c.flag('l-own', 'lit');
        off(c, ...RELAY_GONE);
        on(c, ...RELAY_CODING, 'l-read');
      },
      async play(c) {
        c.use();
        await reach(c, 'l-own', [0.3, 0.55]);
        c.flag('l-own', 'lit');
        await c.wait(460);
        await c.press(() => {
          off(c, ...RELAY_GONE);
          on(c, ...RELAY_CODING);
        });
        await c.leave();
        await c.wait(400);
        on(c, 'l-read');
      },
    },
    {
      mark(c) {
        on(c, ...RELAY_LINES, 'l-step');
      },
      async play(c) {
        await c.wait(300);
        await writeLines(c, RELAY_LINES, 'l-ai', 950);
        await c.wait(300);
        on(c, 'l-step');
      },
    },
  ],

  /** Codex 发来决定请求 → 你打开，亲手选（五六秒没人按就替你按「同意」），约定改了，时间线记一笔 */
  nod: [
    {
      mark(c) {
        delete c.stage.dataset.pick;
      },
    },
    {
      mark(c) {
        nodded(c, document.documentElement.dataset.wkAnki === 'no' ? 'no' : 'yes');
      },
      async play(c) {
        c.use();
        await c.wait(300);
        await c.enter('n-open', { at: [0.3, 0.62] });
        await c.wait(320);
        await c.press(() => on(c, 'n-form'));
        await c.aside(2.2, 3.2, 700);
        const pick = (await c.ask(['n-yes', 'n-no'], 'n-yes', { wait: 6400, at: [0.08, 0.5] })) === 'n-no' ? 'no' : 'yes';
        c.flag(pick === 'yes' ? 'n-yes' : 'n-no', 'sel');
        remember(pick);
        await c.wait(650);
        nodded(c, pick);
        await c.leave();
      },
    },
  ],

  /** 底栏说一句 → 创作台给方案、写代码、过检查、试跑 → 底栏多一颗，3/4 → Claude Code 用同一个检查台，4/4 */
  tool: [
    {},
    {
      mark(c) {
        off(c, 'o-ph', 'o-home', 'o-tab0');
        on(c, 'o-typed', 'o-tab1', 'o-builder');
        c.flag('o-typed', 'sent');
        c.flag('o-ph', 'back');
      },
      async play(c) {
        await c.wait(300);
        off(c, 'o-ph');
        on(c, 'o-typed');
        await c.wait(2600);
        c.flag('o-typed', 'sent');
        c.flag('o-ph', 'back');
        off(c, 'o-home', 'o-tab0');
        on(c, 'o-tab1', 'o-builder');
      },
    },
    {
      mark(c) {
        on(c, 'o-plan-w', 'o-plan-d', 'o-plan-i', 'o-steps');
        TOOL_STEPS.forEach((step) => c.flag(step, 'ok'));
      },
      async play(c) {
        await c.wait(400);
        await write(c, 'o-plan-w', 'o-plan-ai', 850);
        on(c, 'o-plan-d');
        await c.wait(380);
        on(c, 'o-plan-i');
        await c.wait(800);
        on(c, 'o-steps');
        for (const step of TOOL_STEPS) {
          await c.wait(560);
          c.flag(step, 'ok');
        }
      },
    },
    {
      mark(c) {
        off(c, 'o-builder', 'o-tab1');
        on(c, 'o-new', 'o-tab2', 'o-tool', 'dock-cur');
      },
      async play(c) {
        await c.wait(300);
        off(c, 'o-builder', 'o-tab1');
        on(c, 'o-new', 'o-tab2', 'o-tool', 'dock-cur');
      },
    },
    {
      mark(c) {
        on(c, 'o-term', 'o-t0', 'o-t1', 'o-run1', 'o-t2');
        c.flag('o-tool', 'pass');
      },
      async play(c) {
        await c.wait(300);
        on(c, 'o-term', 'o-t0');
        await c.wait(1000);
        on(c, 'o-t1', 'o-run1');
        c.flag('o-tool', 'pass');
        await c.wait(850);
        on(c, 'o-t2');
      },
    },
  ],

  /** 目标页 → Claude Code 报完成，收尾未生效、手机上的登录待你验收 → 你亲手点「验收通过」（没人按就替你按），已完成，上线 */
  done: [
    {},
    {
      mark(c) {
        on(c, 'd-log0', 'd-gate', 'd-wait');
        c.flag('d-me', 'need');
      },
      async play(c) {
        await c.wait(300);
        on(c, 'd-log0');
        await c.wait(1500);
        on(c, 'd-gate', 'd-wait');
        c.flag('d-me', 'need');
      },
    },
    {
      mark(c) {
        accepted(c);
        on(c, 'd-ship');
      },
      async play(c) {
        c.use();
        await c.wait(300);
        await c.enter('d-me', { at: [0.62, 1.9] });
        await c.ask(['d-ok'], 'd-ok', { wait: 6400, at: [0.4, 0.58] });
        accepted(c);
        await c.leave();
        await c.wait(800);
        on(c, 'd-ship');
      },
    },
  ],
};
