import { WORK_LICENSE } from '../../../content/site/products';

export function WorkLicense() {
  return (
    <p className="wk-license">
      {WORK_LICENSE.terms}{' '}
      <a href={WORK_LICENSE.href}>{WORK_LICENSE.name}</a>
    </p>
  );
}
