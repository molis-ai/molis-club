export const members = [
  {
    slug: 'adeptify',
    name: 'Adeptify',
    role: '创作团队',
    english: 'Made with curiosity.',
    description:
      '从日常工具到情绪体验，再到 AI 工程。我们把具体的感受变成可以使用、可以讨论的作品。',
    type: 'Organization',
    workSlugs: [
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
    ],
    storySlugs: [],
  },
  {
    slug: 'yijun',
    name: '一骏',
    role: '观点作者',
    english: 'A human point of view.',
    description:
      '《落地主义》《人的尺度》作者。写下关于想法如何落地、机器与人的判断，以及 AI 时代创作的思考。',
    type: 'Person',
    workSlugs: [],
    storySlugs: ['idealism', 'human-scale'],
  },
] as const;
