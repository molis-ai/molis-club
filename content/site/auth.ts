// 登录 / 注册与账号页的文字。认证行为不改（better-auth 邮箱密码；Google / GitHub 只有配置了才出现）。
// 账号页预留「关注的产品进展、我的分享、留言记录」三块，能力上线前不显示（ready: false）。新写。

export const authCopy = {
  login: {
    title: '欢迎回来。',
    lead: '登录以后，可以在这里管理你的账号。',
    submit: '登录',
    switchText: '还没有账号？',
    switchAction: '注册一个',
  },
  signup: {
    title: '很高兴认识你。',
    lead: '用邮箱创建一个账号。',
    submit: '创建账号',
    switchText: '已经有账号？',
    switchAction: '去登录',
    consent: ['我已阅读并同意', '隐私说明', '。'],
  },
  fields: {
    name: '怎么称呼你',
    namePlaceholder: '你的名字',
    email: '邮箱',
    password: '密码',
    passwordPlaceholder: '至少 12 位',
  },
  busy: '请稍候…',
  signedIn: {
    title: '你已经登录了。',
    hello: (name: string) => `${name}，欢迎回来。`,
    go: '查看我的账号',
  },
  providers: {
    google: 'Google',
    github: 'GitHub',
    or: '或者用邮箱',
    note: '第三方登录还没有开放，现在可以用邮箱注册。',
    unknown: '第三方登录的状态暂时读不到，可以先用邮箱。',
  },
  errors: {
    rate: '试得有点频繁，请等一分钟再来。',
    service: '账号服务暂时没有回应，请稍后再试。',
    login: '邮箱或密码不对，请再检查一下。',
    signup: '没能创建账号。请检查邮箱和密码，或者试试直接登录。',
    oauth: '这次第三方登录没有完成。可以重新授权，或者用邮箱登录。',
    social: '这次授权没能开始，请稍后再试。',
  },
  footnote: '试用阶段还没有找回密码的邮件，请记好密码；登录后可以修改。',
};

export const accountCopy = {
  loading: '正在读取账号…',
  error: { title: '暂时读不到账号。', text: '请检查网络后刷新页面。' },
  guest: { title: '先登录，再继续。', go: '登录 / 注册' },
  hello: (name: string) => `你好，${name}。`,
  verified: '邮箱已验证',
  unverified: '邮箱尚未验证',
  unverifiedNote: '试用阶段还没有配置验证邮件，账号会一直显示为未验证。',
  password: {
    title: '修改密码',
    lead: '用邮箱密码注册的账号，可以在这里更新密码；其他设备上的登录会一起退出。',
    current: '当前密码',
    next: '新密码',
    submit: '保存新密码',
  },
  logout: '退出登录',
  back: '首页',
  /** 预留：能力上线前不显示，上线后把 ready 改成 true 并接上数据 */
  sections: [
    { id: 'follow', title: '关注的产品进展', ready: false },
    { id: 'shares', title: '我的分享', ready: false },
    { id: 'notes', title: '留言记录', ready: false },
  ],
};
