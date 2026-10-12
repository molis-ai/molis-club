import { folioWorld } from '../../../../../content/folio-world';
import { productTone, type Vars } from '../shared';

// World 首屏右边的一张纸：现实里的地方、故事里的经历、带回来的东西，住在同一个世界里。
// 只用 Folio 已有的纸、胶带和色点，不新增插画；视觉风格定了以后整体替换这个组件（方案 P13）。

export function WorldSheet() {
  const { map } = folioWorld;
  return (
    <figure
      className="fwd-sheet"
      aria-label={`${map.note}：${map.title}里有${map.places
        .map((place) => place.name)
        .join('、')}`}
    >
      <span className="fwd-sheet-sun" aria-hidden="true" />
      <div className="fwd-sheet-paper" aria-hidden="true">
        <span className="fo-tape fo-tape-a" />
        <strong>{map.title}</strong>
        <ul>
          {map.places.map((place, index) => (
            <li
              key={place.name}
              data-tone={productTone[place.from]}
              style={{ '--i': index } as Vars}
            >
              <small>{place.kind}</small>
              <span>{place.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption>{map.note}</figcaption>
    </figure>
  );
}
