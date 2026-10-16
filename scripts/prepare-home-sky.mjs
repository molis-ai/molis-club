// 首页云层：原片 25 fps 以 0.24 倍速播放只有约 6 次画面更新/秒。
// 保留原片和慢速节奏，将光流插帧烘焙成 30 fps、正常速度播放的派生文件。
// 本地素材准备工具，需要 ffmpeg；不参与应用运行或部署。
// 运行：node scripts/prepare-home-sky.mjs && npm run media
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
execFileSync(
  'ffmpeg',
  [
    '-hide_banner',
    '-loglevel',
    'warning',
    '-y',
    '-i',
    'public/site/home-sky.mp4',
    '-an',
    '-vf',
    'setpts=(PTS-STARTPTS)/0.24,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '21',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    'public/site/home-sky-smooth.mp4',
  ],
  { cwd: root, stdio: 'inherit' },
);
