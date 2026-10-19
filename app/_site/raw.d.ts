// Vite 的 ?raw 导入：把文件原样当字符串（「关于」的《黑客与画家》用它展示本站真实的样式表）
declare module '*?raw' {
  const text: string;
  export default text;
}
