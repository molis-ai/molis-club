/** A visual layer only; the containing link owns navigation and its name. */
export function ImageCurtain({
  label,
  tone = 'ink',
}: {
  label?: string;
  tone?: 'ink' | 'paper';
}) {
  return (
    <span className="image-curtain" data-tone={tone} aria-hidden="true">
      {label && <span className="image-curtain-caption">{label}</span>}
    </span>
  );
}
