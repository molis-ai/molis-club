// 演示画面里的字的英文（对应 content/site/scenes.ts，形状一致）。画面一律是示意，名字、数字、时间都是示意数据。
// 时间用 12 小时制；人名用拼音（团队在中国，示意数据不换成英文名）。
import type * as zh from '../scenes';

export const workScene: typeof zh.workScene = {
  project: 'Industry watch report',
  tools: {
    files: 'Sources',
    feed: 'Feed',
    doc: 'Docs',
    table: 'Table',
    deck: 'Slides',
    talk: 'Discussion',
    calendar: 'Calendar',
    notes: 'Notes',
    todo: 'To-dos',
  },
  personal: 'Personal',
  home: {
    together: 'You and AI, working on the same material.',
    relay: 'The assistant calls on a few plugins to finish the job.',
    grow: 'Your workspace can grow tools of your own.',
    growTag: 'Preview',
    talk: 'Talk it through, with the context and results attached.',
    talkTag: 'First version built · Not publicly deployed',
    away: 'While you’re away, the assistant keeps going.',
    awayTag: 'In development',
  },
  scatter: {
    label:
      'Molis Work mockup: bits from browser tabs, chats, docs, and to-dos come together in one project.',
    note: 'Interface mockup',
    bits: {
      tab: '3 browser tabs · industry news',
      chat: 'From a chat: “First draft by Thursday”',
      doc: 'report-draft-v2.docx',
      ai: 'Yesterday’s AI chat',
      todo: 'To-do: add the three-way comparison',
    },
    gathered: {
      feed: 'Feed · 3 sources',
      doc: 'Docs · report draft',
      todo: 'To-do · comparison · Thu',
      ai: 'Chat log · from yesterday',
    },
  },
  arrange: {
    label:
      'Molis Work mockup: the project gets sources, a feed, and docs; your calendar, notes, and to-dos are always there; search a word, and results from every tool come up together.',
    note: 'Interface mockup',
    crumb: 'Project · Set up tools',
    shelf: 'Pick the tools for this job',
    mine: 'Calendar, notes, and to-dos are yours. They come with you to every project.',
    term: 'storage',
    results: [
      { before: 'Quarterly ', after: ' shipments', from: 'Feed' },
      { before: 'Section 2 · ', after: ' price trends', from: 'Docs' },
      { before: 'Interview notes: ', after: ' customers', from: 'Notes' },
    ],
  },
  together: {
    label:
      'Molis Work mockup: a half-written proposal; the assistant outlines it from what’s there, with the changes highlighted; you click “Take over” and rewrite a line yourself.',
    note: 'Interface mockup',
    crumb: 'Docs · Industry watch report',
    title: 'Industry watch report (draft)',
    assistant: 'Assistant',
    outlined: 'outlined it from what’s there',
    outline: [
      '1. Three shifts in this year’s market',
      '2. How three companies compare',
      '3. Recommendations',
    ],
    mine: '3. Our take: price first, then channels',
    changed: 'You changed this line',
    take: 'Take over',
    editing: 'You’re editing now · The assistant’s changes are kept',
  },
  relay: {
    label:
      'Molis Work mockup: the assistant pulls three sources from the feed, compares them in a table, then makes a one-page slide; all three results land in the project with their sources.',
    labelMore:
      'Molis Work mockup: the feed, table, and slides hand off in turn, then a review goes on the calendar and a follow-up on the to-do list; every result is in the project, with its source.',
    note: 'Interface mockup',
    crumb: 'Assistant · Finishing up',
    feed: [
      'Company A quarterly report',
      'Company B launch event',
      'Company C sector report',
    ],
    table: [
      ['', 'Price', 'Channel'],
      ['A', '↓', 'Online'],
      ['B', '→', 'Dealers'],
      ['C', '↑', 'Direct'],
    ],
    slide: { page: 'Slide 2', title: 'Three-way comparison' },
    results: ['3 source excerpts', '1 comparison table', '1 slide'],
    sourced: 'sources attached',
    tableToDeck: 'Table → Slides',
    event: { when: 'Thu, 3:00 PM', what: 'Report review' },
    followUp: { when: 'After the review', what: 'Add Company D’s data' },
    proof:
      'All five results are in “Industry watch report,” and each one links back to its source.',
  },
  grow: {
    label:
      'Molis Work mockup: you describe what you need, a plugin gets built and checked, then joins the workspace as a panel the assistant can use too. The plugin builder is still in preview.',
    note: 'Preview · Interface mockup',
    crumb: 'Plugin builder',
    tool: 'Review log',
    fresh: 'New',
    you: 'You',
    ask: 'Make a review log: notes by person, with the parts to fix marked.',
    plugin: 'Plugin',
    checks: [
      'Agent proposes a plan',
      'Built in a sandbox',
      'Passes checks and review',
    ],
    done: 'Added to the project · The assistant and authorized agents can use it too',
  },
  talk: {
    label:
      'Molis Work mockup: in the Discussion panel, a colleague quotes the slide and starts a thread; the conclusion goes back to the project, so anyone picking it up can see how you got there.',
    note: 'Interface mockup',
    crumb: 'Slides · Slide 2',
    thread: 'Discussion',
    them: 'Z',
    me: 'Me',
    quote: 'Slide 2 · “Three-way comparison”',
    question: 'Should the price column go in the final conclusion?',
    topic: 'Thread · Price in the conclusion?',
    reply: 'Yes. Let’s add Company D before Thursday’s review.',
    conclusion: {
      label: 'Conclusion',
      text: 'Price goes in; add Company D before the review',
    },
    proof:
      'The conclusion goes back to the project: whoever picks it up can see this thread and that slide.',
  },
  goal: {
    label:
      'Molis Work mockup: the Goal tracks the aim, progress, problems, and open decisions; switch to Codex or Claude Code and it reads the same record; at the end, check it item by item.',
    note: 'Interface mockup',
    crumb: 'Goal · First draft due Thursday',
    aim: {
      term: 'Aim',
      text: 'First draft by Thursday, with sources for the three-way comparison',
    },
    progress: {
      term: 'Progress',
      text: 'Sections 1 and 2 done; section 3 half written',
    },
    problem: {
      term: 'Issue',
      text: 'Company C counts its data differently from the other two',
    },
    open: {
      term: 'To decide',
      text: 'Should price go in the conclusion?',
      chip: 'Waiting on you',
    },
    agent: {
      before: 'Switch to ',
      name: 'Claude Code',
      after: ': it reads the same record and picks up at section 3',
    },
    checks: [
      'Sources for all three companies',
      'Conclusion matches Thursday’s brief',
      'Company C’s numbers: needs your OK',
    ],
  },
  away: {
    label:
      'Molis Work mockup: after you log off, the assistant follows up on what’s due, going by the Goal; next morning, your Inbox holds just one decision, with the reason. Proactive follow-up is still in development.',
    note: 'In development · Interface mockup',
    off: 'You’re offline · 10:40 PM',
    quiet: 'No notifications during quiet hours',
    log: [
      {
        text: '11:10 PM Follow-up due: Company C updated its data',
        small: 'Added to the section 3 draft',
      },
      { text: '2:30 AM An export failed', small: 'Retried and worked, logged' },
      {
        text: '7:00 AM Company D shipped a new version last night',
        small: 'Whether to add it is your call',
      },
    ],
    inbox: 'Inbox · Next day, 9:00 AM',
    waiting: '1 decision waiting',
    question: 'Add Company D to the report?',
    why: 'Why: it shipped a new version last night, which affects the conclusion in section 2. The other two items are handled and logged in the Goal.',
    yes: 'Add it',
    no: 'Not now',
  },
};

