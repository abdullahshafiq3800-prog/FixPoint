export function Sparkline({ values, width = 96, height = 26, color = "#00f0ff" }) {
  if (!values || values.length < 2) {
    return <div className="mono text-[11px] text-muted-foreground">insufficient data</div>;
  }
  const max = Math.max(...values, 1e-6);
  const step = width / (values.length - 1);
  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = height - (Math.log10(1 + (v / max) * 999) / 3) * (height - 3) - 1.5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}