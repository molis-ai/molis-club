// 五件产品的英文：译自 docs/studio-intro.md 第 3、4 章（2026-10-15 版），只译事实，不添新说法。
// 阶段一律用固定译法（docs/i18n.md）：Open source, in development / In development / Prototyping / Concept design。
// 五件都有卡片上用的字段（顶栏下拉、首页舞台）；正文（opening、sections、progress）目前只有 Work，
// 其余四件随各自的产品页一起翻，到时把那一件的类型换成完整的 Product。
import type * as zh from '../products';
import type { Product, ProductId } from '../products';

/** 卡片上用的字段：名字、标题、一句话、阶段、形态、适合的时刻 */
export type ProductCard = Omit<Product, 'opening' | 'sections' | 'progress'>;

export const products: { work: Product } & Record<
  Exclude<ProductId, 'work'>,
  ProductCard
> = {
  work: {
    id: 'work',
    name: 'Molis Work',
    headline: 'Work that keeps going, across people, tools, and AI',
    what: 'A workspace you put together from the tools you need, where people and AI work side by side.',
    overview:
      'A workspace built from the tools you need, shared by people and AI.',
    fit: 'When a piece of work runs over days, and your material, tools, and AI need to pick up where things left off.',
    stage: 'Open source, in development',
    stageNote:
      'The workspace and many of its tools are working in development. We keep refining how people and AI work together in it.',
    form: 'Workspace',
    opening: [
      'A proposal starts with gathering material. It gets sorted, discussed, and revised until it’s a document you can hand in. A project can stretch across many days, several tools, and different AI chats. The material, decisions, progress, and results along the way all need somewhere to live, and need to be easy to find the next time you pick things up.',
      'Molis Work puts all of that in one place. You can use the docs, to-do, knowledge, calendar, data, and code tools directly, or let AI read the content you’ve authorized and help sort, revise, and get things done.',
    ],
    sections: [
      {
        title: 'Set up the workspace for the job at hand.',
        paragraphs: [
          'For a research report, put your sources, feeds, and docs side by side. For a software project, add goals, sessions, and code tools. A project’s tools can change, while your personal calendar, notes, and to-dos keep the same content across every project.',
          'There’s also one search across everything you’ve connected, so things are easier to find. Come back a few days later and carry on from the material and progress already there.',
        ],
      },
      {
        title: 'You and AI, working on the same material.',
        paragraphs: [
          'Halfway through a proposal, you can ask the assistant to organize your thinking based on what’s there, then keep editing the result yourself. When you need code tools, you can also bring in outside agents you already know, like Codex or Claude Code, and let them read project records and move the work forward within the access you’ve granted.',
          'We want this collaboration to be continuous: you can see what the AI changed, and take over yourself at any moment. Anything that needs your judgment comes back to you, clearly.',
        ],
      },
      {
        title: 'A record of where things stand, and why.',
        paragraphs: [
          'For work that has to keep moving, Goals keeps track of the outcome you want, the progress so far, the problems you’ve hit, and the decisions still to make. At the end, you check the deliverable against the original brief.',
          'So when you switch tools, or come back after a while, you still know why things are where they are, and what’s needed next.',
        ],
      },
      {
        title: 'Your workspace can grow tools of your own.',
        paragraphs: [
          'Some needs are very specific: a log that fits how you work, a processing step you repeat, a way of working no existing tool offers.',
          'The plugin builder, now in preview, is exploring this: you describe what you need, AI helps make the tool, and after it passes checks it goes into your workspace. The tools you make can also offer their abilities to the assistant and other authorized agents.',
        ],
      },
    ],
    progress: [
      'Molis Work is open source and in development, and for now it’s mainly for individuals on their own machines. The workspace, built-in tools, and AI collaboration are working in development and being refined. Plugin creation is still in preview; team spaces, multi-device sync, and plugin sharing are later directions.',
      'Your work data stays on your machine; when you use AI, it calls the model service you’ve configured. You can build it from source by following the repository’s instructions. The older public releases and the workspace now in development are separate, so look at each on its own; the new version in development doesn’t have an official installer yet.',
    ],
  },

  tool: {
    id: 'tool',
    name: 'Molis Tool',
    headline: 'Where your cursor goes, the software follows',
    what: 'A Mac tool for taking the next step with the text, file, or web page in front of you.',
    overview:
      'A handy tool that shows up around the text, file, or page you’re on.',
    fit: 'You already have the material and want to take the next step, with less app-switching and copy-pasting.',
    stage: 'In development',
    stageNote:
      'There’s a desktop development build. Local tools, cross-app interaction, and AI features are still being brought together and tested.',
    form: 'Mac tool',
  },

  life: {
    id: 'life',
    name: 'Molis Life',
    headline: 'Get the small things settled, and let the life you love happen',
    what: 'A life assistant for your wishes and your errands.',
    overview: 'A life assistant for personal wishes and everyday errands.',
    fit: 'You want to follow up on something that’s on your mind, or find the right moment for a wish and get ready for it.',
    stage: 'Prototyping',
    stageNote:
      'There’s an interactive prototype for life items and suggestions. Real models and outside services aren’t connected yet.',
    form: 'Life assistant',
  },

  story: {
    id: 'story',
    name: 'Molis Story',
    headline: 'Step into another world, live another life, then come back',
    what: 'Reading, conversation, exploration, and making, turned into worlds you can enter.',
    overview:
      'Reading, conversation, exploration, and making, turned into worlds you can enter.',
    fit: 'You want to step out of the everyday for a while, into an experience with its own rules and rhythm.',
    stage: 'In development',
    stageNote:
      'Four worlds are working in development. We’re refining how it feels to enter, live through, return from, and come back to each one.',
    form: 'Interactive worlds for macOS',
  },

  world: {
    id: 'world',
    name: 'Molis World',
    headline: 'Real places and stories, living in a world that grows with you',
    what: 'A personal world you build, arrange, and keep changing yourself.',
    overview:
      'A personal world you build, arrange, and keep changing yourself.',
    fit: 'You want a space for the places, experiences, and work you care about, and to keep reshaping it.',
    stage: 'Concept design',
    stageNote:
      'We’re still working out what it is and how it connects. There’s no usable prototype yet.',
    form: 'Personal world',
  },
};

/** 第 3 章「这些产品怎样联系」 */
export const relations: typeof zh.relations = {
  title: 'How the products connect',
  workTool:
    'Work is the core product we’re focused on right now, and it’s about how a piece of work keeps going. Tool is about making the step in front of you easier. Tool is developed as its own product and is also planned to become a foundation for Work; exactly what that covers, and when, isn’t decided yet.',
  lifeStoryWorld:
    'Life is about wishes, preparation, and action in real life. Story offers worlds you can enter and live through. World explores giving those places, companions, experiences, and works a space that keeps growing. Each has its own purpose; connecting them is a future direction and isn’t built yet.',
};
