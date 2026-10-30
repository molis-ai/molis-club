// 做内容、运营 · 和团队一起：从一条热点，到发出去。
// 官方博客、X、小红书三条说的都是 Claude Duet，助理按你的规则判断值得写；项目记忆里有账号定位、上回的复盘，记得小红书一直是小林在做；
// 你的 Claude 写底稿，小林的 ChatGPT 做 6 页图文，标题拿不准来问你；两个平台的稿子你点过头才发；读者问得最多的一句回到 Feed。
import css from './scene.css?raw';
import teamCss from './team.css?raw';
import html from './hot.html?raw';
import { svg, type Act, type CaseSpec } from './runtime';
import { createTeam, type FeedItem } from './team';

// Feed 里的四条：订的官方博客、X 上的博主、YouTube 频道、小红书关键词；done 是收尾时换上的标签
const FEED: FeedItem[] = [
  { k: 'blog', src: 'Anthropic 官方博客', t: 'Introducing Claude Duet', at: '昨晚 23:04', hot: true, done: '已写' },
  { k: 'x', src: 'X · 关注的 AI 博主', t: '上手 Duet：它替我回邮件，发出去之前先停下来问我', at: '07:40', hot: true, done: '已写' },
  { k: 'yt', src: 'YouTube · 评测频道', t: 'Haiku 5.5 跑分全对比', at: '08:05', hot: false },
  { k: 'xhs', src: '小红书 · 关键词「Claude」', t: 'Claude 出了个会自己干活的 App？· 3.2 万赞', at: '08:30', hot: true, done: '已写' },
];
const TILE: Record<string, string> = { blog: svg('rss'), x: '<b>X</b>', yt: svg('play'), xhs: '<b>书</b>' };

