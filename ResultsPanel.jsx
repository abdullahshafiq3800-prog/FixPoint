import { Sparkline } from "./Sparkline";
import { SAT_COLORS, SAT_LABELS } from "@/lib/scenario";

function Readout({ label, value, unit }) {
  return (
    <div className="rounded-sm border border-border/70 bg-background/60 px-2.5 py-2">
      <div className="hud-label">{label}</div>
      <div className="mono mt-1 text-[20px] font-medium leading-none text-foreground">
        {value}
        {unit ? <span className="ml-1 text-[11px] text-muted-foreground">{unit}</span> : null}
      </div>
    </div>
  );
}

export function ResultsPanel({ solution, solved, solving, stale, showTruth, receiver }) {
  const estimate = solution.estimate;
  const dx = estimate.x - receiver.x;
  const dy = estimate.y - receiver.y;
  const offset = Math.hypot(dx, dy);
  const verdict =
    offset < 0.5 ? "excellent lock" : offset < 2 ? "good lock" : offset < 6 ? "fair lock" : "degraded lock";
  const rmsPercent = Math.min(100, (solution.rms / 5) * 100);

  return (
    <section className="rounded-md border border-border bg-card/70">
      <header className="flex items-center justify-between border-b border-border/70 px-3 py-2">
        <span className="hud-label">Position solution</span>
        <span
          className={
            solved
              ? "mono text-[10px] uppercase tracking-[0.14em] text-[#10b981]"
              : solving
                ? "mono text-[10px] uppercase tracking-[0.14em] text-primary"
                : stale
                  ? "mono text-[10px] uppercase tracking-[0.14em] text-[#f59e0b]"
                  : "mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
          }
        >
          {solved ? "converged" : solving ? "iterating" : stale ? "stale" : "idle"}
        </span>
      </header>

      <div className="p-3">
        {solved ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="Estimated x̂" value={estimate.x.toFixed(2)} unit="u" />
              <Readout label="Estimated ŷ" value={estimate.y.toFixed(2)} unit="u" />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Readout label="Δx" value={dx >= 0 ? `+${dx.toFixed(2)}` : dx.toFixed(2)} />
              <Readout label="Δy" value={dy >= 0 ? `+${dy.toFixed(2)}` : dy.toFixed(2)} />
              <Readout label="Offset" value={offset.toFixed(2)} unit="u" />
            </div>

            <div className="mt-3 rounded-sm border border-border/70 bg-background/60 px-2.5 py-2">
              <div className="flex items-baseline justify-between">
                <span className="hud-label">Residual RMS</span>
                <span className="mono text-[12px] text-primary">{solution.rms.toFixed(3)} u</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.max(2, rmsPercent)}%` }}
                />
              </div>
              <div className="mono mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span>gn iterations {solution.iterations}</span>
                <span>{showTruth ? verdict : "reveal truth to score"}</span>
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              {solution.residuals.map((res, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: SAT_COLORS[i] }} />
                  <span className="mono text-[11px] text-muted-foreground">SV-{SAT_LABELS[i]}</span>
                  <span className="mono ml-auto text-[11px] text-muted-foreground">residual</span>
                  <span className="mono w-[62px] text-right text-[11px] text-foreground">
                    {res >= 0 ? `+${res.toFixed(2)}` : res.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/60 pt-2">
              <span className="hud-label">RMS convergence</span>
              <Sparkline values={solution.history.map((h) => h.rms)} />
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {solving ? "running gauss-newton…" : "no solution computed"}
            </p>
            <p className="mx-auto mt-2 max-w-[260px] text-[12px] leading-relaxed text-muted-foreground">
              The range circles are drawn from the measured distances. Press{" "}
              <span className="text-foreground">Calculate Location</span> to solve the intersection and fill this
              panel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}