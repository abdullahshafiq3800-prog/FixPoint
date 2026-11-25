import { SAT_COLORS, SAT_LABELS } from "@/lib/scenario";

const f = (n) => (Number.isFinite(n) ? n.toFixed(2) : "—");

export function EquationPanel({ sats, radii, solution }) {
  const matrix = solution.linear?.matrix;
  const singular = solution.linear?.singular;

  return (
    <section>
      <div className="space-y-4">
        <div>
          <div className="hud-label">1 · Range circles</div>
          <div className="mono mt-2 space-y-1.5 text-[11px] leading-relaxed text-foreground">
            {sats.map((sat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SAT_COLORS[i] }} />
                <span className="truncate text-muted-foreground">
                  (x − {f(sat.x)})² + (y − {f(sat.y)})² = {f(radii[i])}²
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="hud-label">2 · Subtract circle A → linear system</div>
          {matrix ? (
            <div className="mono mt-2 space-y-1 text-[11px] text-muted-foreground">
              <div>
                <span className="text-accent">{f(matrix.a11)}</span> x +{" "}
                <span className="text-accent">{f(matrix.a12)}</span> y ={" "}
                <span className="text-foreground">{f(matrix.b1)}</span>
              </div>
              <div>
                <span className="text-accent">{f(matrix.a21)}</span> x +{" "}
                <span className="text-accent">{f(matrix.a22)}</span> y ={" "}
                <span className="text-foreground">{f(matrix.b2)}</span>
              </div>
              <div className="pt-1 text-[10px] uppercase tracking-[0.12em]">
                determinant {singular ? "≈ 0 (singular)" : f(matrix.a11 * matrix.a22 - matrix.a12 * matrix.a21)}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-muted-foreground">Waiting for three valid ranges.</p>
          )}
        </div>

        <div>
          <div className="hud-label">3 · Gauss-Newton refinement</div>
          <div className="mono mt-2 rounded-sm border border-border/70 bg-background/60 px-2.5 py-2 text-[11px] text-muted-foreground">
            <div className="text-foreground">Δ = (JᵀJ)⁻¹ Jᵀ r</div>
            <div className="mt-1.5">J_i = (p − s_i) / ‖p − s_i‖</div>
            <div className="mt-0.5">r_i = ‖p − s_i‖ − r̂_i</div>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            Each iteration nudges the guess in the direction that shrinks the total squared range error. It stops when
            the step length drops below 10⁻⁹ or after 30 iterations.
          </p>
          {singular ? (
            <p className="mt-2 rounded-sm border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-2 py-1.5 text-[11px] text-[#f59e0b]">
              Satellites A, B and C are nearly collinear, so the algebra cannot isolate a single point. Move one
              satellite to restore a good geometry.
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-2">
          <span className="hud-label">Satellites</span>
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {SAT_LABELS.join(" · ")} online
          </span>
        </div>
      </div>
    </section>
  );
}