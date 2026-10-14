'use client';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  Crop,
  Download,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Languages,
  Link2,
  Scissors,
  Type,
} from 'lucide-react';
import { at, Canvas, Cursor, type Scene } from '../demo/demo';
import './tool.css';

// Molis Tool 的演示画面：几乎全白，只有正在处理的那一点内容。
// 首页的 case：选中一段活动信息 → 光标旁弹出动作条 → 整理成日程草稿。
// 第 4 章说「围绕海报准备日程草稿」是正在打磨的使用场景，所以标「界面示意」，结果是示意。

export const posterCase: Scene = {
  id: 'tool-poster',
  label:
    'Molis Tool 界面示意：在网页上选中一段活动信息，光标旁弹出动作条，选「整理成日程」，得到一份日程草稿，加入日历前由你确认。',
  steps: 4,
  times: [0, 1.3, 2.7, 4.2, 7.2],
  note: '界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="tl tl-poster" press={[2]}>
      <div className="tl-page">
        <p className="tl-url">riverside-market.example · 活动</p>
        <p className="tl-h">秋日市集</p>
        <p className="tl-p">
          今年的市集搬到了江边。
          <span className="tl-sel m-hl" style={at(1)}>
            10 月 26 日（周日）14:00—17:00，滨江公园东门草坪
          </span>
          ，带上自己的杯子，有手作、旧书和一支乐队。
        </p>
        <span className="tl-anchor">
          <Cursor show={at(1, 3)} x="20%" y="30%" />
          <span className="tl-bar m-v" data-pop="" style={at(2, 3)}>
            <span data-on="">
              <CalendarDays aria-hidden="true" />
              整理成日程
            </span>
            <span>
              <Languages aria-hidden="true" />
              翻译
            </span>
            <span>
              <Type aria-hidden="true" />
              纯文本
            </span>
            <span>
              <Copy aria-hidden="true" />
              复制
            </span>
          </span>
        </span>
      </div>
      <div className="tl-draft m-v" data-pop="" style={at(3)}>
        <p className="tl-draft-head">
          <CalendarDays aria-hidden="true" />
          日程草稿
          <span className="m-chip" data-tone="line">
            AI 整理
          </span>
        </p>
        <dl>
          <div>
            <dt>标题</dt>
            <dd>秋日市集</dd>
          </div>
          <div>
            <dt>时间</dt>
            <dd>10 月 26 日 周日 14:00—17:00</dd>
          </div>
          <div>
            <dt>地点</dt>
            <dd>滨江公园东门草坪</dd>
          </div>
          <div>
            <dt>来源</dt>
            <dd>网页里选中的这一段</dd>
          </div>
        </dl>
        <p className="tl-draft-foot">
          <span className="m-chip" data-tone="ink">
            <Check aria-hidden="true" />
            加入日历
          </span>
          <span className="m-mini">加入前由你确认</span>
        </p>
      </div>
    </Canvas>
  ),
};

/** 每个动作标「本机 / AI」：本机工具完成的，和需要理解或生成内容时才用 AI 的，分开写 */
function Where({ ai = false }: { ai?: boolean }) {
  return (
    <span className="tl-where" data-ai={ai || undefined}>
      {ai ? 'AI' : '本机'}
    </span>
  );
}

/* ---------- 开场：老路四步 vs 一步 ---------- */
const oldWay: Scene = {
  id: 'tool-oldway',
  label:
    'Molis Tool 界面示意：一段要清理格式的文字。老路要打开应用、搬运材料、找功能、再把结果带回来；在 Tool 里，选中它，动作就在旁边，结果留在原处。',
  steps: 3,
  times: [0, 1.4, 2.8, 4.4],
  note: '界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="tl tl-old" press={[1]}>
      <p className="tl-old-text">
        <span className="tl-sel m-hl" style={at(1)}>
          会议改到  周四   下午三点 ，地点：  二楼小会议室
        </span>
      </p>
      <ol className="tl-old-path m-v" data-fade="" style={at(0, 1)}>
        {['打开应用', '搬运材料', '找功能', '带回来'].map((label, index) => (
          <li key={label} className="m-v" style={at(0, undefined, index * 160)}>
            <span>{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <span className="tl-old-anchor">
        <Cursor show={at(1, 2)} x="10%" y="-10%" />
        <span className="tl-bar m-v" data-pop="" style={at(1, 2)}>
          <span data-on="">
            <Type aria-hidden="true" />
            清理格式
          </span>
          <span>
            <Copy aria-hidden="true" />
            复制
          </span>
        </span>
      </span>
      <p className="tl-old-done m-v" style={at(2)}>
        <span className="tl-clean">会议改到周四下午三点，地点：二楼小会议室。</span>
        <span className="tl-old-meta">
          <Check aria-hidden="true" />
          一步，结果留在原处
          <Where />
        </span>
      </p>
    </Canvas>
  ),
};

/* ---------- 眼前的小事，就在手边处理 ---------- */
const small: Scene = {
  id: 'tool-small',
  label:
    'Molis Tool 界面示意：清理一段文字（本机）；从一份 PDF 里取三页，在副本上处理，原件保留（本机）；给一张图片写一句说明（需要理解内容时才用 AI）。',
  steps: 3,
  times: [0, 1.5, 3.0, 4.6],
  note: '界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="tl tl-small">
      <div className="tl-task" data-on={step === 0 || undefined}>
        <p className="tl-task-head">
          <Type aria-hidden="true" />
          清理文字
          <Where />
        </p>
        <p className="tl-task-body">
          <s>周四 ，  下午三点 。 二楼</s>
          <span>周四，下午三点。二楼</span>
        </p>
      </div>
      <div className="tl-task m-v" style={at(1)} data-on={step === 1 || undefined}>
        <p className="tl-task-head">
          <Scissors aria-hidden="true" />
          取 PDF 几页
          <Where />
        </p>
        <div className="tl-pages">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <span key={page} data-pick={page >= 2 && page <= 4 ? '' : undefined}>
              {page}
            </span>
          ))}
        </div>
        <p className="m-chip" data-tone="line">
          副本处理，原件保留
        </p>
      </div>
      <div className="tl-task m-v" style={at(2)} data-on={step === 2 || undefined}>
        <p className="tl-task-head">
          <ImageIcon aria-hidden="true" />
          写图片说明
          <Where ai />
        </p>
        <div className="tl-photo">
          <span className="tl-photo-img" aria-hidden="true" />
          <span>白墙上，一道午后的天光。</span>
        </div>
      </div>
    </Canvas>
  ),
};

