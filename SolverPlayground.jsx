import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_SCENARIO, MAX_NOISE, noiseOffsets, SAT_COLORS, SAT_LABELS, WORLD_H, WORLD_W } from "@/lib/scenario";
import { distance, solvePosition } from "@/lib/trilateration";

export function SolverPlayground() {
  const [noise, setNoise] = useState(1.5);
  const [iteration, setIteration] = useState(999);

  const offsets = noiseOffsets(DEFAULT_SCENARIO.seed);
  const radii = DEFAULT_SCENARIO.sats.map((sat, i) =>
    Math.max(0.6, distance(sat, DEFAULT_SCENARIO.receiver) + offsets[i] * noise),
  );
  const solution = solvePosition(DEFAULT_SCENARIO.sats, radii);
  const maxIteration = solution.history.length - 1;
  const index = Math.min(iteration, maxIteration);
  const current = solution.history[index];
  const trail = solution.history.slice(0, index + 1);

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-sm border border-border/70 bg-[#050b14]">
        <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="block w-full" role="img" aria-label="Gauss-Newton convergence view">
          <g stroke="#16263f" strokeWidth="0.15">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2={WORLD_H} />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2={WORLD_W} y2={i * 10} />
            ))}
          </g>

          {DEFAULT_SCENARIO.sats.map((sat, i) => (
            <g key={`c${i}`}>
              <circle
                cx={sat.x}
                cy={WORLD_H - sat.y}
                r={radii[i]}
                fill={SAT_COLORS[i]}
                fillOpacity="0.04"
                stroke={SAT_COLORS[i]}
                strokeOpacity="0.7"
                strokeWidth="0.35"
                strokeDasharray="1.6 1.4"
              />
              <circle cx={sat.x} cy={WORLD_H - sat.y} r="1.4" fill={SAT_COLORS[i]} />
              <text x={sat.x} y={WORLD_H - sat.y - 3.4} fill={SAT_COLORS[i]} fontSize="2.8" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                {SAT_LABELS[i]}
              </text>
            </g>
          ))}

          <polyline
            points={trail.map((h) => `${h.x},${WORLD_H - h.y}`).join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.3"
            strokeDasharray="1 1"
          />

          <circle cx={current.x} cy={WORLD_H - current.y} r="1.3" fill="#00f0ff" />
          <circle cx={current.x} cy={WORLD_H - current.y} r="3" fill="none" stroke="#00f0ff" strokeOpacity="0.55" strokeWidth="0.25" />

          <circle
            cx={DEFAULT_SCENARIO.receiver.x}
            cy={WORLD_H - DEFAULT_SCENARIO.receiver.y}
            r="1.8"
            fill="none"
            stroke="#f8fafc"
            strokeWidth="0.25"
            strokeDasharray="0.9 0.9"
          />
        </svg>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="hud-label">Measurement error</span>
            <span className="mono text-[12px] text-primary">± {noise.toFixed(1)} u</span>
          </div>
          <Slider
            className="mt-2"
            value={[noise]}
            min={0}
            max={MAX_NOISE}
            step={0.1}
            onValueChange={(v) => {
              setNoise(v[0]);
              setIteration(999);
            }}
            aria-label="Measurement error"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="hud-label">Iteration</span>
            <span className="mono text-[12px] text-primary">
              {index} / {maxIteration}
            </span>
          </div>
          <Slider
            className="mt-2"
            value={[index]}
            min={0}
            max={Math.max(1, maxIteration)}
            step={1}
            onValueChange={(v) => setIteration(v[0])}
            aria-label="Gauss-Newton iteration"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "x̂", value: current.x.toFixed(2) },
            { label: "ŷ", value: current.y.toFixed(2) },
            { label: "RMS", value: current.rms.toFixed(3) },
          ].map((item) => (
            <div key={item.label} className="rounded-sm border border-border/70 bg-background/60 px-2 py-1.5">
              <div className="hud-label">{item.label}</div>
              <div className="mono mt-0.5 text-[14px] text-foreground">{item.value}</div>
            </div>
          ))}
        </div>

        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Each step shortens the jump. At iteration 0 the guess is the algebraic crossing of the first two circles; by
          the last step the residual stops changing and the estimate is the least-squares position.
        </p>
      </div>
    </div>
  );
}