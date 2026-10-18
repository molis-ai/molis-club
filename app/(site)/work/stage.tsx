'use client';
import { useMemo, useRef, useState } from 'react';
import {
  personas,
  personaUi,
  workChapters,
  workHero,
  type Chapter,
  type Persona,
} from '../../../content/site/work';
import type { Scene } from '../../_site/demo/demo';
import { Reel, type Segment } from '../../_site/demo/reel';
import { useReducedMotion, useVisible } from '../../_site/motion';
import {
  giveDev,
  giveDoc,
  growDev,
  growDoc,
  heroDev,
  teamDev,
  teamDoc,
} from '../../_site/scenes/work';
import {
  devFlow,
  devSafe,
  devSkill,
  devWait,
  docDeck,
  docFirst,
  docFlow,
  docPick,
  docSource,
  opsChange,
  opsFlow,
  opsMeet,
  opsMorning,
  opsOwe,
  opsScope,
  opsTool,
} from '../../_site/scenes/work-stage';
import { usePersona } from './persona';

// 首屏舞台：一扇 Molis Work 窗口，下面一条章节线。
// 还没选路：轮演三条路各自最要紧的一段（三句反转），每格写路名；选了路：演这条路的八段，演完停在最后一段的结果上。
// 每段三拍：字幕先是灰字「原来……」，窗里演 Work 怎么接，定格时亮出这一段的一句和状态。
// 没有 JS、减少动态：停在结果上；下面另有一份八段的文字（读屏一直读得到，没有 JS 时显示出来）。

/** 每段用哪个画面（work.tsx 里已有的几段和 work-stage.tsx 里的新画面） */
const scenes: Record<string, Scene> = {
  'dev-done': heroDev,
  'dev-wait': devWait,
  'dev-give': giveDev,
  'dev-flow': devFlow,
  'dev-team': teamDev,
  'dev-skill': devSkill,
  'dev-tool': growDev,
  'dev-safe': devSafe,
  'doc-source': docSource,
  'doc-first': docFirst,
  'doc-give': giveDoc,
  'doc-pick': docPick,
  'doc-flow': docFlow,
  'doc-team': teamDoc,
  'doc-tool': growDoc,
  'doc-deck': docDeck,
  'ops-owe': opsOwe,
  'ops-scope': opsScope,
  'ops-meet': opsMeet,
  'ops-flow': opsFlow,
  'ops-team': teamDoc,
  'ops-tool': opsTool,
  'ops-change': opsChange,
  'ops-morning': opsMorning,
};

/** 原来那几段是给滚动和短循环做的，节奏快；舞台上放慢一点，最后一步多停一会儿，让字幕读得完 */
const slower: Record<string, number> = {
  'work-hero-ledger-dev': 1.15,
  'work-give-dev': 1.3,
  'work-give-doc': 1.3,
  'work-grow-dev': 1.3,
  'work-grow-doc': 1.3,
  'work-team-dev': 1.55,
  'work-team-doc': 1.55,
};
const HOLD = 2.4;

function paced(scene: Scene, note: string, key: string): Scene {
  const scale = slower[scene.id] ?? 1;
  const times = scene.times.map((time) => time * scale);
  times[times.length - 1] += HOLD;
  // 同一个画面可能出现在两条路上（群里待你决定）：每段的 id 按章节来，章节线才分得开
  return { ...scene, id: `${scene.id}:${key}`, times, note };
}

function segment(chapter: Chapter, title = chapter.title): Segment {
  const note = chapter.status === '规划中' ? workHero.concept : workHero.stage;
  return {
    title,
    scene: paced(scenes[chapter.id], note, chapter.id),
    tag: chapter.status,
    was: chapter.was,
    say: chapter.say,
  };
}

export function Stage() {
  const { chosen } = usePersona();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useVisible(ref, 0.3);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const segments = useMemo(
    () =>
      chosen
        ? workChapters[chosen].map((chapter) => segment(chapter))
        : personas.map((persona) => segment(workChapters[persona][0], personaUi.label[persona])),
    [chosen],
  );
  return (
    <div className="wp-stage" ref={ref} data-intro={chosen ? undefined : ''}>
      <Reel
        key={chosen ?? 'intro'}
        name={chosen ? `Molis Work · ${personaUi.label[chosen]}` : `Molis Work · ${workHero.intro}`}
        segments={segments}
        running={visible && !paused}
        reduced={reduced}
        paused={paused}
        onPause={() => setPaused((value) => !value)}
        view="16 / 10"
        loop={!chosen}
        bare
        titles
        subtitles
      />
    </div>
  );
}

/** 八段的文字：读屏一直读得到（画面本身不进读屏）；没有 JS 时显示在舞台下面 */
export function StageText() {
  return (
    <div className="wp-stage-text">
      {personas.map((persona: Persona) => (
        <ol key={persona} data-p={persona}>
          {workChapters[persona].map((chapter) => (
            <li key={chapter.id}>
              <b>{chapter.title}</b>
              <span>{chapter.was}</span>
              <span>
                {chapter.say}
                <small>{chapter.status}</small>
              </span>
            </li>
          ))}
        </ol>
      ))}
    </div>
  );
}
