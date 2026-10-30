// 写代码 · 和团队一起：从一句抱怨，到修好。
// 三条反馈说的是同一件事，助理按你的规则叫上你；项目记忆想起 7 月的复盘和阿哲写的补单脚本；
// 你的 Codex 和阿哲的 Claude Code 各接一件，拿不准的来问你；阿哲真机验收，学到的记进项目记忆，回信给门店。
import css from './scene.css?raw';
import teamCss from './team.css?raw';
import html from './fix.html?raw';
import { fill, svg, type Act, type CaseSpec } from './runtime';
import { createTeam, type FeedItem } from './team';

// Feed 里的四条；done 是收尾时换上的标签
const FEED: FeedItem[] = [
  { k: 'star', src: 'App Store 评论 · ★☆☆☆☆', t: '付完钱一直转圈，订单没出来', at: '08:41', hot: true, done: '已修好' },
  { k: 'mail', src: '客户邮件 · 三家门店', t: '我们 3 个店员在微信里都付不了款', at: '08:57', hot: true, done: '已回复' },
  { k: 'star', src: 'App Store 评论 · ★★★★☆', t: '新版界面好看多了', at: '09:03', hot: false },
  { k: 'github', src: 'GitHub #331', t: 'iOS 微信里，付款成功的通知没回来', at: '09:10', hot: true, done: '已关闭' },
];

