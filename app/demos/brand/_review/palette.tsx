export function Palette({
  colors,
  small = false,
}: {
  colors: string[];
  small?: boolean;
}) {
  return (
    <span
      className={small ? 'rv-palette rv-palette-small' : 'rv-palette'}
      title={colors.join(' · ')}
      aria-hidden
    >
      {colors.map((color) => (
        <span key={color} style={{ background: color }} />
      ))}
    </span>
  );
}
