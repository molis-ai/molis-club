// 404：纯文字，一句干幽默，再给几条回去的路（地址写中文地址，组件按语言换）。英文在 content/site/en/not-found.ts。

export const notFound = {
  meta: '这一页还在沿途上',
  title: '这一页还在沿途上。',
  lead: '可能是地址拼错了，也可能它还没被做出来。我们一般先做能用的，再做好看的，这一页两样都还没轮到。',
  home: '回到首页',
  links: [
    { label: '去「沿途」看看做过什么', href: '/along-the-way' },
    { label: '告诉我们你在找什么', href: '/contact' },
  ],
};
