import {
  folioHomeCopy,
  folioStudio,
  folioTool,
  type FolioProductId,
} from '../../../../../content/folio';
import { folioWorld } from '../../../../../content/folio-world';
import { folioLife } from '../../../../../content/folio-life';
import { hero as workHero, desk } from '../../../../../content/folio-work';
import { hero as toolHero, demo } from '../../../../../content/molis-tool';
import { hero as storyHero } from '../../../../../content/molis-story';
import { lineImages, lineNames } from '../../../../../content/studio';
import { GITHUB_URL } from '../../../../../content/molis-work';
import {
  ABOUT,
  COMMUNITY,
  CONTACT,
  ESSAYS,
  HOME as GALLERY,
  SOLUTIONS,
  contactHref,
  productHref,
} from '../../gallery/routes';

// 第八轮首页用到的全部文案，都从 content/ 读，不新增产品事实。
// 站内链接借用白盒子美术馆整站（/demos/brand/gallery/...），这样每个去处都能点到一页真东西。
// 主画面的一句话与说明先用现在这一版占位，等产品介绍与 case 的底稿定了再换。

export { ABOUT, COMMUNITY, CONTACT, ESSAYS, GALLERY, SOLUTIONS, contactHref };

export type Product = {
  id: FolioProductId;
  name: string;
  /** 首页一句话：是什么 */
  line: string;
  /** 说价值的一句（占位：各产品页首屏标题） */
  value: string;
  /** 领域 */
  area: string;
  /** 阶段 */
  status: string;
  href: string;
  more: string;
  /** 第二个去处（Work 的 GitHub） */
  extra?: { label: string; href: string };
  /** 和别的产品的关系（Tool） */
  relation?: { text: string; tag: string };
  /** 画面的诚实标注 */
  note: string;
  /** 读屏用的画面说明 */
  label: string;
  /** 还是概念 */
  concept?: boolean;
};

const lines = Object.fromEntries(
  folioStudio.lines.map((line) => [line.id, line]),
) as Record<'tool' | 'life' | 'story', (typeof folioStudio.lines)[number]>;

const sea =
  folioLife.example.stories.find((story) => story.id === 'sea') ??
  folioLife.example.stories[0];

export const products: Product[] = [
  {
    id: 'work',
    name: lineNames.work,
    line: folioHomeCopy.products.work,
    value: workHero.title,
    area: folioStudio.work.kicker,
    status: folioStudio.work.status[0],
    href: productHref.work,
    more: folioStudio.work.actions.more,
    extra: { label: folioStudio.work.actions.github, href: GITHUB_URL },
    note: desk.note,
    label: desk.label,
  },
  {
    id: 'tool',
    name: lineNames.tool,
    line: folioHomeCopy.products.tool,
    value: toolHero.title,
    area: folioHomeCopy.areas.tool,
    status: lines.tool.status,
    href: productHref.tool,
    more: lines.tool.more,
    relation: {
      text: folioTool.relation.home,
      tag: folioTool.relation.phase,
    },
    note: demo.note,
    label: demo.label,
  },
  {
    id: 'life',
    name: lineNames.life,
    line: folioHomeCopy.products.life,
    value: folioLife.hero.title,
    area: folioHomeCopy.areas.life,
    status: lines.life.status,
    href: productHref.life,
    more: lines.life.more,
    note: `${folioLife.example.stepTag} · ${lineImages.life.note}`,
    label: `Molis Life 示意：${sea.quote}`,
  },
  {
    id: 'story',
    name: lineNames.story,
    line: folioHomeCopy.products.story,
    value: storyHero.title,
    area: folioHomeCopy.areas.story,
    status: lines.story.status,
    href: productHref.story,
    more: lines.story.more,
    note: lineImages.story.note,
    label:
      'Molis Story 示意：此处、彼处、归来，从一扇窗走进一个世界，再带一样东西回来。',
  },
  {
    id: 'world',
    name: folioWorld.name,
    line: folioWorld.line,
    value: folioWorld.hero.lead,
    area: '',
    status: folioWorld.status,
    href: productHref.world,
    more: folioWorld.home.more,
    note: folioWorld.map.note,
    label: `Molis World 概念示意：${folioWorld.map.places.map((place) => place.name).join('、')}，住进同一个世界。`,
    concept: true,
  },
];

export const homeCopy = folioHomeCopy;
export const studio = folioStudio;
export { desk, demo, sea, folioLife, folioWorld };
