'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { directions, type Pick, type PickSet } from './data';
import './picks.css';

// 选图板：每个方向几套「三张一组」，三张光线和色调一致；每套按网页里实际的调色显示，
// 视频按实际的放慢速度播放（进入视口才播），照片按实际的推镜速度呼吸。回复编号即可。

function Media({ pick, grade }: { pick: Pick; grade?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      video.playbackRate = pick.rate ?? 1;
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [pick.rate]);
  const style = {
    filter: grade,
    objectPosition: pick.focus,
    rotate: pick.flip ? 'y 180deg' : undefined,
  };
  return pick.kind === 'video' ? (
    <video
      ref={ref}
      className="pk-media"
      src={`${pick.src}#t=0.5`}
      muted
      loop
      playsInline
      preload="none"
      style={style}
      onLoadedMetadata={(event) => {
        event.currentTarget.playbackRate = pick.rate ?? 1;
      }}
    />
  ) : (
    <img
      className="pk-media pk-still"
      src={pick.src}
      alt=""
      style={style}
      // 一次加载很多张时素材站偶尔会断开：隔几秒重取，最多三次
      onError={(event) => {
        const image = event.currentTarget;
        const tries = Number(image.dataset.tries ?? 0);
        if (tries >= 3) return;
        image.dataset.tries = String(tries + 1);
        window.setTimeout(
          () => {
            image.src = `${pick.src}${pick.src.includes('?') ? '&' : '?'}retry=${tries + 1}`;
          },
          1500 + Math.random() * 2500 * (tries + 1),
        );
      }}
    />
  );
}

function Cell({
  slot,
  pick,
  grade,
}: {
  slot: string;
  pick: Pick;
  grade?: string;
}) {
  return (
    <figure className="pk-cell">
      <div className="pk-frame">
        <Media pick={pick} grade={grade} />
        <span className="pk-kind">
          {pick.kind === 'video' ? '视频' : '照片'}
        </span>
      </div>
      <figcaption>
        <p className="pk-slot">
          <b>{pick.code}</b>
          <span>{slot}</span>
        </p>
        <p className="pk-what">{pick.what}</p>
        <p className="pk-motion">{pick.motion}</p>
        <p className="pk-credit">{pick.credit}</p>
      </figcaption>
    </figure>
  );
}

function Set({ set }: { set: PickSet }) {
  return (
    <article className="pk-set">
      <header>
        <h3>
          <b>{set.code}</b>
          <span>{set.mood}</span>
        </h3>
        <p>{set.why}</p>
        <small>{set.gradeNote}</small>
      </header>
      <div className="pk-row">
        <Cell slot="首屏" pick={set.hero} grade={set.grade} />
        <Cell slot="第二页 · 在做东西" pick={set.ware} grade={set.grade} />
        <Cell slot="结尾 · 明亮" pick={set.close} grade={set.grade} />
      </div>
    </article>
  );
}

export default function Picks() {
  return (
    <main className="pk">
      <header className="pk-head">
        <p className="pk-kicker">第八轮 · 选图</p>
        <h1>每个方向三张一组，先选图，再做进网页</h1>
        <div className="pk-intro">
          <p>
            每一套里的三张（首屏 / 第二页 /
            结尾）光线和色调一致，放在一起不跳；每套下面按网页里会用的调色显示，视频按实际放慢的速度播放。可以整套选，也可以从「可替换」里换掉某一张——但尽量在同一种光里换。
          </p>
          <ul>
            <li>
              <b>首屏</b>：画面铺满、钉在视口里，Molis AI 和 A/I
              从上面滚过去。视频放慢循环；照片 40 秒极慢推近再退回。
            </li>
            <li>
              <b>第二页</b>：读到 We build … ware / <em>Beyond Software</em>{' '}
              时，首屏画面慢慢溶进这一张（跟着滚动走，约半屏的距离），同时极慢推近。这一张都是有人在「做东西」。
            </li>
            <li>
              <b>结尾</b>
              ：明亮、有朝气。滚到这里时镜头从近处缓缓退远，大句和三张磨砂卡压在画面上。
            </li>
            <li>云、树影、海浪一律放慢（0.35–0.6 倍），让人静下来。</li>
          </ul>
          <p className="pk-reply">
            回复编号就行，例如「公园 A」或「天空 A1 + 天空 第二页-1 + 天空
            A3」。
          </p>
        </div>
      </header>

      {directions.map((direction) => (
        <section key={direction.id} className="pk-direction">
          <h2>{direction.name}</h2>
          {direction.sets.map((set) => (
            <Set key={set.code} set={set} />
          ))}
          <div className="pk-alts">
            <h3>可替换</h3>
            {direction.alts.map((group) => (
              <div key={group.slot} className="pk-alt-row">
                <p className="pk-alt-slot">{group.slot}</p>
                <div className="pk-alt-items">
                  {group.picks.map((pick) => (
                    <Cell key={pick.code} slot={group.slot} pick={pick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <footer className="pk-foot">
        <p>
          视频来自 Mixkit，照片来自 Unsplash，都是免费授权素材（已筛掉付费的
          Unsplash+）。选定后再取回本地、压缩，做进网页。
        </p>
        <Link href="/demos/brand/r8">回到第八轮</Link>
      </footer>
    </main>
  );
}