export const toolCase: typeof zh.toolCase = {
  label:
    'Molis Tool interface mockup: select an event listing on a web page, an action bar pops up by the cursor, choose “Make an event,” and get a draft event that you confirm before it goes on your calendar.',
  note: 'Interface mockup',
  url: 'riverside-market.example · Events',
  title: 'Autumn Market',
  before: 'This year the market moves to the river. ',
  selected: 'Sunday, October 26, 2–5 PM, on the lawn by the east gate of Riverside Park',
  after: '. Bring your own cup. There’ll be handmade goods, old books, and a band.',
  actions: {
    event: 'Make an event',
    translate: 'Translate',
    plain: 'Plain text',
    copy: 'Copy',
  },
  draft: 'Draft event',
  byAi: 'AI draft',
  fields: {
    title: { term: 'Title', text: 'Autumn Market' },
    time: { term: 'When', text: 'Sun, Oct 26, 2–5 PM' },
    place: { term: 'Where', text: 'Riverside Park, east gate lawn' },
    source: { term: 'Source', text: 'The passage you selected' },
  },
  add: 'Add to calendar',
  confirm: 'You confirm before it’s added',
};

export const lifeCase: typeof zh.lifeCase = {
  label:
    'Molis Life prototype mockup: “Take Mom to see the sea” is saved for later; when Saturday afternoon opens up, it comes back with why it came up now and two plans, a shorter one and a longer one. Whether to go is up to you.',
  note: 'Prototype mockup',
  wish: '“I want to take Mom to see the sea.”',
  kept: 'Saved for later',
  when: 'Saved 3 weeks ago',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  free: 'Saturday afternoon just opened up',
  why: {
    title: 'Why now',
    text: 'You’re free Saturday afternoon. The forecast is sunny. The sea is 40 minutes away.',
  },
  plans: [
    {
      title: 'Closer',
      time: 'Two hours',
      text: 'A walk on the east seawall, then dinner together.',
    },
    {
      title: 'Farther',
      time: 'Half a day',
      text: 'Sunset at South Bay. Bring Mom a jacket.',
    },
  ],
  decide: 'Whether to go, and which one, is up to you',
};

