import './comparison.css';

/** 仅在明确的样张参数下显示；默认页面不出现评审控件。 */
export function ReviewSwitch({
  label,
  variant,
  currentHref,
  sampleHref,
  inline = false,
}: {
  label: string;
  variant: 'current' | 'sample';
  currentHref: string;
  sampleHref: string;
  inline?: boolean;
}) {
  return (
    <aside
      className="m-review-bar"
      data-inline={inline || undefined}
      aria-label={`${label}样张比较`}
    >
      <span className="m-review-label">{label} · 本地样张比较</span>
      <nav aria-label={`${label}版本`}>
        <a
          href={currentHref}
          aria-current={variant === 'current' ? 'page' : undefined}
        >
          现版
        </a>
        <a
          href={sampleHref}
          aria-current={variant === 'sample' ? 'page' : undefined}
        >
          样张
        </a>
      </nav>
    </aside>
  );
}
