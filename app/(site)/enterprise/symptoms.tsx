import type { QuestionId } from '../../../content/site/enterprise';
import type { Vars } from '../../_site/ui';

// 五个问题各一幅小图示：只用这一问原文里的名词搭成，画的是「卡住的样子」。
// 纯样式动画（enterprise.css），卡片进入视口才演，演几轮就停在最后一帧；
// 没有 JS、减少动态时直接是最后一帧。图示是装饰，读屏跳过，意思在旁边的字里。

export function Symptom({ id, words }: { id: QuestionId; words: string[] }) {
  if (id === 'where')
    // 五个环节一字排开，一个问号在它们之间跳，停不下来
    return (
      <div className="m-sym m-sym-where" aria-hidden="true">
        <div className="m-sym-row">
          {words.map((word) => (
            <span key={word} className="m-sym-word">
              {word}
            </span>
          ))}
        </div>
        <span className="m-sym-q">?</span>
      </div>
    );
  if (id === 'busy')
    // 时间条被四件事塞满，最后一件溢出了右边的线
    return (
      <div className="m-sym m-sym-busy" aria-hidden="true">
        <div className="m-sym-bar">
          {words.map((word, index) => (
            <span
              key={word}
              className="m-sym-task"
              style={{ '--i': index } as Vars}
            >
              {word}
            </span>
          ))}
        </div>
        <span className="m-sym-edge" />
      </div>
    );
  if (id === 'knowledge')
    // 三块碎片各在一角，虚线够不着彼此
    return (
      <div className="m-sym m-sym-bits" aria-hidden="true">
        <svg className="m-sym-gaps" viewBox="0 0 300 120" preserveAspectRatio="none">
          <path d="M70 34 L128 34 M172 34 L232 34" />
          <path d="M84 52 L120 82 M216 52 L180 82" />
        </svg>
        {words.map((word, index) => (
          <span
            key={word}
            className="m-sym-bit"
            data-at={index}
            style={{ '--i': index } as Vars}
          >
            {word}
          </span>
        ))}
      </div>
    );
  if (id === 'product')
    // 一个虚线框写着「演示」，一句需求在框里撞墙
    return (
      <div className="m-sym m-sym-demo" aria-hidden="true">
        <div className="m-sym-frame">
          <span className="m-sym-frame-label">{words[0]}</span>
          <span className="m-sym-say">{words[1]}</span>
        </div>
      </div>
    );
  // 一排人里只有一个亮着：方法留在一个人那里
  return (
    <div className="m-sym m-sym-team" aria-hidden="true">
      <span className="m-sym-tip">{words[0]}</span>
      <div className="m-sym-people">
        {Array.from({ length: 7 }, (_, index) => (
          <span
            key={index}
            className="m-sym-person"
            data-lit={index === 1 || undefined}
          />
        ))}
      </div>
    </div>
  );
}