/* ---------- 结果还能成为下一步的材料 ---------- */
const chain: Scene = {
  id: 'tool-chain',
  label:
    'Molis Tool 界面示意：从一份报价 PDF 里取出文字，整理成表格，再接着比较或导出，同一份材料不用搬来搬去。',
  steps: 4,
  times: [0, 1.2, 2.4, 3.6, 5.0],
  note: '界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="tl tl-chain">
      <ol className="tl-chain-row">
        <li className="tl-node" data-on={step >= 0 || undefined}>
          <FileText aria-hidden="true" />
          <b>报价.pdf</b>
          <small>原件保留</small>
        </li>
        <li className="tl-arrow m-v" data-fade="" style={at(1)}>
          <ArrowRight aria-hidden="true" />
        </li>
        <li className="tl-node m-v" style={at(1)}>
          <Type aria-hidden="true" />
          <b>文字</b>
          <small>提取 · 本机</small>
        </li>
        <li className="tl-arrow m-v" data-fade="" style={at(2)}>
          <ArrowRight aria-hidden="true" />
        </li>
        <li className="tl-node m-v" style={at(2)}>
          <FileSpreadsheet aria-hidden="true" />
          <b>表格</b>
          <small>整理 · 本机</small>
        </li>
        <li className="tl-arrow m-v" data-fade="" style={at(3)}>
          <ArrowRight aria-hidden="true" />
        </li>
        <li className="tl-node m-v" style={at(3)}>
          <Download aria-hidden="true" />
          <b>比较或导出</b>
          <small>接着用</small>
        </li>
      </ol>
      <table className="tl-table m-v" style={at(2)}>
        <tbody>
          {[
            ['', '单价', '数量', '运费'],
            ['甲', '2.40', '5000', '含'],
            ['乙', '2.15', '5000', '另计'],
            ['丙', '2.60', '3000', '含'],
          ].map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className={r === 2 && c === 3 && step >= 3 ? 'tl-flag' : undefined}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="tl-chain-note m-v" style={at(3)}>
        乙家运费另计，比较时单独列出
      </p>
    </Canvas>
  ),
};

/* ---------- 收起以后，还能回来接着做 ---------- */
const later: Scene = {
  id: 'tool-later',
  label:
    'Molis Tool 界面示意：工具收进菜单栏，先去做别的事；回来时，材料、草稿和处理结果都在「接续」里，还能回看它们来自哪里。',
  steps: 3,
  times: [0, 1.4, 2.8, 4.4],
  note: '界面示意',
  render: ({ step }) => (
    <Canvas step={step} className="tl tl-later" press={[1]}>
      <div className="tl-menubar">
        <span className="tl-menubar-icon">
          <img src="/images/molis-logo.png" width="16" height="16" alt="" />
          <Cursor show={at(1, 2)} x="60%" y="60%" />
        </span>
        <span className="m-mini">14:32</span>
      </div>
      <p className="tl-later-away m-v" data-fade="" style={at(0, 1)}>
        先去做别的事，处理在后台接着做。
      </p>
      <div className="tl-continue m-v" data-pop="" style={at(1)}>
        <p className="tl-continue-head">接续</p>
        <ul>
          <li data-on={step >= 2 || undefined}>
            <FileSpreadsheet aria-hidden="true" />
            <span>
              三家报价对比表
              <small>结果 · 14:20</small>
            </span>
          </li>
          <li>
            <CalendarDays aria-hidden="true" />
            <span>
              秋日市集 · 日程草稿
              <small>草稿 · 14:05</small>
            </span>
          </li>
          <li>
            <Crop aria-hidden="true" />
            <span>
              海报截图
              <small>材料 · 13:58</small>
            </span>
          </li>
        </ul>
        <p className="tl-source m-v" style={at(2)}>
          <Link2 aria-hidden="true" />
          来自：报价.pdf 第 2—4 页（原件保留）
        </p>
      </div>
    </Canvas>
  ),
};

export const toolScenes = { oldWay, small, chain, later };
