import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mail,
  KeyRound,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Fingerprint,
} from "lucide-react";

/* ── Animation variants ─────────────────────────────────────────── */
const cardVariants = {
  enter: { opacity: 0, y: 24, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.97 },
};

const transition = { type: "spring", stiffness: 260, damping: 26 };

/* ── Helper: format seconds → m:ss ──────────────────────────────── */
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ── Helper: mask email for display ─────────────────────────────── */
function maskEmail(email) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 3);
  return `${visible}***@${domain}`;
}

/* ════════════════════════════════════════════════════════════════════
   AdminLogin Component
   ════════════════════════════════════════════════════════════════════ */
export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "otp" | "success"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  /* ── Countdown timer for OTP expiry ────────────────────────────── */
  useEffect(() => {
    if (countdown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [countdown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Request OTP ───────────────────────────────────────────────── */
  async function handleRequestOTP(e) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin_auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { success: false, error: "Unexpected server response." };
      }

      if (res.ok && data.success) {
        setStep("otp");
        setCountdown(300);
        setOtp(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 120);
      } else {
        setError(data.error || "Failed to send code.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Verify OTP ────────────────────────────────────────────────── */
  async function handleVerifyOTP(e) {
    if (e) e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin_auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: code }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { success: false, error: "Unexpected server response." };
      }

      if (res.ok && data.success) {
        // Store auth token for PrivateRoute + dashboard API calls
        localStorage.setItem("mmsllc_admin_token", data.admin_email || email.trim().toLowerCase());
        setStep("success");
        if (onLoginSuccess) onLoginSuccess(data);
        setTimeout(() => navigate("/admin/dashboard", { replace: true }), 2000);
      } else {
        setError(data.error || "Invalid code.");
        setOtp(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  /* ── OTP input handlers ────────────────────────────────────────── */
  function handleOtpChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array(6).fill("");
    text.split("").forEach((c, i) => (next[i] = c));
    setOtp(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  }

  function handleGoBack() {
    setStep("email");
    setError(null);
    setOtp(Array(6).fill(""));
    setCountdown(0);
  }

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* ── Background effects ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[28rem] w-[28rem] rounded-full bg-cyan-500/[0.06] blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-violet-500/[0.06] blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.03] blur-[180px]" />
      </div>

      {/* ── Subtle grid overlay ─────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Card ────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* ─────────────────── STEP: EMAIL ─────────────────────────── */}
          {step === "email" && (
            <motion.div
              key="email-step"
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl shadow-cyan-500/[0.04] backdrop-blur-xl sm:p-10"
            >
              {/* Icon */}
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-blue-500/10">
                <Shield size={28} className="text-cyan-300" />
              </div>

              <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
                Admin Portal
              </h1>
              <p className="mt-2 text-center text-sm text-slate-400">
                MMSLLC secure authentication
              </p>

              <form onSubmit={handleRequestOTP} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    <Mail size={14} /> Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="admin@modernmindsolutions.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-cyan-400/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-cyan-400/20"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2.5 text-xs text-rose-300"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Lock size={16} /> Send Secure Code
                    </>
                  )}
                </button>
              </form>

              <p className="mt-8 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-600">
                <Fingerprint size={13} /> Protected by MMSLLC Security
              </p>
            </motion.div>
          )}

          {/* ─────────────────── STEP: OTP ───────────────────────────── */}
          {step === "otp" && (
            <motion.div
              key="otp-step"
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl shadow-cyan-500/[0.04] backdrop-blur-xl sm:p-10"
            >
              {/* Icon */}
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-400/10 to-indigo-500/10">
                <KeyRound size={28} className="text-violet-300" />
              </div>

              <h1 className="mt-6 text-center text-2xl font-semibold tracking-tight text-white">
                Enter Verification Code
              </h1>
              <p className="mt-2 text-center text-sm text-slate-400">
                Code sent to <span className="text-cyan-300">{maskEmail(email)}</span>
              </p>

              <form onSubmit={handleVerifyOTP} className="mt-8 space-y-5">
                {/* OTP Boxes */}
                <div className="flex justify-center gap-2.5 sm:gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      className={`size-12 rounded-xl border text-center text-lg font-bold outline-none transition-all duration-200 sm:size-14 sm:text-xl ${
                        digit
                          ? "border-cyan-400/40 bg-cyan-400/[0.06] text-white shadow-sm shadow-cyan-400/10"
                          : "border-white/[0.08] bg-white/[0.04] text-white"
                      } focus:border-cyan-400/50 focus:bg-cyan-400/[0.08] focus:ring-1 focus:ring-cyan-400/20`}
                    />
                  ))}
                </div>

                {/* Countdown */}
                <p className="text-center text-xs text-slate-500">
                  {countdown > 0 ? (
                    <>
                      Code expires in{" "}
                      <span className={countdown < 60 ? "text-rose-400" : "text-cyan-300"}>
                        {formatTime(countdown)}
                      </span>
                    </>
                  ) : (
                    <span className="text-rose-400">Code expired — request a new one</span>
                  )}
                </p>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-3 py-2.5 text-xs text-rose-300"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6 || countdown === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Verify & Login
                    </>
                  )}
                </button>
              </form>

              {/* Back link */}
              <button
                onClick={handleGoBack}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-xs font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-300"
              >
                <ArrowLeft size={14} /> Use a different email
              </button>

              <p className="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-600">
                <Fingerprint size={13} /> Protected by MMSLLC Security
              </p>
            </motion.div>
          )}

          {/* ─────────────────── STEP: SUCCESS ──────────────────────── */}
          {step === "success" && (
            <motion.div
              key="success-step"
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-center shadow-2xl shadow-emerald-500/[0.04] backdrop-blur-xl sm:p-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
                className="mx-auto flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-300 shadow-lg shadow-emerald-400/20"
              >
                <CheckCircle2 size={40} className="text-slate-950" />
              </motion.div>

              <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                Authentication Successful
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Welcome back, Admin. Redirecting to dashboard…
              </p>

              <div className="mt-6 flex justify-center">
                <Loader2 size={20} className="animate-spin text-cyan-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
