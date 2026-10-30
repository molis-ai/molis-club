// 「和团队一起」两个 case 共用的一套：Feed 里几条串成同一件事，讨论成目标，AI 在目标上交依据，人点头才算完。
import type { Runtime } from './runtime';

export type FeedItem = { k: string; src: string; t: string; at: string; hot: boolean; done?: string };

export function createTeam(rt: Runtime, feed: FeedItem[]) {
  const { $, on, appear, flash } = rt;

  /** 目标页的动态：放得下就从上往下排，放不下了才贴底，旧的从上面淡出 */
  function logline(time: string, text: string) {
    const li = document.createElement('li');
    li.className = 'lg';
    li.innerHTML = `<span><time>${time}</time><b>${text}</b></span>`;
    $('log').appendChild(li);
    appear(li);
    const fit = () => {
      const l = $('log');
      l.toggleAttribute('data-full', l.scrollHeight > l.clientHeight + 1);
    };
    fit();
    if (!rt.instant) setTimeout(fit, 520);
  }
  /** AI 在目标上写一行：先藏起来换好字，再一格一格露出来 */
  function retype(typed: HTMLElement, text: string) {
    typed.setAttribute('data-wait', '');
    typed.textContent = text;
    void typed.offsetWidth;
    typed.removeAttribute('data-wait');
  }
  function check(id: string, n: number) {
    $(id).setAttribute('data-done', '');
    $('g-count').textContent = `${n}/3`;
    [...$('bars').children].forEach((b, k) => on(b, k < n));
    flash($(id));
  }
  /** 几条说的是同一件事：左边一根铜线把它们串起来 */
  function drawSame() {
    const f = $('feed');
    const fb = f.getBoundingClientRect();
    const g = parseFloat(getComputedStyle(f).paddingLeft);
    const ys = feed
      .map((item, i) => (item.hot ? $(`fi${i}`) : null))
      .filter((el): el is HTMLElement => !!el)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return r.top - fb.top + r.height / 2;
      });
    const x = g * 0.38;
    const d =
      `M${g - 2},${ys[0]} H${x} V${ys[ys.length - 1]} H${g - 2}` +
      ys
        .slice(1, -1)
        .map((y) => ` M${x},${y} H${g - 2}`)
        .join('');
    $('same').innerHTML = `<path d="${d}"/>` + ys.map((y) => `<circle cx="${x}" cy="${y}" r="2.4"/>`).join('');
    if (rt.instant) return;
    const p = $('same').querySelector('path');
    if (!p) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
    p.getBoundingClientRect();
    p.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.2, 0.7, 0.1, 1)';
    p.style.strokeDashoffset = '0';
  }
  /** 左边的工作面在 Feed 和目标之间切换：标签、底栏和内容一起换 */
  function show(v: 'feed' | 'goal') {
    for (const k of ['feed', 'goal']) {
      $(`v-${k}`).toggleAttribute('data-off', k !== v);
      on($(`tab-${k}`), k === v);
      on($(`dk-${k}`), k === v);
    }
    rt.scene.dataset.v = v;
  }
  /** 两个 case 一样的复位：清讨论、清目标、回到 Feed，你的指针停在底栏 */
  function resetTeam(ids: string[], mem: string) {
    rt.scene.querySelectorAll('.packet, .ripple').forEach((n) => n.remove());
    $('feed').removeAttribute('data-scan');
    ids.forEach((id) => on($(id), false));
    ['t1', 't2'].forEach((id) => {
      $(id).setAttribute('data-wait', '');
      $(id).textContent = '';
    });
    $('judge').removeAttribute('data-done');
    ['r1', 'r2', 'r3'].forEach((id) => $(id).removeAttribute('data-done'));
    $('g-count').textContent = '0/3';
    [...$('bars').children].forEach((b) => on(b, false));
    $('mem-n').textContent = mem;
    $('tg-new').setAttribute('data-wait', '');
    $('tg-new').removeAttribute('data-concl');
    $('tab-goal').setAttribute('data-wait', '');
    rt.scene.removeAttribute('data-rail');
    rt.scene.dataset.focus = '';
    show('feed');
    rt.conv.innerHTML = '';
    $('log').innerHTML = '<li class="log-h">动态</li>';
    rt.blank($('r-ph'), '发送消息…');
    rt.away();
    const saved = rt.instant;
    rt.setInstant(true);
    const s = rt.scene.getBoundingClientRect();
    rt.ptAt(rt.PTR.hand, s.width * 0.5, s.height * 0.92, 0);
    rt.setInstant(saved);
  }

  return { logline, retype, check, drawSame, show, resetTeam };
}
