export const productLines = [
  {
    id: 'experience',
    name: '情绪与体验',
    english: 'Feel a little more.',
    description:
      '游戏、陪伴与日常里的微小连接。让技术照顾那些很难被量化的感受。',
    projects: ['elsewhere', 'seentoo', 'astralo'],
  },
  {
    id: 'tools',
    name: '轻量工具',
    english: 'Make room for life.',
    description: '把一个小问题做好。给桌面、文件和生活节奏，留一点轻盈。',
    projects: ['niulai', 'dropagent', 'jelly'],
  },
  {
    id: 'engineering',
    name: 'AI 与工程效率',
    english: 'Build what comes next.',
    description: '从 AI 执行底座，到应用工作区与工程协作，让创造更容易发生。',
    projects: ['prologue', 'flyleaf', 'forklight', 'goalboard'],
  },
] as const;
