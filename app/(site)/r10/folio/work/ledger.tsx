import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Ago, WarmDot } from '../live';
import { buildText, cstClock, grouped, weekdayOf } from '../format';
import type { Pulse } from '../pulse';

// 活着的状态：Molis Work 公开仓库这一周真实的样子。
// 七根细线是近七天每天的提交数（北京时间切天，今天这根是杏橙，还在长）；下面三行是合计、最近一次改动、最近一次构建。
// 整块只在取到数据时出现；哪一行取不到，哪一行就不写。

export function WorkClass({ pulse }: { pulse: Pulse | null }) {
  return (
    <p className="fo-class">
      <span>工作台</span>
      <i aria-hidden="true">|</i>
      <span className="fo-stage">
        <WarmDot pulse={pulse} />
        开源开发中
      </span>
      {pulse?.week != null ? (
        <>
          <i aria-hidden="true">|</i>
          <span>近七天 {grouped(pulse.week)} 次提交</span>
        </>
      ) : null}
    </p>
  );
}

export function PulseBlock({ pulse }: { pulse: Pulse | null }) {
  if (!pulse) return null;
  const days = pulse.days;
  const most = days ? Math.max(1, ...days.map((day) => day.count)) : 1;
  return (
    <div className="fo-pulse">
      {days ? (
        <ol className="fo-week" aria-label="近七天每天的提交数">
          {days.map((day, index) => (
            <li
              key={day.date}
              data-today={index === days.length - 1 || undefined}
              style={{ '--h': day.count / most } as CSSProperties}
            >
              <span className="fo-week-n">{grouped(day.count)}</span>
              <span className="fo-week-bar" aria-hidden="true" />
              <span className="fo-week-d">
                {index === days.length - 1 ? '今天' : `周${weekdayOf(day.date)}`}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      <dl className="fo-pulse-list">
        {pulse.week != null ? (
          <div>
            <dt>近七天提交</dt>
            <dd>
              <strong>{grouped(pulse.week)}</strong> 次
            </dd>
          </div>
        ) : null}
        {pulse.last ? (
          <div>
            <dt>最近一次改动</dt>
            <dd>
              <span className="fo-pulse-when">
                <WarmDot pulse={pulse} />
                <Ago iso={pulse.last.at} />
              </span>
              <a
                className="fo-pulse-commit"
                href={pulse.last.url}
                target="_blank"
                rel="noreferrer"
                lang="en"
              >
                {pulse.last.title}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </dd>
          </div>
        ) : null}
        {pulse.build ? (
          <div>
            <dt>最近一次构建</dt>
            <dd>
              <a
                className="fo-pulse-build"
                href={pulse.build.url}
                target="_blank"
                rel="noreferrer"
                data-ok={pulse.build.conclusion === 'success' || undefined}
              >
                {buildText(pulse.build)} · <Ago iso={pulse.build.at} />
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="fo-pulse-note">
        截至北京时间 {cstClock(pulse.fetchedAt)}，取自 GitHub 公开接口（molis-ai/molis-work 的 main
        分支），约 15 分钟更新一次；取不到时这一块不显示。圆点一小时内有改动时呼吸，一天内亮着，七天没有改动时变灰。
      </p>
    </div>
  );
}
