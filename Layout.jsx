import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Satellite, Radio, ListOrdered, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Simulator", short: "Grid", icon: Satellite },
  { to: "/how-it-works", label: "Mechanics", short: "Mechanics", icon: Radio },
  { to: "/learn", label: "Solver", short: "Solver", icon: ListOrdered },
  { to: "/quiz", label: "Quiz", short: "Quiz", icon: CircleHelp },
];

function Clock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const tick = () => setTime(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="mono hidden text-[11px] tracking-[0.14em] text-muted-foreground sm:inline">
      {time
        ? `${time.toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" })} UTC`
        : "--:--:-- UTC"}
    </span>
  );
}

export function Layout({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-[#050b14]/92 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1680px] items-center gap-3 px-3 md:px-5">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm border border-primary/40 bg-primary/10">
              <Satellite className="h-4 w-4 text-primary" />
            </span>
            <span className="mono truncate text-[12px] font-medium tracking-[0.14em] text-foreground md:text-[13px]">
              FIXPOINT <span className="text-primary">//</span> GPS TRILATERATION
            </span>
          </Link>

          <span className="ml-auto hidden items-center gap-1.5 rounded-sm border border-[#10b981]/40 bg-[#10b981]/10 px-2 py-1 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            <span className="mono text-[10px] tracking-[0.16em] text-[#10b981]">3 SV LOCK</span>
          </span>
          <Clock />

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "mono rounded-sm px-2.5 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors",
                    isActive
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="pb-20 md:pb-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#050b14]/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4">
          {NAV.map((item) => {
            const isActive = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 py-2",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="mono text-[10px] uppercase tracking-[0.1em]">{item.short}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}