// 别的页面上替访客先写好的一句话，带到「聊一聊」的留言框里（「关于」结尾那一行，负责人 2026-10-24）。
// 只放在这个标签页的 sessionStorage 里，不进地址栏；联系页读到一次就删掉。后端不变。

const KEY = 'molis:contact-draft';

export function saveDraft(text: string) {
  try {
    if (text) sessionStorage.setItem(KEY, text.slice(0, 1200));
  } catch {
    // 存不了（隐私模式等）就不带，照样去聊一聊
  }
}

export function takeDraft() {
  try {
    const text = sessionStorage.getItem(KEY);
    if (text) sessionStorage.removeItem(KEY);
    return text ?? '';
  } catch {
    return '';
  }
}
