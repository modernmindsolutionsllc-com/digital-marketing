import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  Megaphone,
  Rocket,
  Send,
  ShoppingCart,
  Target,
  Users,
} from "lucide-react";

const GOALS = [
  {
    id: "ecommerce",
    label: "E-commerce Growth",
    description: "Scale revenue, improve ROAS, and increase repeat purchase rate.",
    icon: ShoppingCart,
    gradient: "from-cyan-400/20 to-blue-500/20",
    accent: "text-cyan-300",
  },
  {
    id: "leadgen",
    label: "Lead Generation",
    description: "Drive qualified leads, improve conversion rate, and build pipeline.",
    icon: Target,
    gradient: "from-orange-400/20 to-rose-500/20",
    accent: "text-orange-300",
  },
  {
    id: "awareness",
    label: "Brand Awareness",
    description: "Expand reach, build trust, and grow share of voice across channels.",
    icon: Megaphone,
    gradient: "from-violet-400/20 to-indigo-500/20",
    accent: "text-violet-300",
  },
];

const ECOMMERCE_PLATFORMS = [
  { id: "shopify", label: "Shopify", description: "Headless or storefront-based." },
  { id: "woocommerce", label: "WooCommerce", description: "WordPress-based commerce." },
  { id: "custom", label: "Custom Build", description: "Headless, Magento, or bespoke." },
];

const LEAD_VOLUMES = [
  { id: "under50", label: "Under 50 / mo", description: "Early-stage pipeline." },
  { id: "50to200", label: "50–200 / mo", description: "Growing demand capture." },
  { id: "200plus", label: "200+ / mo", description: "Scaling and optimization." },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0, filter: "blur(6px)" }),
};

function OptionCard({ item, isSelected, onSelect }) {
  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`audit-flow-card group relative w-full text-left ${isSelected ? "audit-flow-card-active" : ""}`}
      whileHover={{ scale: 1.018, y: -2 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        {Icon ? (
          <div className={`icon-chip shrink-0 ${isSelected ? "!border-cyan-300/40 !bg-cyan-300/15 !text-cyan-200" : ""}`}>
            <Icon size={20} />
          </div>
        ) : null}

        <div className="flex-1">
          <p className="text-lg font-semibold text-white">{item.label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
        </div>

        <div
          className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
            isSelected
              ? "border-cyan-300 bg-cyan-300 text-slate-950"
              : "border-white/20 bg-white/[0.04]"
          }`}
        >
          {isSelected ? <CheckCircle2 size={14} /> : null}
        </div>
      </div>
    </motion.button>
  );
}

export default function SmartAuditFlow() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [goal, setGoal] = useState(null);
  const [adaptiveAnswer, setAdaptiveAnswer] = useState(null);
  const [formData, setFormData] = useState({ name: "", url: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  function goNext() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleGoalSelect(id) {
    setGoal(id);
    setAdaptiveAnswer(null);
    setTimeout(goNext, 280);
  }

  function handleAdaptiveSelect(id) {
    setAdaptiveAnswer(id);
    setTimeout(goNext, 280);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.url) return;
    setSubmitted(true);
  }

  const adaptiveOptions = goal === "ecommerce" ? ECOMMERCE_PLATFORMS : LEAD_VOLUMES;
  const adaptiveLabel =
    goal === "ecommerce"
      ? "Which e-commerce platform are you on?"
      : goal === "leadgen"
        ? "What is your current monthly lead volume?"
        : "Where are you spending most on awareness?";

  const stepLabels = ["Goal", "Details", "Contact"];

  return (
    <div className="audit-flow-wrapper">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  i <= step
                    ? "bg-gradient-to-br from-cyan-300 to-blue-400 text-slate-950"
                    : "border border-white/15 bg-white/[0.04] text-slate-500"
                }`}
              >
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span
                className={`text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 ${
                  i <= step ? "text-cyan-200" : "text-slate-600"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300/30 to-transparent blur-sm" />
        </div>
      </div>

      {/* Success State */}
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-5 py-12 text-center"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-300">
            <CheckCircle2 size={32} className="text-slate-950" />
          </div>
          <h3 className="font-display text-2xl font-semibold text-white">Audit request sent!</h3>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            We will review your funnel and respond within one business day with an opportunity map and clear next steps.
          </p>
        </motion.div>
      ) : (
        /* Step Content */
        <div className="relative min-h-[22rem] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 ? (
              <motion.div
                key="step-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute inset-x-0 top-0"
              >
                <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  What is your primary growth goal?
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  This helps us shape the audit around what matters most to your business.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {GOALS.map((g) => (
                    <OptionCard key={g.id} item={g} isSelected={goal === g.id} onSelect={handleGoalSelect} />
                  ))}
                </div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute inset-x-0 top-0"
              >
                <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {adaptiveLabel}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {goal === "awareness"
                    ? "Select the closest match so we can benchmark your current position."
                    : "This shapes our audit scope and benchmark recommendations."}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {goal === "awareness"
                    ? [
                        { id: "social", label: "Social Media", description: "Paid and organic social reach." },
                        { id: "content", label: "Content & SEO", description: "Editorial and search-first." },
                        { id: "influencer", label: "Influencer & PR", description: "Creator-led campaigns." },
                      ].map((item) => (
                        <OptionCard
                          key={item.id}
                          item={item}
                          isSelected={adaptiveAnswer === item.id}
                          onSelect={handleAdaptiveSelect}
                        />
                      ))
                    : adaptiveOptions.map((item) => (
                        <OptionCard
                          key={item.id}
                          item={item}
                          isSelected={adaptiveAnswer === item.id}
                          onSelect={handleAdaptiveSelect}
                        />
                      ))}
                </div>

                <button
                  type="button"
                  onClick={goBack}
                  className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/[0.08]"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute inset-x-0 top-0"
              >
                <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Almost there — how do we reach you?
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Share your details and we will prepare a tailored audit within one business day.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm text-slate-200">
                    <span className="flex items-center gap-2">
                      <Users size={14} className="text-cyan-300" />
                      Full Name
                    </span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Jane Smith"
                      className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white placeholder:text-slate-500"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm text-slate-200">
                      <span className="flex items-center gap-2">
                        <Globe size={14} className="text-cyan-300" />
                        Website URL
                      </span>
                      <input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        required
                        placeholder="https://yoursite.com"
                        className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white placeholder:text-slate-500"
                      />
                    </label>

                    <label className="grid gap-2 text-sm text-slate-200">
                      <span className="flex items-center gap-2">
                        <Rocket size={14} className="text-cyan-300" />
                        Work Email
                      </span>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="you@company.com"
                        className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white placeholder:text-slate-500"
                      />
                    </label>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={goBack}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.08]"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>

                    <button
                      type="submit"
                      className="focus-ring action-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-slate-950"
                    >
                      <Send size={16} />
                      Submit audit request
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
