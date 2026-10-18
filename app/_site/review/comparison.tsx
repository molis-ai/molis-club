import './comparison.css';

/** 仅在明确的样张参数下显示；默认页面不出现评审控件。 */
export function ReviewSwitch({
  label,
  variant,
  currentHref,
  sampleHref,
  names = ['现版', '样张'],
  inline = false,
}: {
  label: string;
  variant: 'current' | 'sample';
  currentHref: string;
  sampleHref: string;
  /** 两个版本的叫法；样张切成默认以后，对照的一边就成了旧版 */
  names?: [string, string];
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
          {names[0]}
        </a>
        <a
          href={sampleHref}
          aria-current={variant === 'sample' ? 'page' : undefined}
        >
          {names[1]}
        </a>
      </nav>
    </aside>
  );
}
