'use client';

import { useEffect, useRef, useState } from 'react';
import Link from './edition-link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { works } from '../content/works';

const order = [
  'niulai',
  'jelly',
  'elsewhere',
  'goalboard',
  'forklight',
  'dropagent',
  'seentoo',
  'astralo',
  'prologue',
  'flyleaf',
];
const products = order.map((slug) => works.find((work) => work.slug === slug)!);
const logos: Record<string, string> = {
  niulai: '/images/products/niulai.png',
  jelly: '/images/products/jelly.png',
  elsewhere: '/images/products/elsewhere.png',
  goalboard: '/images/products/goalboard.png',
};

export default function ProductShowcase() {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ back: false, forward: true });

  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const measure = () =>
      setEdges({
        back: list.scrollLeft > 2,
        forward: list.scrollLeft + list.clientWidth < list.scrollWidth - 2,
      });
    measure();
    list.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => {
      list.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, []);

  function browse(direction: number) {
    const list = track.current;
    if (!list) return;
    const first = list.children[0] as HTMLElement;
    const second = list.children[1] as HTMLElement;
    list.scrollBy({
      left: direction * (second.offsetLeft - first.offsetLeft),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }

  return (
    <div className="product-shelf">
      <ul className="product-card-track" ref={track} aria-label="Molis AI 产品">
        {products.map((work) => (
          <li key={work.slug}>
            <Link
              className="product-card"
              href={`/works/${work.slug}`}
              onFocus={(event) => {
                const list = track.current;
                const item = event.currentTarget.parentElement;
                if (!list || !item) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                const viewport = list.getBoundingClientRect();
                if (
                  bounds.left < viewport.left ||
                  bounds.right > viewport.right
                ) {
                  list.scrollTo({
                    left:
                      item.offsetLeft -
                      (list.children[0] as HTMLElement).offsetLeft,
                    behavior: 'instant',
                  });
                }
              }}
            >
              <div className="product-card-heading">
                {logos[work.slug] ? (
                  <img
                    className="product-card-logo"
                    src={logos[work.slug]}
                    alt=""
                    width="64"
                    height="64"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                ) : (
                  <span
                    className={`product-card-letter product-letter-${work.tone}`}
                    aria-hidden="true"
                  >
                    {work.symbol}
                  </span>
                )}
                <div>
                  <h3>{work.name}</h3>
                  <span>{work.category}</span>
                </div>
              </div>
              <p>{work.description}</p>
              <div className="product-card-footer">
                <span>{work.status}</span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="product-shelf-controls" aria-label="浏览更多产品">
        <button
          type="button"
          aria-label="向左浏览产品"
          disabled={!edges.back}
          onClick={() => browse(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          aria-label="向右浏览产品"
          disabled={!edges.forward}
          onClick={() => browse(1)}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
