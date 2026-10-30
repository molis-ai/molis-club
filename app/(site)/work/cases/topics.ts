// 做内容、运营 · 长出自己的工具：从一句闲聊，到一个插件（每日选题）。
// 小林花一上午翻了 30 个账号，你说要是每天早上它自己挑好就好了；助理接住，带着「每日选题」来，只问三件事；
// 创作台里界面一块块放、功能一根根接，你中途说写过的别再推；第二天早上三个题，各写清为什么现在写、依据在哪；
// 你发现一条依据是转述，跟助理说一句，它改了规则重出。选题的写法照 Content Growth Studio：价值路径、审过的结果、依据可回查、对过写过的。
import css from './scene.css?raw';
import studioCss from './studio.css?raw';
import topicsCss from './topics.css?raw';
import html from './topics.html?raw';
import { createStudio, svg, type Act, type CaseSpec } from './runtime';

type Topic = {
  vp: string;
  rv: string;
  t: string;
  who: string;
  why: string;
  src: string[];
  have: string;
  seen: [string, string];
  note?: [string, string];
};

// 第二天早上的三个题：照 CGS 的选题法写清价值路径、审过的结果、给谁看、为什么现在、依据、同题已有，再对过写过的
const TOPICS: Topic[] = [
  { vp: '实用决策', rv: 'pass', t: '放手让 Duet 干活前，先想好哪几件要它等你点头', who: '想让 AI 替自己处理杂事的上班族', why: '上周那篇下面，47 条在问「睡着了它问谁」', src: ['官方说明', '我们的评论区 47 条'], have: '中文几乎没有', seen: ['ang', '上周写过 Duet 上手 · 这是新角度'] },
  { vp: '讨论分歧', rv: 'adjust', t: 'AI 写的周报，老板看得出来吗', who: '用 AI 写周报的上班族', why: '一条笔记 2.1 万赞，评论吵成两派', src: ['小红书 · 2.1 万赞'], have: '12 篇，多是站队', seen: ['', '没写过'], note: ['adj', '收窄成：哪几处一看就是 AI 写的'] },
  { vp: '热点时效', rv: 'research', t: 'Haiku 5.5 出了，普通人要不要换', who: '在用免费版的人', why: '上周发布，问的人多', src: ['博主自述 1 条'], have: '多是跑分', seen: ['', '没写过'], note: ['res', '价格说法只有一条自述，在补'] },
];
const SKIPS: [string, string][] = [['Claude Code 新的环境变量', '对我们的读者没用'], ['Claude 出了会自己干活的 App', '写过，没有新角度']];
// 创作台里拿今天的材料试的那一遍
const SAMPLES: Topic[] = [
  { vp: '实用决策', rv: 'pass', t: 'Claude Dashboards：不会写 SQL 的运营能用吗', who: '做运营、不写代码的人', why: '上手长帖这周多起来', src: ['官方说明', '上手长帖 2 篇'], have: '5 篇', seen: ['', '没写过'] },
  { vp: '案例经验', rv: 'pass', t: '用 Duet 一周，它停下来问了我什么', who: '排上队的早期用户', why: '第一批人用满一周', src: ['用户长帖 3 篇'], have: '几乎没有', seen: ['ang', '写过上手 · 这是新角度'] },
  { vp: '新视角', rv: 'adjust', t: 'AI 做的 PPT，哪几页最容易露馅', who: '要交汇报的上班族', why: '评论区一直有人问', src: ['原帖 4 篇'], have: '8 篇', seen: ['', '没写过'], note: ['adj', '收窄成三页'] },
];