export const storyCase: typeof zh.storyCase = {
  label:
    'Molis Story interface mockup: Elsewhere starts from a “what if” and opens into a book that unfolds chapter by chapter; on the way back you write a line of your own, which joins the things you’ve brought back to Here.',
  note: 'Interface mockup',
  world: 'Elsewhere · Live as another you',
  whatIf: 'What if, that year, I’d gone to the school by the sea…',
  chapters: [
    { title: 'Chapter 1', text: 'The sea wind snaps the flag at the school gate.' },
    { title: 'Chapter 2', text: 'You start walking down to the pier in the mornings.' },
    { title: 'Chapter 3', text: 'There’s a letter you never sent.' },
  ],
  back: 'Coming back · Write one line about it',
  line: 'Turns out I’ve always wanted to live closer to the sea.',
  here: 'Here · What you brought back',
  kept: [
    {
      world: 'Elsewhere',
      thing: '“Turns out I’ve always wanted to live closer to the sea.”',
    },
    { world: 'Pocket Museum', thing: 'A keepsake album of spring' },
    { world: 'Astralo', thing: 'A signal you haven’t decoded yet' },
  ],
};

export const worldCase: typeof zh.worldCase = {
  label:
    'Molis World concept sketch: put your usual noodle shop on your own island; the kitchen door leads to another city; live through that story, then bring back a keepsake to set beside the shop.',
  note: 'Concept sketch',
  title: 'My world · Sketch',
  shop: 'The noodle shop on the corner',
  door: 'Kitchen door',
  gift: 'A paper lantern you brought back',
  far: 'Another city',
  farNote: 'Inside a story',
  foot: 'Seeing it again days later: this weekend, let’s actually go eat there.',
};
