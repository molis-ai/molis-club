'use client';

import { Subtitles } from 'lucide-react';
import { useCallback, useId, useState } from 'react';
import { toolPlug } from '../../../content/site/tool';
import { Ico } from './parts';

/** 插件开关：开着还是关着、访客拨过没有 */
export function usePlug() {
  const [on, setOn] = useState(true);
  const [tried, setTried] = useState(false);
  const flip = useCallback(() => {
    setOn((value) => !value);
    setTried(true);
  }, []);
  return { on, tried, flip };
}

/** 屏幕外的一张插件卡，开关是真的：关上，屏幕里动作签和命令条上的「生成字幕」一起收起，做好的字幕还在；「你」的名牌拨过一次就收起 */
export function PlugCard({
  shown = true,
  on,
  tried,
  onFlip,
}: {
  shown?: boolean;
  on: boolean;
  tried: boolean;
  onFlip: () => void;
}) {
  const id = useId();
  return (
    <div className="tl-plug" data-on={shown || undefined}>
      <Ico icon={Subtitles} />
      <p className="tl-plug-text">
        <b id={id}>{toolPlug.name}</b>
        <small>{toolPlug.spec}</small>
      </p>
      <button
        type="button"
        role="switch"
        className="tl-switch"
        aria-checked={on}
        aria-labelledby={id}
        tabIndex={shown ? 0 : -1}
        onClick={onFlip}
      >
        <i />
        {!tried ? (
          <span className="tl-you" aria-hidden="true">
            {toolPlug.you}
          </span>
        ) : null}
      </button>
    </div>
  );
}
