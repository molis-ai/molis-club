'use client';
import { enterprise, type StationId } from '../../../content/site/enterprise';
import { Film } from './films';
import { Shelf } from './shelf';

// 我们怎样开展合作（负责人 2026-10-19：之前那版「是一个合格的 PPT」——四张卡加十二格，一眼全摊开、每样东西一样重）。
// 改成一次只看一项服务的展开式长卷：四项服务是书架上并排的四本书（shelf.tsx；书脊上是诊断、共建、评估、培训，5.2 开头那句里的词），
// 打开那页上的短片（films.tsx）——一块共享画板上，业务团队和 Molis 两个带名牌的光标按分镜各做各的、再一起做；
// 每一步做完钉一条带序号的评论（5.3 原句）（负责人 2026-10-20：用动画演出 Molis 跟业务怎么合作，「假装你在拍视频」）。

const { path } = enterprise;
const stationIds = Object.keys(path.stations) as StationId[];

export function Stages() {
  return (
    <Shelf
      id="path"
      prefix="station"
      title={path.title}
      lead={path.lead}
      books={stationIds.map((id) => ({
        id,
        word: path.stations[id].word,
        name: path.stations[id].name,
        film: <Film id={id} />,
      }))}
    />
  );
}
