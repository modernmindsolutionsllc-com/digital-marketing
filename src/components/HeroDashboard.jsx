import { ArrowUpRight, BarChart3, MousePointerClick, TrendingUp } from "lucide-react";
import { dashboardSignals, statHighlights } from "../data/siteContent";

const performanceBars = [
  { height: "42%", color: "from-blue-500 to-cyan-400" },
  { height: "58%", color: "from-blue-500 to-cyan-400" },
  { height: "55%", color: "from-violet-500 to-fuchsia-400" },
  { height: "78%", color: "from-cyan-400 to-blue-500" },
  { height: "72%", color: "from-blue-500 to-violet-500" },
  { height: "92%", color: "from-cyan-400 to-violet-500" },
  { height: "86%", color: "from-blue-500 to-cyan-400" },
];

export default function HeroDashboard() {
  return (
    <div className="glass-card relative overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:p-7">
      <div className="absolute inset-0 grid-overlay opacity-30" aria-hidden="true" />
      <div className="relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Performance Dashboard</p>
            <h3 className="font-display mt-2 text-2xl font-bold text-white">Growth metrics you can actually act on</h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
            <TrendingUp size={16} />
            18.4% growth this month
          </div>
        </div>

        <div className="mt-7 grid gap-4 xl:grid-cols-[1.4fr_0.92fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Campaign performance</p>
                <p className="mt-2 font-display text-3xl font-bold text-white">$184,200</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <BarChart3 className="text-cyan-300" size={22} />
              </div>
            </div>
            <div className="mt-7">
              <div className="flex h-48 items-end gap-3 rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-transparent px-4 pb-4 pt-6">
                {performanceBars.map((bar, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div className={`w-full rounded-t-2xl bg-gradient-to-t ${bar.color}`} style={{ height: bar.height }} />
                    <span className="text-xs text-slate-500">{`W${index + 1}`}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {statHighlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">Primary funnel</p>
                  <p className="mt-2 font-display text-2xl font-bold text-white">Traffic to revenue</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-400/20 p-3">
                  <MousePointerClick className="text-cyan-200" size={18} />
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { stage: "Visitors", percent: "92%", value: "48.2k" },
                  { stage: "Leads", percent: "68%", value: "2.9k" },
                  { stage: "Customers", percent: "54%", value: "412" },
                ].map((item) => (
                  <div key={item.stage}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.stage}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.08]">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500"
                        style={{ width: item.percent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {dashboardSignals.map((signal) => (
                <div key={signal.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-slate-400">{signal.title}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{signal.value}</p>
                    </div>
                    <ArrowUpRight className="text-cyan-300" size={18} />
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{signal.change}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