export const fix: CaseSpec = {
  html,
  css: css + teamCss,
  cast(rt) {
    const { $, scene, sleep, on, flash, PTR, ptAt, moveTo, click, away, packet, post, pline, say } = rt;
    const { logline, retype, check, drawSame, show, resetTeam } = createTeam(rt, FEED);

  function reset() {
    $('feed').innerHTML =
      FEED.map(
        (f, i) =>
          `<li class="fi" id="fi${i}"><span class="src-ic" data-k="${f.k}">${svg(f.k)}</span><span class="tx"><span class="src">${f.src}<time>${f.at}</time></span><span class="t">${f.t}</span></span><span class="tg2 hot">要紧</span>${f.done ? `<span class="tg2 rep">${f.done}</span>` : ''}</li>`,
      ).join('') + '<svg class="same" id="same"></svg>';
    resetTeam(
      ['watch', 'judge', 'judge-h', 'sent', 'sent-t', 'badge', 'g-state', 'w1', 'w2', 'd2', 'e1', 'e2', 'e3', 'r-state', 'c1', 'c2'],
      '2',
    );
  }

  const MEMO = `<div class="box" id="memo">
      <p class="box-q"><span>上次也出过</span>项目记忆里有两条相关的</p>
      <div class="box-b">
        <div class="mem"><span class="k">${svg('history')}7 月支付复盘 · 你记的</span><p>付款成功的通知走的 http，微信里会被拦下；改成 https 就好。</p></div>
        <div class="mem"><span class="k">${svg('history')}9 月补单脚本 · 阿哲写的</span><p>按支付流水补订单，跑之前先核对一遍。</p></div>
      </div>
      <div class="reveal" id="plan-w"><div><div class="plan" id="plan">
        <p class="plan-h">建个目标，三件事各有人接？</p>
        <ol>
          <li><span class="n">1</span>微信里能付款<span class="as"><span class="av me">你</span>你</span></li>
          <li><span class="n">2</span>23 位用户的订单补上<span class="as"><span class="av zhe">哲</span>阿哲</span></li>
          <li><span class="n">3</span>真机上付一笔<span class="as"><span class="av zhe">哲</span>阿哲验收</span></li>
        </ol>
        <div class="btns"><span class="btn" id="plan-ok">${svg('target')}建目标</span><span class="btn ghost">再想想</span></div>
        <span class="okline">${svg('check')}已建目标 · 你同意</span>
      </div></div></div>
    </div>`;

  const VID = `<span class="vid" id="vid"><span class="vph"><span class="vok">${svg('check')}</span><b>支付成功</b><small>¥38.00</small><span class="vbtn">完成</span></span><span class="vmeta"><b><span class="vplay">${svg('play')}</span>真机录屏</b><small>iPhone · 安卓 · 0:42</small></span></span>`;

  const acts: Act[] = [
    // 1 差评进来：Feed 里四条，三条说的是同一件事；助理按你的规则开话题叫上你
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
      await sleep(2200); if (!alive()) return;
      on($('sent'));
      await packet($('judge'), $('talk'), `${svg('messages-square')}# 支付失败`); if (!alive()) return;
      on($('badge'));
      await sleep(500); if (!alive()) return;
      await moveTo($('talk')); if (!alive()) return;
      await click($('talk')); if (!alive()) return;
      $('tg-new').removeAttribute('data-wait');
      scene.setAttribute('data-rail', '');
      post('ai', `<span class="at" id="at-me">@你</span> 这三条说的是同一件事：微信里付不了款，已经有 23 位用户受影响。<div class="box"><div class="box-b qt3">${FEED.filter((f) => f.hot).map((f) => `<span><span class="src-ic" data-k="${f.k}">${svg(f.k)}</span>${f.t}</span>`).join('')}</div></div>`, '09:12', { card: true });
      if (!rt.instant) {
        const s = scene.getBoundingClientRect();
        ptAt(PTR.hand, PTR.hand.x - s.width * 0.05, PTR.hand.y - s.height * 0.12, 500);
      }
      await sleep(700); if (!alive()) return;
      away();
      $('at-me')?.classList.add('ping');
      await sleep(2600);
    },
    // 2 它记得上次怎么修的：翻出 7 月的复盘和阿哲的补单脚本，把事拆成三件
    async (alive) => {
      scene.dataset.focus = 'rail';
      const m = post('ai', `<div class="reveal" id="prep-w" data-on><div><div class="prep">${svg('loader-circle', 'spin')}<span class="ticker" id="ticker"><span>翻项目记忆</span><span>找到 7 月的复盘</span><span>查补单脚本是谁写的</span></span></div></div></div><div class="reveal" id="memo-w"><div>${MEMO}</div></div>`, '09:13', { card: true });
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
      await sleep(3800); if (!alive()) return;
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
      logline('09:15', '从「# 支付失败」建立 · 你同意');
      await sleep(1300);
    },
    // 3 两个人，各带自己的 AI：两根光标在目标上写依据；拿不准的两笔问你
    async (alive) => {
      await say('付款这条，交给我的 Codex。', '09:16'); if (!alive()) return;
      on($('w1'));
      flash($('who1'));
      await sleep(1100); if (!alive()) return;
      post('zhe', '补单我来，交给我的 Claude Code。', '09:18');
      on($('w2'));
      flash($('who2'));
      await sleep(1300); if (!alive()) return;
      post('codex', `<div class="prog" id="prog-cx"><span class="o">${svg('history')}读了目标和 7 月的复盘，开工</span></div>`, '09:18');
      await sleep(500); if (!alive()) return;
      post('cc', `<div class="prog"><span class="o">${svg('history')}读了目标和补单脚本，开工</span></div>`, '09:19');
      logline('09:19', 'Codex、Claude Code 接手');
      await sleep(900); if (!alive()) return;
      on($('e1'));
      on($('c1'));
      retype($('t1'), '改通知地址，跑测试…');
      await sleep(600); if (!alive()) return;
      on($('e2'));
      on($('c2'));
      retype($('t2'), '核对 23 笔订单…');
      await sleep(1700); if (!alive()) return;
      retype($('t1'), '依据：通知改走 https · 测试 16/16');
      await sleep(1200); if (!alive()) return;
      on($('c1'), false);
      check('r1', 1);
      logline('11:05', 'Codex 交了依据：测试 16/16');
      fill(pline($('prog-cx'), `${svg('check', 'ok')}<span class="ok">付款通知改走 https · 测试 16/16</span>`));
      pline($('prog-cx'), `<span class="diff">${svg('file-code')}notify.ts<del>http://</del><ins>https://</ins></span>`);
      await sleep(1700); if (!alive()) return;
      post('cc', `<span class="at">@你</span> 有 2 位用户已经重新下过单了，这 2 笔还补吗？<div class="opts"><span class="opt">照补</span><span class="opt" id="o-refund"><i class="pd" data-k="me"></i>退款，别补</span></div>`, '11:30');
      await sleep(2000); if (!alive()) return;
      await moveTo($('o-refund')); if (!alive()) return;
      await click($('o-refund')); if (!alive()) return;
      away();
      $('o-refund').setAttribute('data-pick', '');
      await sleep(500); if (!alive()) return;
      await packet($('o-refund'), $('r2'), `${svg('messages-square')}你定的`); if (!alive()) return;
      on($('d2'));
      await sleep(800); if (!alive()) return;
      retype($('t2'), '依据：补上 21 笔 · 退款 2 笔');
      await sleep(1200); if (!alive()) return;
      on($('c2'), false);
      check('r2', 2);
      logline('13:40', 'Claude Code 交了依据：补上 21 · 退款 2');
      post('cc', `<div class="prog"><span class="ok">${svg('check')}补上 21 笔 · 退款 2 笔</span><span class="o">${svg('smartphone')}还差真机上付一笔，等 <span class="at">@阿哲</span> 验收</span></div>`, '13:40');
      await sleep(1700);
    },
    // 4 真机上付一笔，才算修好：阿哲验过，目标完成；学到的一条你看过才记进项目记忆
    async (alive) => {
      const m = post('zhe', `真机上付了一笔，iOS 和安卓都好了。<div>${VID}</div>`, '15:10');
      await sleep(1800); if (!alive()) return;
      await packet(rt.q(m, '.vid'), $('r3'), `${svg('check')}阿哲验收`); if (!alive()) return;
      on($('e3'));
      check('r3', 3);
      logline('15:10', '阿哲验收通过');
      await sleep(700); if (!alive()) return;
      on($('g-state'));
      await sleep(1500); if (!alive()) return;
      post('ai', `整理好了，你确认后记下：<div class="box concl" id="concl"><div class="box-b"><p class="concl-k">${svg('file-text')}<span class="swap" id="concl-k"><span data-a>结论草稿 · 记在这个话题上</span><span data-b>结论 · 你确认 15:12</span></span></p><p class="c">付款已修好；订单补上 21 笔，退款 2 笔；阿哲真机验收通过。</p><div class="mem" id="mem-new"><span class="k">${svg('history')}<span class="swap" id="mem-k"><span data-a>也记进项目记忆</span><span data-b>已记进项目记忆</span></span></span><p>补单前，先查用户有没有重新下单。</p></div></div><div class="box-f"><div class="btns"><span class="btn" id="concl-ok">确认</span><span class="btn ghost">改一改</span></div><span class="okline">${svg('check')}已确认 · 15:12</span></div></div>`, '15:12', { card: true });
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
      logline('15:12', '结论记在「# 支付失败」，也记进项目记忆');
      await packet($('mem-new'), $('mem-ref'), `${svg('history')}项目记忆 +1`); if (!alive()) return;
      $('mem-n').textContent = '3';
      flash($('mem-ref'));
      await sleep(1300);
    },
    // 5 回信给门店：助理记得找王店长，回信写好等你看；发出后 Feed 里那几条都标好
    async (alive) => {
      scene.dataset.focus = 'rail';
      post('ai', `给三家门店的回信写好了，你看过再发。<div><span class="chip mem-chip">${svg('history')}项目记忆：三家门店的事都找王店长</span></div><div class="box mail" id="mail"><div class="box-b"><p class="mail-to"><span class="av">王</span>发给<b>王店长 · 三家门店</b></p><p class="c">王店长您好：微信里付不了款的问题已经修好，3 位店员现在都能正常收款，受影响的订单也已补上……</p></div><div class="box-f"><div class="btns"><span class="btn" id="mail-ok">${svg('send')}发送</span><span class="btn ghost">改一改</span></div><span class="okline">${svg('check')}已发出 · 15:20</span></div></div>`, '15:16', { card: true });
      await sleep(3300); if (!alive()) return;
      await moveTo($('mail-ok')); if (!alive()) return;
      await click($('mail-ok')); if (!alive()) return;
      $('mail').classList.add('done-ok');
      await sleep(900); if (!alive()) return;
      scene.dataset.focus = '';
      await moveTo($('tab-feed')); if (!alive()) return;
      await click($('tab-feed')); if (!alive()) return;
      away();
      show('feed');
      await sleep(700); if (!alive()) return;
      for (const i of [1, 0, 3]) {
        $('fi' + i).setAttribute('data-replied', '');
        flash($('fi' + i));
        await sleep(i === 1 ? 700 : 450); if (!alive()) return;
      }
      $('judge').setAttribute('data-done', '');
      on($('judge-h'));
      on($('sent-t'));
      await sleep(1500);
    },
  ];

    return { reset, acts };
  },
};
