'use client';
import { CalendarDays, Check, Copy, Languages, Type } from 'lucide-react';
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
