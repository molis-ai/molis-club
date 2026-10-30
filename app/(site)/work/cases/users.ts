// 写代码 · 长出自己的工具：从一句闲聊，到一个插件（模拟用户）。
// 阿哲让 AI 假装成新用户试了一遍，你说要是每次发版前都能这样试就好了；助理接住，带着一版插件来，只问三件事；
// 插件创作台里界面一块块放、功能一根根接，你中途说想看每个人的屏幕；三个人同时去试，问题写进 Pages；Codex 和 Claude Code 各修一条，再试一遍。
import css from './scene.css?raw';
import studioCss from './studio.css?raw';
import usersCss from './users.css?raw';
import html from './users.html?raw';
import { createStudio, svg, type Act, type CaseSpec } from './runtime';

type Persona = {
  av: string;
  name: string;
  who: string;
  where: string;
  what: string;
  want: string;
  path?: string[];
  again?: string[];
  short?: string;
  bad?: string;
  ev?: string;
};

// 一句话生成的三个人：谁、在哪儿、要做什么、想要什么；path 是 AI 替他走的路
const PERSONAS: Persona[] = [
  { av: 'A', name: 'Ana Souza', who: '开源维护者，只读英文', where: 'Linux · English 界面', what: '把一个 bug 交给 AI 修', want: '全程是英文',
    path: ['切到 English', '打开设置', '看到中文「外观」'], again: ['打开设置', '全是英文了'],
    short: '设置页还有 3 处中文', bad: '英文界面的设置页里，还有 3 处中文', ev: '截图 2 张' },
  { av: '周', name: '周牧', who: '创业公司 CTO，常在手机上', where: 'iPhone · 地铁上', what: '回阿哲一句话', want: '三下之内发出去',
    path: ['打开项目讨论', '点输入框', '键盘挡住了发送键'], again: ['点输入框', '发送键在键盘上面'],
    short: '键盘挡住了发送键', bad: '手机上键盘弹起，挡住了发送键', ev: '录屏 1 段' },
  { av: '陈', name: '陈珂', who: '产品经理，不写代码', where: 'Mac · 中文界面', what: '写一页需求，交给开发', want: '看得到谁在做',
    path: ['写好一页需求', '点「交给开发」', '看到两人在做'] },
];
// 创作台自己试的那一句
const SAMPLES: Persona[] = [
  { av: '林', name: '林一', who: '独立开发者', where: 'MacBook · 夜里', what: '一晚上做完一个功能', want: '不用翻文档' },
  { av: '苏', name: '苏米', who: '设计师，用 iPad', where: 'iPad · 咖啡馆', what: '给设计稿留意见', want: '一眼看到改了哪' },
  { av: '高', name: '高原', who: '运维，只用键盘', where: 'Linux · 终端旁', what: '查昨晚谁改了配置', want: '不碰鼠标' },
];
// Computer Use 的光标在三块屏幕上走的位置
const DOTPOS: number[][][] = [
  [[80, 36], [28, 52], [28, 66]],
  [[50, 34], [40, 90], [80, 90]],
  [[44, 36], [24, 82], [72, 82]],
];

