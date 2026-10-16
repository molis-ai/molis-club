// 公共部件里的字：产品页收尾的小标签、演示画面的读屏说明、标点。
// 英文在 content/site/en/ui.ts，形状一致。

export const ui = {
  /** 产品页固定收尾（app/_site/product/product.tsx 的 ProductEnding） */
  ending: {
    fit: '适合这样的时刻',
    progress: '当前进展',
    have: '已经有的',
    notYet: '还没有的',
    now: '现在怎么体验',
    relation: '和其他产品的关系',
    go: '去处',
  },
  /** 演示画面（Chapters、Reel）给读屏的说明 */
  demo: {
    picture: (note: string, label: string) => `画面（${note}）：${label}`,
    steps: '画面在演什么',
    figure: (label: string, note: string) => `${label}（${note}）`,
    segments: (name: string, total: number) => `${name} 的 ${total} 段演示`,
    pause: '暂停演示',
    play: '继续播放演示',
  },
  /** 名字后面接一句话时的冒号 */
  colon: '：',
};
