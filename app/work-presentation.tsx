import { ArrowRight } from 'lucide-react';
import type { Work } from '../content/works';

const logos: Record<string, string> = {
  niulai: '/images/products/niulai.png',
  jelly: '/images/products/jelly.png',
  elsewhere: '/images/products/elsewhere.png',
  goalboard: '/images/products/goalboard.png',
};
export function WorkIdentity({ work }: { work: Work }) {
  return (
    <div
      className={`work-identity${logos[work.slug] ? '' : ' work-identity-type'}`}
    >
      {logos[work.slug] && (
        <img
          src={logos[work.slug]}
          alt=""
          width="56"
          height="56"
          loading="lazy"
        />
      )}
      <span>{work.name}</span>
    </div>
  );
}
const paths: Record<string, string[]> = {
  'content-growth': ['研究与判断', '内容创作', '反馈与复盘'],
  evrik: ['业务能力', '目标与授权', '执行与检查'],
  aether: ['指标与知识', '分析与解释', '可编辑报告'],
};
export function SolutionPath({ slug }: { slug: string }) {
  const steps = paths[slug];
  if (!steps) return null;
  return (
    <div className="inner-solution-path">
      <ol>
        {steps.map((step, index) => (
          <li key={step}>
            <span>{step}</span>
            {index < steps.length - 1 && (
              <ArrowRight size={24} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <p>示意路径 · 实际能力以当前阶段为准</p>
    </div>
  );
}
