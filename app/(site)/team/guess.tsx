'use client';
import { useEffect, useState } from 'react';
import { guess, members } from '../../../content/site/team';

// 团队页的勾子：「这句是谁写的？」——一句成员自己写的玩笑话，八个名字，猜一个。
// 猜对了给出去看这个人名牌的路；猜错了划掉那个名字，再猜；「换一句」换下一题，「揭晓」直接给答案。
// 没有 JS 时名字按钮不出现，答案收在「揭晓」（details）里，照样能读。

const nameOf = (id: string) =>
  members.find((member) => member.id === id)?.name ?? '';

export function Guess() {
  const [at, setAt] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [said, setSaid] = useState('');
  const quote = guess.quotes[at];
  const answer = nameOf(quote.who);

  const pick = (id: string) => {
    if (solved || wrong.includes(id)) return;
    if (id === quote.who) {
      setSolved(true);
      setSaid(guess.right(answer));
    } else {
      setWrong((list) => [...list, id]);
      setSaid(guess.wrong(nameOf(id)));
    }
  };
  const next = () => {
    setAt((value) => (value + 1) % guess.quotes.length);
    setWrong([]);
    setSolved(false);
    setSaid('');
  };
  const reveal = () => {
    setSolved(true);
    setSaid(guess.answer(answer));
  };

  return (
    <div className="tm-guess" data-solved={solved || undefined}>
      <p className="tm-guess-top">
        <span className="m-kicker">{guess.kicker}</span>
        <span className="tm-guess-count num" lang="en">
          {guess.count(at + 1, guess.quotes.length)}
        </span>
      </p>
      <blockquote className="tm-guess-quote" key={at}>
        <p>「{quote.text}」</p>
      </blockquote>
      <p className="tm-guess-ask">{guess.ask}</p>

      <fieldset className="tm-guess-names">
        <legend className="sr-only">{guess.ask}</legend>
        {members.map((member) => {
          const state =
            solved && member.id === quote.who
              ? 'right'
              : wrong.includes(member.id)
                ? 'wrong'
                : undefined;
          return (
            <button
              key={member.id}
              type="button"
              className="tm-guess-name"
              data-state={state}
              aria-disabled={solved || state === 'wrong' || undefined}
              onClick={() => pick(member.id)}
            >
              {member.name}
            </button>
          );
        })}
      </fieldset>

      {/* 没有 JS：答案收在这里 */}
      <details className="tm-guess-static">
        <summary>{guess.reveal}</summary>
        <p>{guess.answer(answer)}</p>
      </details>

      <p className="tm-guess-say" aria-live="polite">
        {said}
      </p>
      <p className="tm-guess-actions m-actions">
        {solved ? (
          <a className="m-link" href={`#${quote.who}`} data-dir="down">
            {guess.see(answer)}
          </a>
        ) : (
          <button type="button" className="m-link" onClick={reveal}>
            {guess.reveal}
          </button>
        )}
        <button type="button" className="m-link" onClick={next}>
          {guess.next}
        </button>
      </p>
      <p className="tm-guess-note">{guess.note}</p>
    </div>
  );
}

/** 从别的页面链到 /team#某人：把这个人的名牌展开 */
export function OpenFromHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const details = document.getElementById(id)?.querySelector('details');
      if (details) details.open = true;
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}
