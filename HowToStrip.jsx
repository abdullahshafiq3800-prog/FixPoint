const STEPS = [
  {
    n: "01",
    title: "Generate a scenario",
    body: "Places a hidden receiver and three satellites. Each range circle is sized from the measured distance only — the receiver itself stays unknown.",
  },
  {
    n: "02",
    title: "Push the signal noise",
    body: "The error slider degrades the timing measurements. Watch the three circles drift apart instead of meeting at one clean point.",
  },
  {
    n: "03",
    title: "Calculate, then reveal truth",
    body: "Gauss-Newton fits the best position, then Reveal truth shows the real point and scores the error in world units.",
  },
];

export function HowToStrip() {
  return (
    <div className="rounded-md border border-border bg-card/50 p-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="hud-label">60-second demo path</span>
        <span className="mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          for first-time viewers and judges
        </span>
      </div>
      <div className="mt-2 grid gap-3 md:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="flex gap-2.5">
            <span className="mono text-[11px] text-primary">{step.n}</span>
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.1em] text-foreground">{step.title}</div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}