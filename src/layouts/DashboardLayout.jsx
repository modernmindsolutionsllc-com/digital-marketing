import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Shield,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

/* ── Sidebar nav items ──────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Leads", path: "/admin/dashboard", icon: Users },
];

/**
 * DashboardLayout
 * ---------------------------------------------------------------------------
 * The structural shell for the admin portal. Fixed sidebar (left) and a
 * scrollable main content area (right) rendered via <Outlet />.
 * ---------------------------------------------------------------------------
 */
export default function DashboardLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem("mmsllc_admin_token");
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* ── Mobile overlay ──────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.06] bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20">
            <Shield size={18} className="text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">MMSLLC</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Admin Portal</p>
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1 text-slate-500 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-400/[0.08] text-cyan-200 shadow-sm shadow-cyan-400/5"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? "text-cyan-300" : ""} />
                  {item.label}
                  <ChevronRight
                    size={14}
                    className={`ml-auto transition-opacity ${isActive ? "opacity-60" : "opacity-0 group-hover:opacity-40"}`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/[0.06] px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-all hover:bg-rose-400/[0.06] hover:text-rose-300"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="flex items-center gap-4 border-b border-white/[0.06] px-6 py-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.04] hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} className="text-cyan-400" />
            <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          </div>

          <p className="ml-auto text-xs text-slate-500">
            Welcome, <span className="text-slate-300">Admin</span>
          </p>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