export const hot: CaseSpec = {
  html,
  css: css + teamCss,
  cast(rt) {
    const { $, scene, sleep, on, appear, flash, PTR, ptAt, moveTo, click, away, packet, post, pline, say } = rt;
    const { logline, retype, check, drawSame, show, resetTeam } = createTeam(rt, FEED);


  const fiHTML = (f: Omit<FeedItem, 'hot'> & { hot?: boolean; tag?: string }, id: string) => `<li class="fi" id="${id}"><span class="src-ic" data-k="${f.k}">${TILE[f.k]}</span><span class="tx"><span class="src">${f.src}<time>${f.at}</time></span><span class="t">${f.t}</span></span>`
    + (f.tag ? `<span class="tg2 ang">${f.tag}</span>` : `<span class="tg2 hot">值得写</span>${f.done ? `<span class="tg2 rep">${f.done}</span>` : ''}`) + '</li>';

  function reset() {
    $('feed').innerHTML = FEED.map((f, i) => fiHTML(f, `fi${i}`)).join('') + '<svg class="same" id="same"></svg>';
    resetTeam(
      ['watch', 'judge', 'judge-h', 'sent', 'sent-t', 'badge', 'g-state', 'w1', 'w2', 'd1', 'e1', 'e2', 'e3', 'r-state', 'c1', 'c2'],
      '3',
    );
  }

  // 小林那边做出来的小红书 6 页：封面、它能干什么、动手前先问你（操作截图）、什么时候停下来、谁能用、我们的看法
  const PAGES = [
    '<span class="pg p1"><b>Claude 出了个<br>会自己干活的助理</b><i>美国先排队试</i></span>',
    '<span class="pg"><em>它能干什么</em><u></u><u class="s"></u><u></u></span>',
    '<span class="pg p3"><em>动手前先问你</em><span class="pgph"><span class="pgq">Duet 想替你回这封邮件</span><span class="pgb"><i>先别</i><i>允许</i></span></span></span>',
    '<span class="pg"><em>什么时候停下来</em><u></u><u></u><u class="s"></u></span>',
    '<span class="pg p5"><em>谁能用</em><span class="pgt">美国<br>Pro · Max<br>排队进</span></span>',
    '<span class="pg"><em>我们的看法</em><u></u><u class="s"></u></span>',
  ];
  const carousel = (n = 6) => `<span class="car">${PAGES.slice(0, n).map((p, i) => p.replace('<span class="pg', `<span style="--d:${i}" class="pg`)).join('')}</span>`;

  const MEMO = `<div class="box" id="memo">
      <p class="box-q"><span>我们写过的规矩</span>项目记忆里有三条相关的</p>
      <div class="box-b">
        <div class="mem"><span class="k">${svg('history')}账号定位 · 你写的</span><p>不讲参数，讲普通人怎么用；用不上的，先说清楚。</p></div>
        <div class="mem"><span class="k">${svg('history')}9 月追热点复盘 · 小林记的</span><p>当天发；小红书配一张操作截图，收藏是公众号的 3 倍。</p></div>
        <div class="mem"><span class="k">${svg('history')}小红书 · 小林在做</span><p>近 20 篇小红书都是她发的。</p></div>
      </div>
      <div class="reveal" id="plan-w"><div><div class="plan" id="plan">
        <p class="plan-h">建个目标，今晚 9 点发出？</p>
        <ol>
          <li><span class="n">1</span>底稿：它怎么替你干活<span class="as"><span class="av me">你</span>你</span></li>
          <li><span class="n">2</span>小红书 6 页图文<span class="as"><span class="av lin">林</span>小林</span></li>
          <li><span class="n">3</span>两个平台的稿子过目<span class="as"><span class="av me">你</span>你</span></li>
        </ol>
        <div class="btns"><span class="btn" id="plan-ok">${svg('target')}建目标</span><span class="btn ghost">再想想</span></div>
        <span class="okline">${svg('check')}已建目标 · 你同意</span>
      </div></div></div>
    </div>`;

  const acts: Act[] = [
    // 1 热点进来：Feed 里四条，三条说的是同一件事；助理按你的规则判断值得写，开话题叫上你和小林
    async (alive) => {
      await sleep(500); if (!alive()) return;
      for (let i = 0; i < FEED.length; i++) {
        $('fi' + i).setAttribute('data-in', '');
        await sleep(380); if (!alive()) return;
      }
      await sleep(300); if (!alive()) return;
      on($('watch'));
      await sleep(800); if (!alive()) return;
      $('feed').setAttribute('data-scan', '');
      await sleep(1200); if (!alive()) return;
      FEED.forEach((f, i) => $('fi' + i).setAttribute(f.hot ? 'data-hot' : 'data-quiet', ''));
      await sleep(600); if (!alive()) return;
      drawSame();
      await sleep(1200); if (!alive()) return;
      on($('judge'));
      await sleep(3000); if (!alive()) return;
      on($('sent'));
      await packet($('judge'), $('talk'), `${svg('messages-square')}# Duet 上手`); if (!alive()) return;
      on($('badge'));
      await sleep(500); if (!alive()) return;
      await moveTo($('talk')); if (!alive()) return;
      await click($('talk')); if (!alive()) return;
      $('tg-new').removeAttribute('data-wait');
      scene.setAttribute('data-rail', '');
      post('ai', `<span class="at" id="at-me">@你 @小林</span> 这三条说的是同一件事：Claude 出了个会自己干活的助理，叫 Duet。<div class="box"><div class="box-b qt3">${FEED.filter((f) => f.hot).map((f) => `<span><span class="src-ic" data-k="${f.k}">${TILE[f.k]}</span>${f.t}</span>`).join('')}</div></div>`, '09:02', { card: true });
      if (!rt.instant) {
        const s = scene.getBoundingClientRect();
        ptAt(PTR.hand, PTR.hand.x - s.width * 0.05, PTR.hand.y - s.height * 0.12, 500);
      }
      await sleep(700); if (!alive()) return;
      away();
      $('at-me')?.classList.add('ping');
      await sleep(2600);
    },
    // 2 它记得我们怎么写的：账号定位、上回的复盘、谁一直做小红书，照这些拆成三件
    async (alive) => {
      scene.dataset.focus = 'rail';
      const m = post('ai', `<div class="reveal" id="prep-w" data-on><div><div class="prep">${svg('loader-circle', 'spin')}<span class="ticker" id="ticker"><span>翻项目记忆</span><span>找到账号定位和上回的复盘</span><span>查小红书一直是谁在做</span></span></div></div></div><div class="reveal" id="memo-w"><div>${MEMO}</div></div>`, '09:03', { card: true });
      const av = rt.q(m, '.av');
      av.classList.add('thinking');
      const tk = [...$('ticker').children];
      for (let k = 0; k < tk.length; k++) {
        if (k) tk[k - 1].setAttribute('data-gone', '');
        on(tk[k]);
        await sleep(950); if (!alive()) return;
      }
      av.classList.remove('thinking');
      on($('prep-w'), false);
      on($('memo-w'));
      await sleep(4200); if (!alive()) return;
      on($('plan-w'));
      await sleep(2800); if (!alive()) return;
      await moveTo($('plan-ok')); if (!alive()) return;
      await click($('plan-ok')); if (!alive()) return;
      away();
      $('plan').setAttribute('data-done', '');
      await sleep(500); if (!alive()) return;
      $('tab-goal').removeAttribute('data-wait');
      await packet($('plan-ok').parentElement!.nextElementSibling!, $('tab-goal'), `${svg('target')}建目标`); if (!alive()) return;
      scene.dataset.focus = '';
      show('goal');
      await sleep(500); if (!alive()) return;
      logline('09:05', '从「# Duet 上手」建立 · 你同意');
      await sleep(1300);
    },
    // 3 两个人，各带自己的 AI：底稿和图文分头写；标题拿不准，问你
    async (alive) => {
      await say('底稿我来，交给我的 Claude。', '09:06'); if (!alive()) return;
      on($('w1'));
      flash($('who1'));
      await sleep(1100); if (!alive()) return;
      post('lin', '小红书我来，交给我的 ChatGPT。', '09:08');
      on($('w2'));
      flash($('who2'));
      await sleep(1300); if (!alive()) return;
      post('claude', `<div class="prog" id="prog-cl"><span class="o">${svg('file-text')}读了目标、账号定位和官方原文，开工</span></div>`, '09:08');
      await sleep(500); if (!alive()) return;
      post('gpt', `<div class="prog" id="prog-gp"><span class="o">${svg('history')}读了目标和上回的复盘，等底稿</span></div>`, '09:09');
      logline('09:09', 'Claude、ChatGPT 接手');
      await sleep(900); if (!alive()) return;
      on($('e1'));
      on($('c1'));
      retype($('t1'), '写底稿，核对官方原文…');
      await sleep(600); if (!alive()) return;
      on($('e2'));
      on($('c2'));
      retype($('t2'), '等底稿…');
      await sleep(1600); if (!alive()) return;
      post('claude', `<span class="at">@你</span> 官方写的是研究预览，只开美国、要排队。标题怎么写？<div class="opts"><span class="opt">会自己干活的助理</span><span class="opt" id="o-clear"><i class="pd" data-k="me"></i>写清：美国先排队试</span></div>`, '15:20');
      await sleep(2200); if (!alive()) return;
      await moveTo($('o-clear')); if (!alive()) return;
      await click($('o-clear')); if (!alive()) return;
      away();
      $('o-clear').setAttribute('data-pick', '');
      await sleep(500); if (!alive()) return;
      await packet($('o-clear'), $('r1'), `${svg('messages-square')}你定的`); if (!alive()) return;
      on($('d1'));
      await sleep(700); if (!alive()) return;
      retype($('t1'), '依据：底稿 v1 · 6 处事实都带原文出处');
      await sleep(1100); if (!alive()) return;
      on($('c1'), false);
      check('r1', 1);
      logline('16:40', 'Claude 交了底稿：6 处事实带出处');
      pline($('prog-cl'), `${svg('check', 'ok')}<span class="ok">底稿 v1 · 6 处事实都带原文出处</span>`);
      pline($('prog-cl'), `<span class="chip doc">${svg('file-text')}底稿 · Duet 怎么替你干活</span>`);
      await sleep(1400); if (!alive()) return;
      retype($('t2'), '照底稿做 6 页…');
      await sleep(1500); if (!alive()) return;
      post('gpt', `<div class="prog"><span class="ok">${svg('check')}小红书 6 页 · 第 3 页是操作截图</span></div>${carousel()}`, '19:30');
      await sleep(1600); if (!alive()) return;
      retype($('t2'), '依据：6 页 · 第 3 页是操作截图');
      await sleep(1100); if (!alive()) return;
      on($('c2'), false);
      check('r2', 2);
      logline('19:30', 'ChatGPT 交了 6 页图文');
      await sleep(1400);
    },
    // 4 你点过头，才算能发：两个平台的稿子各看一遍；发出去后，学到的一条你确认才记下
    async (alive) => {
      scene.dataset.focus = 'rail';
      post('ai', `两个平台的稿子都齐了，你过目：<div class="box review"><div class="box-b"><div class="rv"><span class="rv-m">${carousel(3)}</span><span class="rv-t"><b>小红书 · 6 页图文</b><small>小林 · ChatGPT</small></span><span class="opt" id="ok-x"><i class="pd" data-k="me"></i>能发</span></div><div class="rv"><span class="rv-m wx">${svg('book-open')}</span><span class="rv-t"><b>公众号 · Claude 出了个会自己干活的助理（美国先排队试）</b><small>你 · Claude · 2,400 字</small></span><span class="opt" id="ok-w"><i class="pd" data-k="me"></i>能发</span></div></div></div>`, '20:40', { card: true });
      await sleep(3000); if (!alive()) return;
      await moveTo($('ok-x')); if (!alive()) return;
      await click($('ok-x')); if (!alive()) return;
      $('ok-x').setAttribute('data-pick', '');
      await sleep(500); if (!alive()) return;
      await moveTo($('ok-w')); if (!alive()) return;
      await click($('ok-w')); if (!alive()) return;
      $('ok-w').setAttribute('data-pick', '');
      away();
      await sleep(400); if (!alive()) return;
      scene.dataset.focus = '';
      await packet($('ok-w'), $('r3'), `${svg('check')}你过目`); if (!alive()) return;
      on($('e3'));
      check('r3', 3);
      logline('20:40', '两个平台的稿子你都点过头');
      await sleep(700); if (!alive()) return;
      on($('g-state'));
      await sleep(1400); if (!alive()) return;
      post('ai', `发出去了，你确认后记下：<div class="box concl" id="concl"><div class="box-b"><p class="concl-k">${svg('file-text')}<span class="swap" id="concl-k"><span data-a>结论草稿 · 记在这个话题上</span><span data-b>结论 · 你确认 21:05</span></span></p><p class="c">小红书 20:52、公众号 21:00 发出；标题写清了美国先排队试。</p><div class="mem" id="mem-new"><span class="k">${svg('history')}<span class="swap" id="mem-k"><span data-a>也记进项目记忆</span><span data-b>已记进项目记忆</span></span></span><p>研究预览的功能，标题写清谁能用、怎么排队。</p></div></div><div class="box-f"><div class="btns"><span class="btn" id="concl-ok">确认</span><span class="btn ghost">改一改</span></div><span class="okline">${svg('check')}已确认 · 21:05</span></div></div>`, '21:05', { card: true });
      await sleep(3000); if (!alive()) return;
      await moveTo($('concl-ok')); if (!alive()) return;
      await click($('concl-ok')); if (!alive()) return;
      away();
      $('concl').classList.add('done-ok');
      on($('concl-k'));
      on($('mem-k'));
      flash($('mem-new'), 'saved', 1600);
      on($('r-state'));
      $('tg-new').setAttribute('data-concl', '');
      logline('21:05', '结论记在「# Duet 上手」，也记进项目记忆');
      await packet($('mem-new'), $('mem-ref'), `${svg('history')}项目记忆 +1`); if (!alive()) return;
      $('mem-n').textContent = '4';
      flash($('mem-ref'));
      await sleep(1300);
    },
    // 5 第二天看结果：收藏和评论回来；问得最多的一句回到 Feed，标成新角度
    async (alive) => {
      scene.dataset.focus = 'rail';
      post('ai', `昨晚两篇的表现：<div class="box"><div class="box-b"><div class="stats"><span><b>2,140</b>小红书收藏</span><span><b>386</b>评论</span><span><b>1.2 万</b>公众号阅读</span></div><p class="cmt"><span class="cmt-k">评论里问得最多 · 47 条</span>「它动手前要先问我，那我睡着了它问谁？」</p></div><div class="box-f"><span class="fin">${svg('rss')}这一句进了 Feed，标成新角度</span></div></div>`, '次日 09:00', { card: true });
      await sleep(3800); if (!alive()) return;
      scene.dataset.focus = '';
      await moveTo($('tab-feed')); if (!alive()) return;
      await click($('tab-feed')); if (!alive()) return;
      away();
      show('feed');
      await sleep(600); if (!alive()) return;
      for (const i of [0, 1, 3]) {
        $('fi' + i).setAttribute('data-replied', '');
        flash($('fi' + i));
        await sleep(350); if (!alive()) return;
      }
      $('judge').setAttribute('data-done', '');
      on($('judge-h'));
      on($('sent-t'));
      await sleep(900); if (!alive()) return;
      const t = document.createElement('template');
      t.innerHTML = fiHTML({ k: 'xhs', src: '小红书 · 我们的笔记 · 评论区', t: '「它动手前要先问我，那我睡着了它问谁？」', at: '09:00', tag: '新角度 · 47 条' }, 'fi-new');
      const li = t.content.firstElementChild as HTMLElement;
      li.classList.add('fresh');
      $('fi2').setAttribute('data-gone', '');
      $('feed').insertBefore(li, $('feed').firstChild);
      appear(li);
      drawSame();
      await sleep(2400);
    },
  ];

    return { reset, acts };
  },
};
