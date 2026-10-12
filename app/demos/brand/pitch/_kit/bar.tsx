import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { PITCH, findPitch, pitchLabel, pitches, type PitchId } from '../routes';
import './bar.css';

/** 每一版底部的比稿条：回到比稿页、当前是第几版、上一版与下一版。不属于方案本身的设计。 */
export function PitchBar({ id }: { id: PitchId }) {
  const pitch = findPitch(id);
  const index = pitches.indexOf(pitch);
  const prev = pitches[(index + pitches.length - 1) % pitches.length];
  const next = pitches[(index + 1) % pitches.length];
  return (
    <nav className="pb" aria-label="比稿导航">
      <Link href={PITCH} className="pb-all">
        <LayoutGrid size={14} aria-hidden="true" />
        <span>比稿</span>
      </Link>
      <span className="pb-now">
        <b>{pitch.no}</b>
        <span className="pb-of">/ {pitches.length}</span>
        <span className="pb-name">{pitchLabel(pitch)}</span>
      </span>
      <Link
        href={prev.href}
        className="pb-step"
        aria-label={`上一版：${prev.no} ${pitchLabel(prev)}`}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </Link>
      <Link
        href={next.href}
        className="pb-step"
        aria-label={`下一版：${next.no} ${pitchLabel(next)}`}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </Link>
    </nav>
  );
}
