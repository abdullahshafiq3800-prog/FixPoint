import { Dices, Crosshair, RotateCcw, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { MAX_NOISE } from "@/lib/scenario";

export function ControlPanel({
  noise,
  onNoiseChange,
  onGenerate,
  onCalculate,
  onReset,
  solving,
  solved,
  stale,
  showTruth,
  onToggleTruth,
}) {
  return (
    <div className="rounded-md border border-border bg-card/70 p-3 md:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onCalculate} disabled={solving} className="mono text-[11px] uppercase tracking-[0.14em]">
          {solving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crosshair className="mr-2 h-4 w-4" />}
          {solving ? "Solving" : "Calculate Location"}
        </Button>
        <Button
          onClick={onGenerate}
          variant="outline"
          className="mono border-accent/40 text-[11px] uppercase tracking-[0.14em] text-accent hover:text-accent"
        >
          <Dices className="mr-2 h-4 w-4" /> Generate Scenario
        </Button>
        <Button
          onClick={onReset}
          variant="ghost"
          className="mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Reveal truth</span>
          <Switch checked={showTruth} onCheckedChange={onToggleTruth} aria-label="Reveal the true receiver position" />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <span className="hud-label">Signal measurement error</span>
            <span className="mono text-[12px] text-primary">± {noise.toFixed(1)} u</span>
          </div>
          <Slider
            className="mt-3"
            value={[noise]}
            min={0}
            max={MAX_NOISE}
            step={0.1}
            onValueChange={(v) => onNoiseChange(v[0])}
            aria-label="Signal measurement error"
          />
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground md:max-w-[300px]">
          0 u = clean timing. Push it up and the circles stop meeting at a single point.
        </p>
      </div>

      <div className="mono mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.12em]">
        <span className={solved ? "text-[#10b981]" : stale ? "text-[#f59e0b]" : "text-muted-foreground"}>
          {solved ? "● solution locked" : stale ? "● measurements changed, re-run" : "● awaiting solution"}
        </span>
        <span className="text-muted-foreground">drag A / B / C to move satellites</span>
      </div>
    </div>
  );
}