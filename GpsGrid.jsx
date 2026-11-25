import { useRef, useState } from "react";
import { SAT_COLORS, SAT_LABELS, WORLD_H, WORLD_W } from "@/lib/scenario";
import { clamp } from "@/lib/trilateration";

const VERTICALS = Array.from({ length: 11 }, (_, i) => i * 10);
const HORIZONTALS = Array.from({ length: 8 }, (_, i) => i * 10);

export function GpsGrid({
  sats,
  radii,
  receiver,
  estimate,
  solved,
  showTruth,
  onMoveSat,
  onMoveReceiver,
}) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const [hover, setHover] = useState(null);

  const toWorld = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    const scale = Math.min(rect.width / WORLD_W, rect.height / WORLD_H);
    const offsetX = (rect.width - scale * WORLD_W) / 2;
    const offsetY = (rect.height - scale * WORLD_H) / 2;
    return {
      x: Math.round(clamp((clientX - rect.left - offsetX) / scale, 3, WORLD_W - 3) * 10) / 10,
      y: Math.round(clamp(WORLD_H - (clientY - rect.top - offsetY) / scale, 3, WORLD_H - 3) * 10) / 10,
    };
  };

  const beginDrag = (kind, index) => (event) => {
    event.preventDefault();
    dragRef.current = { kind, index };
    setHover({ kind, index });
    try {
      svgRef.current.setPointerCapture(event.pointerId);
    } catch {
      /* pointer capture is best effort */
    }
  };

  const handleMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = toWorld(event.clientX, event.clientY);
    if (drag.kind === "sat") onMoveSat(drag.index, point);
    else onMoveReceiver(point);
  };

  const endDrag = (event) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      svgRef.current.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  };

  const nudge = (index) => (event) => {
    const keys = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    const delta = keys[event.key];
    if (!delta) return;
    event.preventDefault();
    const sat = sats[index];
    onMoveSat(index, {
      x: clamp(sat.x + delta[0] * 1.5, 3, WORLD_W - 3),
      y: clamp(sat.y + delta[1] * 1.5, 3, WORLD_H - 3),
    });
  };

  const toCy = (y) => WORLD_H - y;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      className="block h-full w-full touch-none select-none"
      onPointerMove={handleMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => setHover(null)}
      role="img"
      aria-label="Interactive trilateration grid with three draggable satellites"
    >
      <defs>
        <radialGradient id="gridGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#0d2338" />
          <stop offset="100%" stopColor="#050b14" />
        </radialGradient>
        <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={WORLD_W} height={WORLD_H} fill="url(#gridGlow)" />

      <g stroke="#1b2e4b" strokeWidth="0.15">
        {VERTICALS.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={WORLD_H} />
        ))}
        {HORIZONTALS.map((y) => (
          <line key={`h${y}`} x1={0} y1={toCy(y)} x2={WORLD_W} y2={toCy(y)} />
        ))}
      </g>

      <g fill="#5b7590" fontSize="2.6" fontFamily="JetBrains Mono, monospace">
        {VERTICALS.map((x) => (
          <text key={`tx${x}`} x={x + 0.6} y={WORLD_H - 0.9}>
            {x}
          </text>
        ))}
        {HORIZONTALS.slice(1).map((y) => (
          <text key={`ty${y}`} x={0.6} y={toCy(y) - 0.8}>
            {y}
          </text>
        ))}
      </g>

      {sats.map((sat, i) => (
        <g key={`circle-${i}`}>
          <circle
            cx={sat.x}
            cy={toCy(sat.y)}
            r={radii[i]}
            fill={SAT_COLORS[i]}
            fillOpacity="0.045"
            stroke={SAT_COLORS[i]}
            strokeOpacity="0.85"
            strokeWidth="0.35"
            strokeDasharray="1.6 1.4"
          />
        </g>
      ))}

      {solved && estimate ? (
        <g>
          {sats.map((sat, i) => (
            <line
              key={`vector-${i}`}
              x1={sat.x}
              y1={toCy(sat.y)}
              x2={estimate.x}
              y2={toCy(estimate.y)}
              stroke={SAT_COLORS[i]}
              strokeOpacity="0.45"
              strokeWidth="0.22"
            />
          ))}
        </g>
      ) : null}

      {solved && estimate ? (
        <g>
          <line
            x1={estimate.x - 3.2}
            y1={toCy(estimate.y)}
            x2={estimate.x + 3.2}
            y2={toCy(estimate.y)}
            stroke="#00f0ff"
            strokeWidth="0.3"
          />
          <line
            x1={estimate.x}
            y1={toCy(estimate.y) - 3.2}
            x2={estimate.x}
            y2={toCy(estimate.y) + 3.2}
            stroke="#00f0ff"
            strokeWidth="0.3"
          />
          <circle
            cx={estimate.x}
            cy={toCy(estimate.y)}
            r="1.15"
            fill="#00f0ff"
            filter="url(#softGlow)"
          />
          <circle cx={estimate.x} cy={toCy(estimate.y)} r="2.6" fill="none" stroke="#00f0ff" strokeOpacity="0.5" strokeWidth="0.2" />
        </g>
      ) : null}

      {showTruth ? (
        <g>
          <circle
            cx={receiver.x}
            cy={toCy(receiver.y)}
            r="1.9"
            fill="#f8fafc"
            fillOpacity="0.12"
            stroke="#f8fafc"
            strokeWidth="0.3"
            strokeDasharray="0.9 0.9"
            className="cursor-move"
            onPointerDown={beginDrag("receiver")}
          />
          <text
            x={receiver.x + 2.6}
            y={toCy(receiver.y) + 1}
            fill="#f8fafc"
            fontSize="2.6"
            fontFamily="JetBrains Mono, monospace"
          >
            TRUE
          </text>
        </g>
      ) : null}

      {solved && showTruth ? (
        <line
          x1={estimate.x}
          y1={toCy(estimate.y)}
          x2={receiver.x}
          y2={toCy(receiver.y)}
          stroke="#00f0ff"
          strokeWidth="0.25"
          strokeDasharray="1 1"
          strokeOpacity="0.8"
        />
      ) : null}

      {sats.map((sat, i) => {
        const isActive = hover && hover.kind === "sat" && hover.index === i;
        return (
          <g
            key={`sat-${i}`}
            tabIndex={0}
            role="button"
            aria-label={`Satellite ${SAT_LABELS[i]} at ${sat.x.toFixed(1)}, ${sat.y.toFixed(1)}. Drag or use arrow keys to move.`}
            className="cursor-grab outline-none focus-visible:opacity-100"
            onPointerDown={beginDrag("sat", i)}
            onPointerEnter={() => setHover({ kind: "sat", index: i })}
            onKeyDown={nudge(i)}
            style={{ opacity: isActive ? 1 : 0.94 }}
          >
            <circle cx={sat.x} cy={toCy(sat.y)} r={isActive ? 3.6 : 3} fill={SAT_COLORS[i]} fillOpacity="0.14" />
            <circle cx={sat.x} cy={toCy(sat.y)} r="1.6" fill={SAT_COLORS[i]} filter="url(#softGlow)" />
            <circle cx={sat.x} cy={toCy(sat.y)} r="2.9" fill="none" stroke={SAT_COLORS[i]} strokeWidth="0.22" />
            <text
              x={sat.x}
              y={toCy(sat.y) - 4.2}
              fill={SAT_COLORS[i]}
              fontSize="3"
              fontWeight="700"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
            >
              {SAT_LABELS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}