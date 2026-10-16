// 二屏海边：将 LibTV 原片以 0.55 倍节奏补到 30 fps，浏览器正常速度播放。
// 仅调整节奏，不以倒放或人物叠化掩盖循环位移；原片保留。
// 运行：node scripts/prepare-home-seaside.mjs <LibTV 下载的原片>
// B 清晰度对照：加 --detail，从下载原片另出 2x 精细缩放版本；保留 A 的旧文件。
// 随后 npm run media；需要本机已有的 ffmpeg，不增加运行时依赖。
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const input = process.argv[2];
if (!input) throw new Error('请提供 LibTV 下载的海边原片路径');

const detail = process.argv.includes('--detail');
const output = path.join(
  root,
  `public/site/home-seaside-calm${detail ? '-detail' : ''}.mp4`,
);
// 保持慢放与插帧方式不变；Lanczos 2x 重采样减少浏览器直接放大的软化，
// 再轻微增强亮度边缘。这不是 AI 超分，不能恢复原片不存在的细节。
const filter = [
  'setpts=(PTS-STARTPTS)/0.55',
  'minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1',
  ...(detail
    ? ['scale=iw*2:ih*2:flags=lanczos', 'unsharp=7:7:0.45:3:3:0']
    : []),
].join(',');
execFileSync(
  'ffmpeg',
  [
    '-hide_banner',
    '-loglevel',
    'warning',
    '-y',
    '-i',
    path.resolve(input),
    '-vf',
    filter,
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    detail ? '16' : '20',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    output,
  ],
  { cwd: root, stdio: 'inherit' },
);
// 当前仍使用第一条原片的封面，不改变无动态时的静态构图。