export const users: CaseSpec = {
  html,
  css: css + studioCss + usersCss,
  peer: '#56678a',
  cast(rt) {
    const { $, scene, conv, sleep, on, box, flash, PTR, ptAt, moveTo, click, away, packet, post, pline, typeInto, blank, say, stepText } = rt;
    const alignSockets = () => {
      const cv = box($('canvas'));
      const at = (id: string, el: Element, fy: number) => {
        $(id).style.top = `${box(el).y + box(el).h * fy - cv.y}px`;
      };
      at('sk-model', $('b-gen'), 0.5);
      at('sk-cu', $('b-pc2'), 0.4);
      at('sk-pages', $('b-rep'), 0.5);
    };
    const { botAt, botTo, botsAway, log, select, follow, resetStudio, grow, place, connect } = createStudio(rt, {
      sockets: { model: '模型', cu: 'Computer Use', pages: 'Pages' },
      align: alignSockets,
    });

  // ---------- 插件：三个人、三块屏幕 ----------
  function devHTML(i: number, pre: string) {
    const id = `${pre}-dev${i}`;
    const tail = `<i class="cu-dot"></i><div class="dv-idle">${svg('monitor')}</div>`;
    if (i === 0) return `<div class="dev lap" id="${id}" data-s="idle"><div class="dv-bar"><span>Settings</span><i></i><i></i><i></i></div><div class="dv-body"><div class="rw"><span>Language</span><em>English</em></div><div class="rw zh"><span class="z">外观</span><span class="e">Appearance</span><em>Light</em></div><div class="rw zh"><span class="z">字体</span><span class="e">Font</span><em>Jost</em></div><div class="rw zh"><span class="z">快捷键</span><span class="e">Shortcuts</span><em>⌘K</em></div></div>${tail}</div>`;
    if (i === 1) return `<div class="dev phone" id="${id}" data-s="idle"><i class="ph-isl"></i><div class="ph-h">项目讨论</div><div class="ph-m"><b style="width:72%"></b><b class="r" style="width:55%"></b><b style="width:64%"></b><b class="r" style="width:42%"></b></div><div class="ph-in">回一句…<span class="ph-send">${svg('send')}</span></div><div class="ph-kb"></div>${tail}</div>`;
    return `<div class="dev mac" id="${id}" data-s="idle"><div class="dv-bar"><i></i><i></i><i></i><span>需求 · 导出 PDF</span></div><div class="dv-body mac-b"><b class="ln" style="width:82%"></b><b class="ln" style="width:64%"></b><b class="ln" style="width:72%"></b><div class="mac-f"><span class="mac-btn">交给开发</span><span class="mac-who"><i>哲</i><i class="sq">C</i>在做</span></div></div>${tail}</div>`;
  }
  function pcHTML(p: Persona, i: number, pre: string, mode: 'skel' | 'sample' | 'real') {
    const sk = (w: number) => `<i class="skl" style="width:${w}%"></i>`;
    const skel = mode === 'skel';
    const head = skel
      ? `<span class="pav"></span><span class="pc-n">${sk(52)}${sk(84)}</span>`
      : `<span class="pav">${p.av}</span><span class="pc-n"><b>${p.name}</b><small>${p.who}</small></span>`;
    const dl = [['在哪儿', p.where], ['要做', p.what], ['想要', p.want]]
      .map(([k, v], j) => `<div><dt>${k}</dt><dd>${skel ? sk([74, 62, 48][j]) : v}</dd></div>`).join('');
    const scr = mode === 'real' ? devHTML(i, pre) : `<div class="dv-idle">${svg('monitor')}</div>`;
    return `<div class="pc" id="${pre}-pc${i}"><div class="pc-h">${head}</div><dl class="pc-f">${dl}</dl>`
      + `<div class="pc-scr"><div><div class="scr" id="${pre}-scr${i}">${scr}</div></div></div>`
      + `<div class="pc-res" id="${pre}-res${i}" data-s="idle"><span class="r-idle">等着开始</span><span class="r-run">${svg('loader-circle', 'spin')}<em></em></span><span class="r-bad">${svg('circle-alert')}<em>${p.short || ''}</em></span><span class="r-ok">${svg('check')}顺利</span><span class="r-fixed">${svg('check')}复测通过</span></div></div>`;
  }
  function plugHTML(pre: string, build: boolean) {
    const gh = (t: string) => (build ? `<span class="gh">${t}</span>` : '');
    return `<div class="plug${build ? '' : ' real'}" id="${pre}-plug"${build ? '' : ' data-scr'}>`
      + `<div class="part pl-h" data-part="head">${gh('标题')}<span class="appic">${svg('users')}</span><span class="t"><b>模拟用户</b><small>一句话，生成几个不同的人，替他们把产品用一遍</small></span>${build ? '' : `<span class="auto" id="${pre}-auto">${svg('rotate-cw')}每次发版前自动试</span>`}</div>`
      + `<div class="part pl-in" data-part="input" id="${pre}-in">${gh('一句话输入')}<span class="ph" id="${pre}-ph">一句话说说你的用户</span><span class="btn" id="${pre}-gen">${svg('sparkles')}生成</span></div>`
      + `<div class="part pl-cards" data-part="cards" id="${pre}-cards">${gh('人物卡 × 3')}${PERSONAS.map((p, i) => pcHTML(p, i, pre, build ? 'skel' : 'real')).join('')}</div>`
      + `<div class="part pl-foot" data-part="foot">${gh('开始试 · 写进 Pages')}<span class="btn" id="${pre}-run">${svg('play')}开始试</span><span class="pl-rep" id="${pre}-rep">${svg('file-text')}问题写进 Pages</span></div>`
      + '</div>';
  }
  // AI 替一个人走一遍路
  async function runPerson(alive: () => boolean, i: number, path: string[], end: string) {
    const dev = $('p-dev' + i);
    const res = $('p-res' + i);
    const pc = $('p-pc' + i);
    const dot = rt.q(dev, '.cu-dot');
    const off = 3 - path.length;
    dev.removeAttribute('data-kb');
    dev.removeAttribute('data-k');
    dev.dataset.s = 'run';
    res.dataset.s = 'run';
    pc.setAttribute('data-run', '');
    for (let k = 0; k < path.length; k++) {
      const n = k + off;
      stepText(rt.q(res, '.r-run em'), path[k]);
      const [x, y] = DOTPOS[i][n];
      dot.style.left = x + '%';
      dot.style.top = y + '%';
      if (i === 1 && n >= 1) dev.setAttribute('data-kb', '');
      if (i === 2 && n >= 1) dev.dataset.k = String(n);
      await sleep(1050); if (!alive()) return;
    }
    pc.removeAttribute('data-run');
    dev.dataset.s = end;
    res.dataset.s = end;
    if (end === 'fixed') flash(pc);
  }
  const ist = (i: number, s: string) => { $('ist' + i).dataset.s = s; };

  // 左边的工作面：Pages、创作台、插件、报告，标签与底栏跟着换
  const VIEWS = ['doc', 'studio', 'plugin', 'report'];
  function show(v: string) {
    VIEWS.forEach((k) => {
      $('v-' + k).toggleAttribute('data-off', k !== v);
      on($('tab-' + k), k === v);
    });
    on($('dk-pages'), v === 'doc' || v === 'report');
    on($('dk-studio'), v === 'studio');
    on($('dk-plugin'), v === 'plugin');
    scene.dataset.v = v;
  }

  function render() {
    $('board').innerHTML = plugHTML('b', true);
    $('v-plugin').innerHTML = plugHTML('p', false);
    $('report').innerHTML = `
      <p class="rp-sum"><span class="swap" id="rp-sum"><span data-a>3 个人试完：2 个人卡住了</span><span data-b>3 个人复测：全部顺利</span></span></p>
      <ul class="iss">${PERSONAS.map((p, i) => (p.bad
        ? `<li class="is" id="is${i}"><span class="thumb">${devHTML(i, 't').replace('data-s="idle"', 'data-s="bad"')}${i ? `<span class="play">${svg('play')}</span>` : ''}</span>`
          + `<span class="w"><b>${p.bad}</b><small>${p.name} · ${p.where} · ${p.ev}</small></span>`
          + `<span class="is-r"><span class="who"><span class="swap" id="iw${i}"><span data-a class="give" id="give${i}">交给我的 Codex</span><span data-b class="got">${i ? '<span class="av zhe">哲</span>Claude Code' : '<span class="av me">你</span>Codex'}</span></span></span>`
          + `<span class="ist" id="ist${i}" data-s="todo"><span class="s-todo">待修</span><span class="s-fix">已修好 · 等复测</span><span class="s-ok">${svg('check')}复测通过</span></span></span></li>`
        : `<li class="is" id="is${i}" data-pass><span class="thumb">${devHTML(i, 't').replace('data-s="idle"', 'data-s="ok"')}</span><span class="w"><b>全程顺利</b><small>${p.name} · ${p.where}</small></span><span class="is-r"><span class="ist" data-s="pass"><span class="s-pass">${svg('check')}顺利</span></span></span></li>`)).join('')}</ul>`;
  }

  function reset() {
    scene.querySelectorAll('.packet, .ripple').forEach((n) => n.remove());
    render();
    conv.innerHTML = '';
    $('log').innerHTML = '';
    blank($('r-ph'), '发送消息…');
    blank($('st-ph'), '边搭边说，随时改');
    resetStudio();
    ['tab-studio', 'tab-plugin', 'tab-report', 'dk-plugin'].forEach((id) => $(id).setAttribute('data-wait', ''));
    $('dk-plugin').classList.remove('new');
    $('seg').dataset.k = 'build';
    $('seg').querySelectorAll('span').forEach((s) => s.toggleAttribute('data-on', s.dataset.k === 'build'));
    scene.dataset.mode = '';
    scene.dataset.focus = '';
    on($('cv-mode'), false);
    $('st-tag').textContent = '搭建中';
    $('st-tag').dataset.s = '';
    $('st-inst').setAttribute('data-dis', '');
    $('st-inst').removeAttribute('data-done');
    on($('inst-pop'), false);
    $('f0').classList.remove('flash');
    on($('sel'), false);
    scene.setAttribute('data-rail', '');
    show('doc');
    away(PTR.hand);
    away(PTR.peer);
    botsAway();
    const saved = rt.instant;
    rt.setInstant(true);
    const s = scene.getBoundingClientRect();
    ptAt(PTR.hand, s.width * 0.5, s.height * 0.92, 0);
    rt.setInstant(saved);
  }

  const PROP = `<div class="prop" id="prop">
      <p class="prop-q"><span>接着你们说的</span><span>「每次发版前，都能找几种人这样试一遍」</span></p>
      <div class="prop-m"><span class="appic">${svg('users')}</span><div><b>做成一个插件：模拟用户</b><p>一句话说你的用户，生成几个不同的人，替他们把产品用一遍。</p></div><span class="sketch"><b class="w5"></b><b></b><span class="row3"><b></b><b></b><b></b></span><b class="w4"></b></span></div>
      <div class="prop-flow"><span>一句话</span>${svg('arrow-right')}<span>3 个人</span>${svg('arrow-right')}<span>替他们去用</span>${svg('arrow-right')}<span>问题写进 Pages</span></div>
      <div class="reveal" id="asks-w"><div><div class="asks">
        <p class="asks-h">动手前，三件事你们定：</p>
        <div class="q"><span class="qt">怎样算问题</span><span class="opts"><span class="opt" id="q1"><i class="pd" data-k="me"></i>没拿到想要的结果</span><span class="opt">卡住一分钟</span></span></div>
        <div class="q"><span class="qt">在哪儿试</span><span class="opts"><span class="opt" id="q2"><i class="pd" data-k="zhe"></i>各用各的设备和语言</span><span class="opt">都用这台电脑</span></span></div>
        <div class="q"><span class="qt">试出问题后</span><span class="opts"><span class="opt" id="q3"><i class="pd" data-k="me"></i>交给 AI 修，再试一遍</span><span class="opt">只出报告</span></span></div>
        <div class="asks-f"><span class="decided" id="decided"><span class="duo"><span class="av me">你</span><span class="av zhe">哲</span></span>定了</span><span class="go" id="go"><span class="btn" id="go-btn">做出来</span><span class="gs g-work">${svg('loader-circle', 'spin')}在插件创作台搭，随时能看</span><span class="gs g-done">${svg('check')}装好了，在底栏</span></span></div>
      </div></div></div>
    </div>`;

  const acts: Act[] = [
    // 1 群里说起一个愿望：阿哲贴出他手写的那个人，你顺口说了一句「要是……就好了」
    async (alive) => {
      await sleep(400); if (!alive()) return;
      post('zhe', `昨天让 AI 假装成一个新用户，把咱们产品从头用了一遍。<div><span class="chip">${svg('file-text')}让 AI 假装成新用户，试一遍</span></div>`, '16:02');
      await sleep(2300); if (!alive()) return;
      await say('试出什么了？', '16:03'); if (!alive()) return;
      await sleep(900); if (!alive()) return;
      post('zhe', '6 个问题。比如她删掉一段想撤销，找了半天没找到。', '16:03');
      flash($('f0'), 'flash', 1800);
      await sleep(2300); if (!alive()) return;
      post('zhe', '我们自己天天用，根本不会这么点。', '16:03', { cont: true });
      await sleep(1900); if (!alive()) return;
      await say('要是每次发版前，都能找几种人这样试一遍就好了。', '16:04', '每次发版前，都能找几种人这样试一遍'); if (!alive()) return;
      await sleep(1200); if (!alive()) return;
      post('zhe', '可光写她一个人，就花了我<span class="hear">一上午</span>。', '16:04');
      await sleep(1800);
    },
    // 2 助理接住：没人叫它；先听到那半句，做好准备再开口，只问三件事
    async (alive) => {
      scene.dataset.focus = 'rail';
      conv.querySelectorAll('.hear').forEach((h) => on(h));
      const mine = [...conv.querySelectorAll<HTMLElement>('.mine > div')].pop()!;
      mine.setAttribute('data-heard', '');
      await sleep(1400); if (!alive()) return;
      const m = post('ai', `<div class="reveal" id="prep-w" data-on><div><div class="prep">${svg('loader-circle', 'spin')}<span class="ticker" id="ticker"><span>读阿哲的文档</span><span>查项目里现成的能力</span><span>画一版草图</span></span></div></div></div><div class="reveal" id="prop-w"><div>${PROP}</div></div>`, '16:05', { card: true });
      const av = rt.q(m, '.av');
      av.classList.add('thinking');
      const tk = [...$('ticker').children];
      for (let k = 0; k < tk.length; k++) {
        if (k) tk[k - 1].setAttribute('data-gone', '');
        on(tk[k]);
        await sleep(1000); if (!alive()) return;
      }
      av.classList.remove('thinking');
      on($('prep-w'), false);
      on($('prop-w'));
      await sleep(3600); if (!alive()) return;
      on($('asks-w'));
      await sleep(1700); if (!alive()) return;
      await moveTo($('q1')); if (!alive()) return;
      await click($('q1')); if (!alive()) return;
      $('q1').setAttribute('data-pick', '');
      await sleep(300); if (!alive()) return;
      // 阿哲在他那边点了第二件
      if (!rt.instant) {
        const q = box($('q2'));
        ptAt(PTR.peer, q.x - q.w * 0.4, q.y + q.h * 2.4, 0);
      }
      await moveTo($('q2'), 0.5, 0.6, PTR.peer); if (!alive()) return;
      await click($('q2'), PTR.peer); if (!alive()) return;
      $('q2').setAttribute('data-pick', '');
      await sleep(350); if (!alive()) return;
      away(PTR.peer);
      await moveTo($('q3')); if (!alive()) return;
      await click($('q3')); if (!alive()) return;
      $('q3').setAttribute('data-pick', '');
      await sleep(450); if (!alive()) return;
      on($('decided'));
      $('go').dataset.s = 'ask';
      await sleep(900); if (!alive()) return;
      await moveTo($('go-btn')); if (!alive()) return;
      await click($('go-btn')); if (!alive()) return;
      away();
      $('go').dataset.s = 'work';
      await sleep(600); if (!alive()) return;
      $('tab-studio').removeAttribute('data-wait');
      await packet($('prop'), $('tab-studio'), `<span class="appic">${svg('users')}</span>模拟用户`); if (!alive()) return;
      scene.removeAttribute('data-rail');
      scene.dataset.focus = '';
      show('studio');
      follow(650);
      await sleep(800);
    },
    // 3 看着它搭出来：界面一块块放，功能一根根接；你中途插一句，它停下来照着改
    async (alive) => {
      follow(0);
      const cv = box($('canvas'));
      botAt('ui', cv.x + cv.w * 0.35, cv.y + cv.h * 0.15, 0);
      botAt('fn', cv.x + cv.w * 0.6, cv.y + cv.h * 0.85, 0);
      await sleep(500); if (!alive()) return;
      await place('head', '放入标题'); if (!alive()) return;
      await place('input', '放入一句话输入'); if (!alive()) return;
      await connect($('b-gen'), 'model', '生成人物'); if (!alive()) return;
      await place('cards', '放入 3 张人物卡'); if (!alive()) return;
      await connect($('b-pc2'), 'cu', '替他们去用', 0.22); if (!alive()) return;
      // 它还在放，你已经开始打字
      await moveTo($('st-ph'), 0.3, 0.55); if (!alive()) return;
      await click($('st-ph')); if (!alive()) return;
      away();
      const typing = typeInto($('st-ph'), '试的时候，我想看到每个人的屏幕');
      await place('foot', '放入开始试'); if (!alive()) return;
      await typing; if (!alive()) return;
      await sleep(350); if (!alive()) return;
      blank($('st-ph'), '边搭边说，随时改');
      log('you', '试的时候，我想看到每个人的屏幕');
      await sleep(800); if (!alive()) return;
      log('note', '先停一下，照你说的改，别的不动');
      grow(4);
      await sleep(900); if (!alive()) return;
      await botTo('ui', $('b-pc1'), '每张卡加一块屏幕', 0.1, 0.55); if (!alive()) return;
      log('ui', '<b>界面</b> 每张卡加一块屏幕');
      $('b-plug').setAttribute('data-scr', '');
      follow(750);
      await sleep(700); if (!alive()) return;
      select($('b-cards'), 1100);
      await sleep(700); if (!alive()) return;
      await connect($('b-scr2'), 'cu', '看每个人的屏幕'); if (!alive()) return;
      await connect($('b-rep'), 'pages', '写报告'); if (!alive()) return;
      log('okl', '4 项功能都接通了');
      botsAway();
      await sleep(900); if (!alive()) return;
      // 切到试用：它自己先试一句
      await moveTo($('seg-try')); if (!alive()) return;
      await click($('seg-try')); if (!alive()) return;
      away();
      $('seg').dataset.k = 'try';
      $('seg').querySelectorAll('span').forEach((s) => s.toggleAttribute('data-on', s.dataset.k === 'try'));
      scene.dataset.mode = 'try';
      await typeInto($('b-ph'), '独立开发者', 70); if (!alive()) return;
      flash($('b-gen'), 'hit', 200);
      await sleep(350); if (!alive()) return;
      SAMPLES.forEach((p, i) => { $('b-pc' + i).outerHTML = pcHTML(p, i, 'b', 'sample'); });
      [0, 1, 2].forEach((i) => {
        $(`b-res${i}`).dataset.s = 'run';
        rt.q($(`b-res${i}`), 'em').textContent = '试着用';
      });
      await sleep(1300); if (!alive()) return;
      [0, 1, 2].forEach((i) => { $('b-res' + i).dataset.s = 'ok'; });
      on($('cv-mode'));
      log('okl', '自己试了一句「独立开发者」：生成、去用、写报告都通');
      $('st-tag').textContent = '可以安装';
      $('st-tag').dataset.s = 'ok';
      $('st-inst').removeAttribute('data-dis');
      await sleep(1300); if (!alive()) return;
      // 安装：先看它要用到什么
      await moveTo($('st-inst')); if (!alive()) return;
      await click($('st-inst')); if (!alive()) return;
      on($('inst-pop'));
      await sleep(2200); if (!alive()) return;
      await moveTo($('inst-ok')); if (!alive()) return;
      await click($('inst-ok')); if (!alive()) return;
      away();
      on($('inst-pop'), false);
      $('st-inst').setAttribute('data-done', '');
      $('st-tag').textContent = 'v1';
      await packet($('st-inst'), $('dk-plugin'), `<span class="appic">${svg('users')}</span>模拟用户`); if (!alive()) return;
      $('dk-plugin').removeAttribute('data-wait');
      $('dk-plugin').classList.add('new');
      $('go').dataset.s = 'done';
      await sleep(900);
    },
    // 4 三个人同时去试：一句话生成三个人，各用各的设备；问题写进 Pages
    async (alive) => {
      await moveTo($('dk-plugin')); if (!alive()) return;
      await click($('dk-plugin')); if (!alive()) return;
      away();
      $('tab-plugin').removeAttribute('data-wait');
      show('plugin');
      await sleep(700); if (!alive()) return;
      await moveTo($('p-in'), 0.25, 0.55); if (!alive()) return;
      await click($('p-in')); if (!alive()) return;
      away();
      await typeInto($('p-ph'), '十人以内的产品团队'); if (!alive()) return;
      await sleep(300); if (!alive()) return;
      await moveTo($('p-gen')); if (!alive()) return;
      await click($('p-gen')); if (!alive()) return;
      away();
      for (let i = 0; i < 3; i++) {
        await sleep(420); if (!alive()) return;
        $('p-pc' + i).setAttribute('data-in', '');
      }
      await sleep(3300); if (!alive()) return;
      await moveTo($('p-run')); if (!alive()) return;
      await click($('p-run')); if (!alive()) return;
      away();
      await Promise.all(PERSONAS.map(async (p, i) => {
        await sleep(i * 320);
        if (alive()) await runPerson(alive, i, p.path ?? [], p.bad ? 'bad' : 'ok');
      })); if (!alive()) return;
      await sleep(900); if (!alive()) return;
      flash($('p-rep'));
      $('tab-report').removeAttribute('data-wait');
      await packet($('p-rep'), $('tab-report'), `${svg('file-text')}试用报告`); if (!alive()) return;
      scene.setAttribute('data-rail', '');
      await sleep(600); if (!alive()) return;
      post('ai', `3 个人试完了，2 个人卡住。问题和截图写进了 Pages：<div><span class="chip" id="rp-chip">${svg('file-text')}试用报告 · 10 月 30 日</span></div>`, '16:31');
      await sleep(1600); if (!alive()) return;
      await moveTo($('rp-chip')); if (!alive()) return;
      await click($('rp-chip')); if (!alive()) return;
      away();
      show('report');
      await sleep(1300);
    },
    // 5 交给 AI 修，再试一遍：你和阿哲各交给自己的 AI；修完照原路再试
    async (alive) => {
      await moveTo($('give0')); if (!alive()) return;
      await click($('give0')); if (!alive()) return;
      away();
      on($('iw0'));
      await sleep(900); if (!alive()) return;
      post('zhe', '手机那条给我，我交给 Claude Code。', '16:33');
      on($('iw1'));
      await sleep(1300); if (!alive()) return;
      post('codex', `<div class="prog" id="prog-cx"><span class="o">${svg('file-text')}读了报告和截图，开工</span></div>`, '16:34');
      await sleep(500); if (!alive()) return;
      post('cc', `<div class="prog" id="prog-cc"><span class="o">${svg('file-text')}读了报告和录屏，开工</span></div>`, '16:34');
      await sleep(1800); if (!alive()) return;
      pline($('prog-cx'), `${svg('check', 'ok')}<span class="ok">3 处补成英文 · 测试通过</span>`);
      ist(0, 'fixed');
      flash($('is0'));
      await sleep(1100); if (!alive()) return;
      pline($('prog-cc'), `${svg('check', 'ok')}<span class="ok">发送键跟着键盘上移 · 测试通过</span>`);
      ist(1, 'fixed');
      flash($('is1'));
      await sleep(1000); if (!alive()) return;
      await packet($('is1'), $('tab-plugin'), `${svg('rotate-cw')}照原路再试`); if (!alive()) return;
      [0, 1].forEach((i) => {
        $('p-dev' + i).dataset.s = 'idle';
        $('p-dev' + i).setAttribute('data-fix', '');
        $('p-res' + i).dataset.s = 'idle';
      });
      show('plugin');
      await sleep(600); if (!alive()) return;
      await Promise.all([0, 1].map(async (i) => {
        await sleep(i * 320);
        if (alive()) await runPerson(alive, i, PERSONAS[i].again ?? [], 'fixed');
      })); if (!alive()) return;
      ist(0, 'ok');
      ist(1, 'ok');
      on($('rp-sum'));
      await sleep(600); if (!alive()) return;
      post('ai', `两条都修好了，照原路又试了一遍，3 个人都顺利。以后每次发版前，都自动这样试一遍？<div id="auto-q"><div class="btns"><span class="btn" id="auto-ok">好</span><span class="btn ghost">先不用</span></div><span class="okline">${svg('check')}每次发版前自动试 · 你定的</span></div>`, '17:20');
      await sleep(2000); if (!alive()) return;
      await moveTo($('auto-ok')); if (!alive()) return;
      await click($('auto-ok')); if (!alive()) return;
      away();
      $('auto-q').setAttribute('data-done', '');
      on($('p-auto'));
      await sleep(1200);
    },
  ];

    return { reset, acts };
  },
};
