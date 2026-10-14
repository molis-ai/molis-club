import type { ReactNode } from 'react';

// 作品行里的一栏：一道细线、一行小标签，下面是这一栏的内容。服务端与客户端部件共用。

export type ColKind = 'play' | 'how' | 'take';

export function Col({
  label,
  kind,
  children,
}: {
  label: string;
  kind: ColKind;
  children: ReactNode;
}) {
  return (
    <div className="m-com-col" data-col={kind}>
      <h4 className="m-com-col-label">{label}</h4>
      {children}
    </div>
  );
}
