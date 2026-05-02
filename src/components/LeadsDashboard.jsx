import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Flame,
  Snowflake,
  Clock,
  Building2,
  Mail,
  Phone,
  FileText,
  Target,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

/* ── Priority badge config ──────────────────────────────────────── */
const PRIORITY_BADGES = {
  1: {
    label: "🔥 Hot Lead",
    className:
      "border-rose-400/30 bg-rose-400/[0.08] text-rose-300 shadow-sm shadow-rose-400/10",
    glow: "rgba(251,113,133,0.25)",
  },
  2: {
    label: "🟡 Warm",
    className:
      "border-amber-400/30 bg-amber-400/[0.08] text-amber-300 shadow-sm shadow-amber-400/10",
    glow: "rgba(251,191,36,0.2)",
  },
  3: {
    label: "❄️ Cold",
    className:
      "border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300 shadow-sm shadow-cyan-400/10",
    glow: "rgba(34,211,238,0.15)",
  },
};

/* ── Skeleton row ───────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="border-b border-white/[0.04]">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 w-full animate-pulse rounded-md bg-white/[0.06]" />
        </td>
      ))}
    </tr>
  );
}

/* ── Priority badge component ───────────────────────────────────── */
function PriorityBadge({ priority }) {
  const config = PRIORITY_BADGES[priority] || PRIORITY_BADGES[3];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
      style={{ textShadow: `0 0 12px ${config.glow}` }}
    >
      {config.label}
    </motion.span>
  );
}

/* ── Stat card ──────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-10 items-center justify-center rounded-xl border ${accent} bg-white/[0.04]`}
        >
          <Icon size={18} />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Format date ────────────────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/* ════════════════════════════════════════════════════════════════════
   LeadsDashboard
   ════════════════════════════════════════════════════════════════════ */
export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function fetchLeads() {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("mmsllc_admin_token");
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const res = await fetch("/api/dashboard_data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("mmsllc_admin_token");
        navigate("/admin/login", { replace: true });
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server.");
      }

      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else {
        throw new Error(data.error || "Failed to load leads.");
      }
    } catch (err) {
      setError(err.message || "Network error.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Aggregate stats ────────────────────────────────────────────── */
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.lead_priority === 1).length;
  const warmLeads = leads.filter((l) => l.lead_priority === 2).length;
  const coldLeads = leads.filter((l) => l.lead_priority === 3).length;

  /* ── Table columns ──────────────────────────────────────────────── */
  const columns = [
    { key: "name", label: "Name", icon: Users },
    { key: "email", label: "Email", icon: Mail },
    { key: "phone", label: "Phone", icon: Phone },
    { key: "company", label: "Company", icon: Building2 },
    { key: "service", label: "Service / Goal", icon: Target },
    { key: "lead_priority", label: "Priority", icon: Flame },
    { key: "created_at", label: "Date", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header row ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Lead Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            All captured leads from SmartAudit and Free Audit flows
          </p>
        </div>

        <button
          onClick={fetchLeads}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={isLoading ? "—" : totalLeads}
          accent="border-cyan-400/20 text-cyan-300"
        />
        <StatCard
          icon={Flame}
          label="Hot Leads"
          value={isLoading ? "—" : hotLeads}
          accent="border-rose-400/20 text-rose-300"
        />
        <StatCard
          icon={Target}
          label="Warm Leads"
          value={isLoading ? "—" : warmLeads}
          accent="border-amber-400/20 text-amber-300"
        />
        <StatCard
          icon={Snowflake}
          label="Cold Leads"
          value={isLoading ? "—" : coldLeads}
          accent="border-cyan-400/20 text-cyan-300"
        />
      </div>

      {/* ── Error state ────────────────────────────────────────────── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] px-5 py-4 text-sm text-rose-300"
        >
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchLeads}
            className="ml-auto rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs font-semibold transition hover:bg-rose-400/10"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* ── Data table ─────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            {/* Head */}
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                  >
                    <span className="flex items-center gap-1.5">
                      <col.icon size={13} className="opacity-50" />
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center text-sm text-slate-500"
                  >
                    <FileText size={32} className="mx-auto mb-3 opacity-30" />
                    No leads captured yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <motion.tr
                    key={lead.id || i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3.5 font-medium text-white">
                      {lead.name || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-300">
                      {lead.email || "—"}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-300">
                      {lead.phone || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {lead.company || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {lead.service || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={lead.lead_priority} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {formatDate(lead.created_at)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