export const topics: CaseSpec = {
  html,
  css: css + studioCss + topicsCss,
  peer: '#a26f7e',
  cast(rt) {
    const { $, scene, conv, sleep, on, box, flash, PTR, ptAt, moveTo, click, away, packet, post, pline, typeInto, blank, say } = rt;
    const alignSockets = () => {
      const cv = box($('canvas'));
      const at = (id: string, el: Element, fy: number) => {
        $(id).style.top = `${box(el).y + box(el).h * fy - cv.y}px`;
      };
      const seen = $('b-plug').hasAttribute('data-seen');
      at('sk-feed', $('b-src'), 0.5);
      at('sk-model', $('b-tc2'), 0.2);
      at('sk-mem', seen ? $('b-seen2') : $('b-tc2'), seen ? 0.5 : 0.58);
      at('sk-create', $('b-act2'), 0.55);
    };
    const { botAt, botTo, botsAway, log, select, follow, resetStudio, grow, place, connect } = createStudio(rt, {
      sockets: { feed: 'Feed', model: '模型', mem: '项目记忆', create: '创作台' },
      align: alignSockets,
    });

  // ---------- 插件：每日选题 ----------
  function tcHTML(p: Topic, i: number, pre: string, mode: 'skel' | 'real') {
    const sk = (w: number) => `<i class="skl" style="width:${w}%"></i>`;
    const skel = mode === 'skel';
    const head = skel
      ? `<span class="vp">${sk(100)}</span><span class="rvw">${sk(100)}</span>`
      : `<span class="vp">${p.vp}</span><span class="rvw" id="${pre}-rv${i}" data-s="${p.rv}"><span class="r-pass">${svg('check')}通过</span><span class="r-adj">${svg('pencil')}调整</span><span class="r-res">${svg('search-check')}补研中</span></span>`;
    const title = skel ? `<div>${sk(94)}${sk(62)}</div>` : `<b class="tc-t">${p.t}</b>`;
    const rows: [string, string | string[]][] = [['给谁看', p.who], ['为什么现在', p.why], ['依据', p.src], ['同题已有', p.have]];
    const dl = rows.map(([k, v], j) => `<div><dt>${k}</dt><dd>${skel ? sk([80, 92, 60, 46][j])
      : Array.isArray(v) ? v.map((x, n) => `<span class="src-chip" id="${pre}-src${i}${n}">${svg('link')}${x}<span class="bad">· 转述，不算</span></span>`).join('') : v}</dd></div>`).join('');
    const note = !skel && p.note
      ? `<div class="tc-note ${p.note[0]}" id="${pre}-note${i}" data-on><span><em>${svg(p.note[0] === 'adj' ? 'pencil' : 'search-check')}<span>${p.note[1]}</span></em></span></div>`
      : `<div class="tc-note" id="${pre}-note${i}"><span><em></em></span></div>`;
    const seen = `<div class="tc-seen" id="${pre}-seen${i}"><span><em class="${skel ? '' : p.seen[0]}">${svg('history')}${skel ? sk(70) : p.seen[1]}</em></span></div>`;
    const act = `<div class="tc-act" id="${pre}-act${i}">${svg('bookmark')}${svg('thumbs-down')}<span class="adopt"><span class="btn" id="${pre}-adopt${i}">采用</span><span class="got">${svg('check')}已采用 · 进创作台</span></span></div>`;
    return `<div class="tc" id="${pre}-tc${i}"><div class="tc-h">${head}</div>${title}<dl class="tc-f">${dl}</dl>${note}${seen}${act}</div>`;
  }
  function plugHTML(pre: string, build: boolean) {
    const gh = (t: string) => (build ? `<span class="gh">${t}</span>` : '');
    const sk = (w: number) => `<i class="skl" style="width:${w}em;display:inline-block;margin:0"></i>`;
    return `<div class="plug${build ? '' : ' real'}" id="${pre}-plug"${build ? '' : ' data-seen'}>`
      + `<div class="part pl-h" data-part="head">${gh('标题')}<span class="appic">${svg('newspaper')}</span><span class="t"><b>每日选题</b><small>每天早上读你们订的来源，挑出值得写的</small></span>${build ? '' : `<span class="auto" id="${pre}-auto">${svg('rotate-cw')}每天 8:00 自动出 · 你定的</span>`}</div>`
      + `<div class="part pl-src" data-part="src" id="${pre}-src">${gh('读哪些来源')}<span>${svg('rss')}订的 30 个 AI 账号</span><span>${svg('search')}小红书关键词 2 个</span><span>${svg('messages-square')}我们的评论区</span><span class="pl-date">${build ? '今天' : '10 月 31 日 周五'} · <b id="${pre}-n">${build ? 3 : 0}</b> 个</span></div>`
      + (build ? '' : `<div class="gen" id="${pre}-gen">${['读来源', '出题', '审一遍', '对过写过的'].map((t, k) => `${k ? '<i></i>' : ''}<span>${svg('check')}${t}</span>`).join('')}</div>`)
      + `<div class="part pl-cards" data-part="cards" id="${pre}-cards">${gh('选题卡 × 3')}${TOPICS.map((p, i) => tcHTML(p, i, pre, build ? 'skel' : 'real')).join('')}</div>`
      + `<div class="part skip" data-part="foot" id="${pre}-skip">${gh('没推的，写上理由')}<b>没推的 2 个</b>${build ? `<span>${sk(9)}</span><span>${sk(8)}</span>` : SKIPS.map(([t, r]) => `<span>「${t}」<i>${r}</i></span>`).join('')}</div>`
      + '</div>';
  }

  // 左边的工作面：Pages、创作台、插件，标签与底栏跟着换
  const VIEWS = ['doc', 'studio', 'plugin'];
  function show(v: string) {
    VIEWS.forEach((k) => {
      $('v-' + k).toggleAttribute('data-off', k !== v);
      on($('tab-' + k), k === v);
    });
    on($('dk-pages'), v === 'doc');
    on($('dk-studio'), v === 'studio');
    on($('dk-plugin'), v === 'plugin');
    scene.dataset.v = v;
  }
  function render() {
    $('board').innerHTML = plugHTML('b', true);
    $('v-plugin').innerHTML = plugHTML('p', false);
  }
  function sheet(html: string) {
    const w = document.createElement('div');
    w.className = 'wrap';
    w.innerHTML = html;
    $('as-in').innerHTML = '';
    $('as-in').appendChild(w);
    on($('asheet'));
    return w;
  }
  function popAt(chip: Element) {
    const r = box(chip);
    const p = $('srcpop');
    p.style.left = r.x + 'px';
    p.style.top = r.y + r.h + 6 + 'px';
    on(p);
  }

  function reset() {
    scene.querySelectorAll('.packet, .ripple').forEach((n) => n.remove());
    render();
    conv.innerHTML = '';
    $('log').innerHTML = '';
    blank($('r-ph'), '发送消息…');
    blank($('st-ph'), '边搭边说，随时改');
    blank($('ask-ph'), '问助理，或按 ⌘K 搜索');
    resetStudio();
    ['tab-studio', 'tab-plugin', 'tab-create', 'dk-plugin'].forEach((id) => $(id).setAttribute('data-wait', ''));
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
    on($('srcpop'), false);
    on($('asheet'), false);
    $('as-in').innerHTML = '';
    $('nt-skip').classList.remove('flash');
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
      <p class="prop-q"><span>接着你们说的</span><span>「每天早上，它自己翻一遍，挑好值得写的」</span></p>
      <div class="prop-m"><span class="appic">${svg('newspaper')}</span><div><b>做成一个插件：每日选题</b><p>每天早上读你们订的来源，挑出值得写的；每个题写清为什么现在写、依据在哪。</p></div><span class="sketch"><b class="w5"></b><b></b><span class="row3"><b></b><b></b><b></b></span><b class="w4"></b></span></div>
      <div class="prop-flow"><span>订的来源</span>${svg('arrow-right')}<span>出题</span>${svg('arrow-right')}<span>审一遍</span>${svg('arrow-right')}<span>采用就起底稿</span></div>
      <div class="reveal" id="asks-w"><div><div class="asks">
        <p class="asks-h">动手前，三件事你们定：</p>
        <div class="q"><span class="qt">怎样算值得写</span><span class="opts"><span class="opt" id="q1"><i class="pd" data-k="me"></i>对读者有用、现在写正好</span><span class="opt">热度高就行</span></span></div>
        <div class="q"><span class="qt">没好题的那天</span><span class="opts"><span class="opt" id="q2"><i class="pd" data-k="lin"></i>宁可空着</span><span class="opt">凑满 5 个</span></span></div>
        <div class="q"><span class="qt">依据不够的题</span><span class="opts"><span class="opt" id="q3"><i class="pd" data-k="me"></i>先补研再推</span><span class="opt">照推，标出来</span></span></div>
        <div class="asks-f"><span class="decided" id="decided"><span class="duo"><span class="av me">你</span><span class="av lin">林</span></span>定了</span><span class="go" id="go"><span class="btn" id="go-btn">做出来</span><span class="gs g-work">${svg('loader-circle', 'spin')}在插件创作台搭，随时能看</span><span class="gs g-done">${svg('check')}装好了，在底栏</span></span></div>
      </div></div></div>
    </div>`;

  const acts: Act[] = [
    // 1 群里说起一个愿望：小林贴出她手工翻的那一遍，你顺口说了一句「要是……就好了」
    async (alive) => {
      await sleep(400); if (!alive()) return;
      post('lin', `昨天花了一上午，把我们关注的 30 个 AI 账号这周的帖子翻了一遍，挑出 3 个能写的。<div><span class="chip">${svg('file-text')}这周 30 个 AI 账号，翻了一遍</span></div>`, '10:12');
      await sleep(2400); if (!alive()) return;
      await say('另外 27 条呢？', '10:13'); if (!alive()) return;
      await sleep(900); if (!alive()) return;
      post('lin', '参数类的、我们写过的、只有转述找不到原帖的，都划掉了。', '10:13');
      flash($('nt-skip'), 'flash', 1800);
      await sleep(2500); if (!alive()) return;
      post('lin', '每条都得点开原帖核一遍，不然不敢写。', '10:13', { cont: true });
      await sleep(1900); if (!alive()) return;
      await say('要是每天早上，它自己翻一遍，挑好值得写的就好了。', '10:14', '每天早上，它自己翻一遍，挑好值得写的'); if (!alive()) return;
      await sleep(1200); if (!alive()) return;
      post('lin', '可光翻一遍就<span class="hear">一上午</span>。', '10:14');
      await sleep(1800);
    },
    // 2 助理接住：没人叫它；先听到那半句，做好准备再开口，只问三件事
    async (alive) => {
      scene.dataset.focus = 'rail';
      conv.querySelectorAll('.hear').forEach((h) => on(h));
      const mine = [...conv.querySelectorAll<HTMLElement>('.mine > div')].pop()!;
      mine.setAttribute('data-heard', '');
      await sleep(1400); if (!alive()) return;
      const m = post('ai', `<div class="reveal" id="prep-w" data-on><div><div class="prep">${svg('loader-circle', 'spin')}<span class="ticker" id="ticker"><span>读小林的笔记</span><span>查订的来源和写过的</span><span>画一版草图</span></span></div></div></div><div class="reveal" id="prop-w"><div>${PROP}</div></div>`, '10:15', { card: true });
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
      await sleep(1900); if (!alive()) return;
      await moveTo($('q1')); if (!alive()) return;
      await click($('q1')); if (!alive()) return;
      $('q1').setAttribute('data-pick', '');
      await sleep(300); if (!alive()) return;
      // 小林在她那边点了第二件
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
      await packet($('prop'), $('tab-studio'), `<span class="appic">${svg('newspaper')}</span>每日选题`); if (!alive()) return;
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
      await place('src', '放入读哪些来源'); if (!alive()) return;
      await connect($('b-src'), 'feed', '读来源'); if (!alive()) return;
      await place('cards', '放入 3 张选题卡'); if (!alive()) return;
      await connect($('b-tc2'), 'model', '出题、审题分开', 0.2); if (!alive()) return;
      // 它还在放，你已经开始打字
      await moveTo($('st-ph'), 0.3, 0.55); if (!alive()) return;
      await click($('st-ph')); if (!alive()) return;
      away();
      const typing = typeInto($('st-ph'), '我们写过的别再推，除非有新角度');
      await place('foot', '放入没推的那一行'); if (!alive()) return;
      await typing; if (!alive()) return;
      await sleep(350); if (!alive()) return;
      blank($('st-ph'), '边搭边说，随时改');
      log('you', '我们写过的别再推，除非有新角度');
      await sleep(800); if (!alive()) return;
      log('note', '先停一下，照你说的改，别的不动');
      grow(4);
      await sleep(900); if (!alive()) return;
      await botTo('ui', $('b-tc1'), '每张卡加一行「写过没有」', 0.1, 0.7); if (!alive()) return;
      log('ui', '<b>界面</b> 每张卡加一行「写过没有」');
      $('b-plug').setAttribute('data-seen', '');
      follow(750);
      await sleep(700); if (!alive()) return;
      select($('b-cards'), 1100);
      await sleep(700); if (!alive()) return;
      await connect($('b-seen2'), 'mem', '对过写过的'); if (!alive()) return;
      await connect($('b-act2'), 'create', '采用就起底稿'); if (!alive()) return;
      log('okl', '4 项功能都接通了');
      botsAway();
      await sleep(900); if (!alive()) return;
      // 切到试用：拿今天的材料先跑一遍
      await moveTo($('seg-try')); if (!alive()) return;
      await click($('seg-try')); if (!alive()) return;
      away();
      $('seg').dataset.k = 'try';
      $('seg').querySelectorAll('span').forEach((s) => s.toggleAttribute('data-on', s.dataset.k === 'try'));
      scene.dataset.mode = 'try';
      await sleep(500); if (!alive()) return;
      SAMPLES.forEach((p, i) => { $('b-tc' + i).outerHTML = tcHTML(p, i, 'b', 'real'); });
      await sleep(1200); if (!alive()) return;
      on($('cv-mode'));
      log('okl', '拿今天的材料试了一遍：出了 4 个，审下来 3 个');
      $('st-tag').textContent = '可以安装';
      $('st-tag').dataset.s = 'ok';
      $('st-inst').removeAttribute('data-dis');
      await sleep(1400); if (!alive()) return;
      // 安装：先看它要用到什么
      await moveTo($('st-inst')); if (!alive()) return;
      await click($('st-inst')); if (!alive()) return;
      on($('inst-pop'));
      await sleep(2400); if (!alive()) return;
      await moveTo($('inst-ok')); if (!alive()) return;
      await click($('inst-ok')); if (!alive()) return;
      away();
      on($('inst-pop'), false);
      $('st-inst').setAttribute('data-done', '');
      $('st-tag').textContent = 'v1';
      await packet($('st-inst'), $('dk-plugin'), `<span class="appic">${svg('newspaper')}</span>每日选题`); if (!alive()) return;
      $('dk-plugin').removeAttribute('data-wait');
      $('dk-plugin').classList.add('new');
      $('go').dataset.s = 'done';
      await sleep(900);
    },
    // 4 第二天早上：读来源、出题、审一遍、对过写过的；三个题，另有两个没推，理由写着
    async (alive) => {
      await moveTo($('dk-plugin')); if (!alive()) return;
      await click($('dk-plugin')); if (!alive()) return;
      away();
      $('tab-plugin').removeAttribute('data-wait');
      show('plugin');
      await sleep(800); if (!alive()) return;
      const stg = [...$('p-gen').querySelectorAll('span')];
      for (let k = 0; k < stg.length; k++) {
        stg[k].dataset.s = 'now';
        await sleep(720); if (!alive()) return;
        stg[k].dataset.s = 'done';
        if (k === 1) {
          for (let i = 0; i < 3; i++) {
            $(`p-tc${i}`).setAttribute('data-in', '');
            $('p-n').textContent = `${i + 1}`;
            await sleep(260);
            if (!alive()) return;
          }
        }
      }
      $('p-skip').setAttribute('data-in', '');
      flash(rt.q($('p-seen0'), 'em'), 'hit', 400);
      await sleep(4200);
    },
    // 5 不对就说，改了再出：一条依据是转述，跟助理说一句，它改规则重出；采用的题进创作台
    async (alive) => {
      await moveTo($('p-src10'), 0.5, 0.6); if (!alive()) return;
      await click($('p-src10')); if (!alive()) return;
      popAt($('p-src10'));
      await sleep(2600); if (!alive()) return;
      await moveTo($('ask'), 0.3, 0.55); if (!alive()) return;
      await click($('ask')); if (!alive()) return;
      away();
      await typeInto($('ask-ph'), '转述不算依据，要原帖。'); if (!alive()) return;
      await sleep(300); if (!alive()) return;
      blank($('ask-ph'), '问助理，或按 ⌘K 搜索');
      on($('srcpop'), false);
      const w = sheet(`<p class="as-head"><span class="av sq ai">${svg('sparkles')}</span><b>助理</b>你的</p><p class="as-me">转述不算依据，要原帖。</p><div class="as-ai" id="as-ai"></div>`);
      await sleep(900); if (!alive()) return;
      pline($('as-ai'), `${svg('check', 'ok')}改了「每日选题」的一条规则：依据要能点到原帖，转述不算<span class="ver">v2</span>`);
      await sleep(1300); if (!alive()) return;
      pline($('as-ai'), `${svg('rotate-cw')}重出了一遍：第 2 题挪进补研`);
      $('p-src10').setAttribute('data-bad', '');
      $('p-rv1').dataset.s = 'research';
      const n = $('p-note1');
      n.className = 'tc-note res';
      rt.q(n, 'em').innerHTML = `${svg('search-check')}<span>原帖找不到，已发补研</span>`;
      on(n);
      flash($('p-tc1'), 'hit', 300);
      await sleep(2600); if (!alive()) return;
      on($('asheet'), false);
      await sleep(400); if (!alive()) return;
      await moveTo($('p-adopt0')); if (!alive()) return;
      await click($('p-adopt0')); if (!alive()) return;
      away();
      $('p-tc0').setAttribute('data-adopted', '');
      $('tab-create').removeAttribute('data-wait');
      await packet($('p-tc0'), $('tab-create'), `${svg('pen-line')}放手让 Duet 干活前…`); if (!alive()) return;
      await sleep(400); if (!alive()) return;
      const q = document.createElement('div');
      q.className = 'as-q';
      q.innerHTML = `<p>以后每天早上 8 点，自动出今天的题？</p><div class="btns"><span class="btn" id="auto-ok">好</span><span class="btn ghost">先不用</span></div><span class="okline">${svg('check')}每天 8:00 自动出 · 你定的</span>`;
      rt.q(w, '.as-me').remove();
      rt.q(w, '#as-ai').remove();
      w.appendChild(q);
      on($('asheet'));
      await sleep(1900); if (!alive()) return;
      await moveTo($('auto-ok')); if (!alive()) return;
      await click($('auto-ok')); if (!alive()) return;
      away();
      q.setAttribute('data-done', '');
      on($('p-auto'));
      await sleep(1500); if (!alive()) return;
      on($('asheet'), false);
      await sleep(1200);
    },
  ];

    return { reset, acts };
  },
};
