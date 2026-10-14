'use client';
import { Eraser, Plus } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { placeTry } from '../../../content/site/world';
import { Island } from '../../_site/scenes/world';

// World 页的标志性交互：把一个地方放进小岛（概念示意）。
// 写一个名字或挑一个，点「放进小岛」，它就被铅笔画进岛上预留的位置；最多六处，可以擦掉重来。
// 只在这一页里，不保存、不上传。

/** 岛上预留的六处（按小岛 SVG 的轮廓量过，都落在陆地上） */
const slots = [
  { x: 34, y: 50 },
  { x: 60, y: 42 },
  { x: 47, y: 68 },
  { x: 74, y: 62 },
  { x: 24, y: 70 },
  { x: 62, y: 80 },
];

export function PlaceIsland() {
  const [places, setPlaces] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [said, setSaid] = useState('');
  const full = places.length >= slots.length;

  const put = (value: string) => {
    const clean = value.trim().slice(0, 16);
    if (!clean) return;
    if (full) {
      setSaid(placeTry.full);
      return;
    }
    setPlaces((list) => (list.includes(clean) ? list : [...list, clean]));
    setName('');
    setSaid(placeTry.placed(clean));
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    put(name);
  };

  return (
    <div className="wd-try">
      <form className="wd-try-form" onSubmit={submit}>
        <label htmlFor="wd-try-name">{placeTry.label}</label>
        <div className="wd-try-row">
          <input
            id="wd-try-name"
            value={name}
            maxLength={16}
            placeholder={placeTry.placeholder}
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit" className="m-btn" disabled={!name.trim()}>
            <Plus size={14} aria-hidden="true" />
            {placeTry.put}
          </button>
        </div>
        <p className="wd-try-picks">
          {placeTry.picks.map((pick) => (
            <button
              key={pick}
              type="button"
              className="m-link"
              disabled={places.includes(pick)}
              onClick={() => put(pick)}
            >
              {pick}
            </button>
          ))}
        </p>
        <output className="wd-try-said" aria-live="polite">
          {said || (places.length ? '' : placeTry.empty)}
        </output>
        {places.length ? (
          <button
            type="button"
            className="m-link"
            onClick={() => {
              setPlaces([]);
              setSaid('');
            }}
          >
            <Eraser size={13} aria-hidden="true" />
            {placeTry.clear}
          </button>
        ) : null}
      </form>
      <div className="wd-try-map" aria-hidden="true">
        <Island />
        {places.map((place, index) => (
          <span
            key={place}
            className="wd-try-pin"
            style={{ left: `${slots[index].x}%`, top: `${slots[index].y}%` }}
          >
            <svg viewBox="0 0 20 20">
              <path d="M10 2v9M6 11h8M5 18h10" />
            </svg>
            <b>{place}</b>
          </span>
        ))}
      </div>
      <ul className="sr-only" aria-label="小岛上的地方">
        {places.map((place) => (
          <li key={place}>{place}</li>
        ))}
      </ul>
    </div>
  );
}
