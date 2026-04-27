import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Flame,
  Layers,
  LineChart,
  MousePointerClick,
  TrendingUp,
  Zap,
} from "lucide-react";

const MOCK_METRICS = [
  {
    id: "roas",
    label: "Blended ROAS",
    value: "3.82x",
    change: "+0.46x",
    trend: "up",
    icon: TrendingUp,
    color: "from-cyan-400 to-blue-500",
    glow: "rgba(127,245,255,0.15)",
    tooltip: "Return on Ad Spend across all paid channels. We track this weekly against a rolling 90-day average to surface true efficiency gains.",
    sparkline: [28, 34, 31, 42, 38, 52, 48, 56, 62, 58, 64, 72],
  },
  {
    id: "organic",
    label: "Organic Sessions",
    value: "24.8K",
    change: "+18.2%",
    trend: "up",
    icon: LineChart,
    color: "from-emerald-400 to-teal-500",
    glow: "rgba(52,211,153,0.15)",
    tooltip: "Monthly organic search sessions tracked via GA4. We correlate this with keyword position movements and new page indexing velocity.",
    sparkline: [18, 22, 20, 28, 32, 30, 36, 42, 40, 48, 52, 58],
  },
  {
    id: "cpa",
    label: "Cost per Lead",
    value: "$34.20",
    change: "-12.4%",
    trend: "down",
    icon: MousePointerClick,
    color: "from-orange-400 to-rose-500",
    glow: "rgba(251,146,60,0.15)",
    tooltip: "Average cost to acquire a qualified lead. We benchmark by channel and exclude junk leads using CRM-qualified status.",
    sparkline: [72, 68, 65, 62, 58, 54, 52, 48, 44, 40, 38, 34],
  },
  {
    id: "campaigns",
    label: "Active Campaigns",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Layers,
    color: "from-violet-400 to-indigo-500",
    glow: "rgba(167,139,250,0.15)",
    tooltip: "Live campaigns running across search, social, and lifecycle channels. Each one maps to a specific funnel stage with dedicated creative.",
    sparkline: [4, 5, 5, 6, 7, 7, 8, 9, 9, 10, 11, 12],
  },
];

const CHANNELS = [
  { label: "Google Ads", status: "live", spend: "$4.2K" },
  { label: "Meta Ads", status: "live", spend: "$3.1K" },
  { label: "Email Flows", status: "live", spend: "—" },
  { label: "SEO Content", status: "review", spend: "—" },
  { label: "LinkedIn Ads", status: "paused", spend: "$800" },
];

const RECENT_ACTIONS = [
  { text: "Landing page A/B test deployed", time: "2h ago", icon: Zap },
  { text: "Meta campaign budget scaled +15%", time: "6h ago", icon: Flame },
  { text: "Weekly performance report sent", time: "1d ago", icon: Eye },
];

function MiniSparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 32;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((val - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(127,245,255,0.6)" />
          <stop offset="100%" stopColor="rgba(40,201,255,0.6)" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={`url(#spark-${color})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function MetricWidget({ metric, index }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = metric.icon;

  return (
    <motion.div
      className="dashboard-widget group relative"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200, damping: 24 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Glow effect on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[1.25rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${metric.glow}, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${metric.color} text-white`}>
            <Icon size={16} />
          </div>
          <span
            className={`text-xs font-semibold ${
              metric.trend === "up" ? "text-emerald-400" : "text-orange-400"
            }`}
          >
            {metric.change}
          </span>
        </div>

        <p className="font-display mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {metric.value}
        </p>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {metric.label}
        </p>

        <div className="mt-3">
          <MiniSparkline data={metric.sparkline} color={metric.id} />
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="dashboard-tooltip"
          >
            <div className="flex items-start gap-2">
              <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-cyan-300" />
              <p className="text-xs leading-5 text-slate-200">{metric.tooltip}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DashboardTeaser() {
  return (
    <div className="dashboard-teaser-wrapper">
      {/* Chrome bar */}
      <div className="dashboard-chrome">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-rose-500/70" />
          <span className="size-3 rounded-full bg-amber-400/70" />
          <span className="size-3 rounded-full bg-emerald-400/70" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-1.5">
          <span className="text-[0.65rem] text-slate-500">portal.growthpulsedigital.com/dashboard</span>
        </div>
        <div className="w-14" />
      </div>

      {/* Dashboard header */}
      <div className="flex flex-col gap-4 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Client Portal</p>
          <h3 className="font-display mt-1 text-lg font-semibold text-white sm:text-xl">Performance Overview</h3>
          <p className="mt-1 text-xs text-slate-500">Last 30 days • Refreshed 4 min ago</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            All systems live
          </span>
        </div>
      </div>

      {/* Metric grid */}
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {MOCK_METRICS.map((metric, index) => (
          <MetricWidget key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid gap-3 px-5 pb-5 sm:px-6 sm:pb-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Channel status */}
        <div className="dashboard-widget">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Channel Status</p>
          <div className="mt-4 space-y-2.5">
            {CHANNELS.map((ch) => (
              <div key={ch.label} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-3.5 py-2.5">
                <div className="flex items-center gap-3">
                  <span
                    className={`size-2 rounded-full ${
                      ch.status === "live"
                        ? "bg-emerald-400"
                        : ch.status === "review"
                          ? "bg-amber-400"
                          : "bg-slate-600"
                    }`}
                  />
                  <span className="text-sm text-slate-200">{ch.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{ch.spend}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${
                      ch.status === "live"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : ch.status === "review"
                          ? "bg-amber-400/10 text-amber-300"
                          : "bg-slate-700/40 text-slate-500"
                    }`}
                  >
                    {ch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent actions */}
        <div className="dashboard-widget">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Recent Actions</p>
          <div className="mt-4 space-y-3">
            {RECENT_ACTIONS.map((action) => {
              const ActionIcon = action.icon;
              return (
                <div key={action.text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03]">
                    <ActionIcon size={13} className="text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-200">{action.text}</p>
                    <p className="mt-0.5 text-[0.65rem] text-slate-600">{action.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-xl border border-white/6 bg-gradient-to-r from-cyan-400/[0.06] to-transparent p-3.5">
            <p className="text-xs font-medium text-slate-300">
              <span className="font-semibold text-cyan-200">Every client</span> gets live dashboard access with weekly strategy notes and full channel visibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
