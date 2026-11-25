const SATS = [
  { x: 48, y: 30, label: "A", color: "#ff3b3b" },
  { x: 122, y: 34, label: "B", color: "#10b981" },
  { x: 80, y: 84, label: "C", color: "#f59e0b" },
];
const RECEIVER = { x: 82, y: 50 };
const RANGE_A = 39.4;
const RANGE_B = 43.1;
const RANGE_C = 34.1;

function intersections(c1, r1, c2, r2) {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.hypot(dx, dy);
  const a = (d * d + r1 * r1 - r2 * r2) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const mx = c1.x + (a * dx) / d;
  const my = c1.y + (a * dy) / d;
  return [
    { x: mx + (h * dy) / d, y: my - (h * dx) / d },
    { x: mx - (h * dy) / d, y: my + (h * dx) / d },
  ];
}

export function StepDiagram({ step }) {
  const showA = step >= 2;
  const showB = step >= 3;
  const showC = step >= 4;
  const points = intersections(SATS[0], RANGE_A, SATS[1], RANGE_B);

  return (
    <svg viewBox="0 0 170 110" className="w-full" role="img" aria-label={`Diagram for step ${step + 1}`}>
      <defs>
        <clipPath id="diagramClip">
          <rect x="0" y="0" width="170" height="110" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="170" height="110" fill="#050b14" />
      <g clipPath="url(#diagramClip)">
        <g stroke="#16263f" strokeWidth="0.3">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 15} y1="0" x2={i * 15} y2="110" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 15} x2="170" y2={i * 15} />
          ))}
        </g>

        {showA ? (
          <circle cx={SATS[0].x} cy={SATS[0].y} r={RANGE_A} fill="#ff3b3b" fillOpacity="0.05" stroke="#ff3b3b" strokeOpacity="0.75" strokeWidth="0.5" strokeDasharray="2 2" />
        ) : null}
        {showB ? (
          <circle cx={SATS[1].x} cy={SATS[1].y} r={RANGE_B} fill="#10b981" fillOpacity="0.05" stroke="#10b981" strokeOpacity="0.75" strokeWidth="0.5" strokeDasharray="2 2" />
        ) : null}
        {showC ? (
          <circle cx={SATS[2].x} cy={SATS[2].y} r={RANGE_C} fill="#f59e0b" fillOpacity="0.05" stroke="#f59e0b" strokeOpacity="0.75" strokeWidth="0.5" strokeDasharray="2 2" />
        ) : null}

        {step === 0
          ? SATS.map((sat) => (
              <g key={`wave-${sat.label}`}>
                <circle cx={sat.x} cy={sat.y} r="9" fill="none" stroke={sat.color} strokeOpacity="0.5" strokeWidth="0.4" />
                <circle cx={sat.x} cy={sat.y} r="15" fill="none" stroke={sat.color} strokeOpacity="0.28" strokeWidth="0.4" />
                <circle cx={sat.x} cy={sat.y} r="21" fill="none" stroke={sat.color} strokeOpacity="0.14" strokeWidth="0.4" />
              </g>
            ))
          : null}

        {step === 3
          ? points.map((p, i) => (
              <g key={`p${i}`}>
                <circle cx={p.x} cy={p.y} r="3" fill="none" stroke="#00f0ff" strokeWidth="0.7" />
                <circle cx={p.x} cy={p.y} r="1.2" fill="#00f0ff" />
              </g>
            ))
          : null}

        {step >= 4 ? (
          <g>
            <circle cx={RECEIVER.x} cy={RECEIVER.y} r="3.4" fill="none" stroke="#00f0ff" strokeWidth="0.7" />
            <circle cx={RECEIVER.x} cy={RECEIVER.y} r="1.5" fill="#00f0ff" />
          </g>
        ) : null}

        {step === 2
          ? Array.from({ length: 10 }, (_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              return (
                <circle
                  key={`dot${i}`}
                  cx={SATS[0].x + Math.cos(angle) * RANGE_A}
                  cy={SATS[0].y + Math.sin(angle) * RANGE_A}
                  r="1.1"
                  fill="#00f0ff"
                  fillOpacity="0.7"
                />
              );
            })
          : null}

        {SATS.map((sat) => (
          <g key={sat.label}>
            <circle cx={sat.x} cy={sat.y} r="2.6" fill={sat.color} />
            <text x={sat.x} y={sat.y - 5} fill={sat.color} fontSize="5" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
              {sat.label}
            </text>
          </g>
        ))}

        {step === 1 ? (
          <text x="8" y="102" fill="#7d93b2" fontSize="4.6" fontFamily="JetBrains Mono, monospace">
            Δt × c = r
          </text>
        ) : null}
      </g>
    </svg>
  );
}