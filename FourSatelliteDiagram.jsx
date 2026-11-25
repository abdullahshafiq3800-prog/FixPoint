export function FourSatelliteDiagram() {
  const sats = [
    { x: 40, y: 26, label: "1" },
    { x: 118, y: 30, label: "2" },
    { x: 78, y: 96, label: "3" },
    { x: 150, y: 92, label: "4" },
  ];

  return (
    <svg viewBox="0 0 190 120" className="w-full" role="img" aria-label="Four ranges resolving one position">
      <rect width="190" height="120" fill="#050b14" rx="3" />
      <g stroke="#1b2e4b" strokeWidth="0.4">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 24} y1="0" x2={i * 24} y2="120" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 24} x2="190" y2={i * 24} />
        ))}
      </g>

      {sats.map((sat, i) => (
        <g key={sat.label}>
          <circle
            cx={sat.x}
            cy={sat.y}
            r={38 + i * 7}
            fill="none"
            stroke="#3b82f6"
            strokeOpacity={0.18 + i * 0.08}
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <circle cx={sat.x} cy={sat.y} r="2.4" fill="#00f0ff" />
          <text
            x={sat.x + 4}
            y={sat.y - 3}
            fill="#7d93b2"
            fontSize="4.6"
            fontFamily="JetBrains Mono, monospace"
          >
            SV{sat.label}
          </text>
        </g>
      ))}

      <circle cx="90" cy="62" r="4.2" fill="none" stroke="#f59e0b" strokeWidth="0.7" strokeDasharray="1.4 1.4" />
      <circle cx="90" cy="62" r="1.8" fill="#00f0ff" />
      <text x="97" y="60" fill="#f8fafc" fontSize="4.6" fontFamily="JetBrains Mono, monospace">
        FIX
      </text>
      <text x="97" y="67" fill="#7d93b2" fontSize="4" fontFamily="Inter, sans-serif">
        4 ranges · 1 point
      </text>
    </svg>
  );
}