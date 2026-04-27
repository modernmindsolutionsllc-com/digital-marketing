import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpenText,
  ChevronRight,
  ExternalLink,
  Globe,
  Inbox,
  Megaphone,
  PenSquare,
  Search,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

const PILLARS = [
  {
    id: "acquisition",
    label: "Search & Acquisition",
    shortLabel: "Acquisition",
    icon: Search,
    color: "from-cyan-400 to-blue-500",
    accent: "text-cyan-300",
    borderAccent: "border-cyan-400/30",
    bgAccent: "bg-cyan-400/10",
    description: "Own high-intent demand across search and paid media channels.",
    tools: [
      { name: "Google Analytics 4", category: "Analytics", icon: BarChart3 },
      { name: "Ahrefs", category: "SEO Research", icon: Search },
      { name: "Google Ads", category: "Paid Search", icon: TrendingUp },
      { name: "Search Console", category: "Indexing", icon: Globe },
      { name: "Semrush", category: "Competitive Intel", icon: ChevronRight },
      { name: "Meta Ads", category: "Paid Social", icon: Megaphone },
    ],
    caseStudy: {
      title: "Technical SEO overhaul lifts organic 240% in 6 months",
      category: "Local Service Brand",
      metric: "+240%",
      result: "organic traffic growth",
      summary: "Site cleanup, local-intent pages, and content clusters lifted visibility on high-converting service terms.",
    },
  },
  {
    id: "content",
    label: "Content & Community",
    shortLabel: "Content",
    icon: PenSquare,
    color: "from-violet-400 to-indigo-500",
    accent: "text-violet-300",
    borderAccent: "border-violet-400/30",
    bgAccent: "bg-violet-400/10",
    description: "Create attention that looks native to the platforms where buyers spend time.",
    tools: [
      { name: "Canva Pro", category: "Creative", icon: PenSquare },
      { name: "Hootsuite", category: "Scheduling", icon: Megaphone },
      { name: "Meta Business", category: "Social Ads", icon: Users },
      { name: "CreatorIQ", category: "Influencer", icon: ShoppingBag },
      { name: "Notion", category: "Editorial", icon: BookOpenText },
      { name: "Sprout Social", category: "Listening", icon: Globe },
    ],
    caseStudy: {
      title: "Creator-led UGC drives 1.2M impressions and +180% qualified leads",
      category: "DTC Launch",
      metric: "1.2M",
      result: "impressions in launch quarter",
      summary: "Creator matching, UGC ad usage, and social sequencing connected discovery to lead capture.",
    },
  },
  {
    id: "retention",
    label: "Retention & Partnerships",
    shortLabel: "Retention",
    icon: Inbox,
    color: "from-orange-400 to-rose-500",
    accent: "text-orange-300",
    borderAccent: "border-orange-400/30",
    bgAccent: "bg-orange-400/10",
    description: "Keep demand moving after the first click with lifecycle systems and partner channels.",
    tools: [
      { name: "Klaviyo", category: "Email Automation", icon: Inbox },
      { name: "Postscript", category: "SMS Marketing", icon: Megaphone },
      { name: "HubSpot", category: "CRM", icon: Users },
      { name: "Impact.com", category: "Affiliates", icon: TrendingUp },
      { name: "Attentive", category: "Lifecycle", icon: BarChart3 },
      { name: "Shopify Flow", category: "Automation", icon: ShoppingBag },
    ],
    caseStudy: {
      title: "Lifecycle automation triples repeat purchase rate in 90 days",
      category: "E-commerce Growth",
      metric: "3.8x",
      result: "blended ROAS with 32% lower CPA",
      summary: "Audience cleanup, offer testing, and intent-mapped product pages pushed efficiency without slowing volume.",
    },
  },
];

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
};

function ToolCard({ tool, pillar }) {
  const Icon = tool.icon;

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="methodology-tool-card group"
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
    >
      <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${pillar.color} text-white`}>
        <Icon size={18} />
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-white">{tool.name}</p>
        <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-slate-500">
          {tool.category}
        </p>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <ExternalLink size={12} className={pillar.accent} />
      </div>
    </motion.div>
  );
}

export default function MethodologyMatrix() {
  const [activeId, setActiveId] = useState("acquisition");
  const activePillar = PILLARS.find((p) => p.id === activeId);

  return (
    <div>
      {/* Pillar tabs */}
      <div className="methodology-tabs">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const isActive = activeId === pillar.id;

          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActiveId(pillar.id)}
              className={`methodology-tab group ${isActive ? "methodology-tab-active" : ""}`}
            >
              <div
                className={`flex size-9 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-br ${pillar.color} text-white`
                    : "border border-white/10 bg-white/[0.04] text-slate-500 group-hover:text-slate-300"
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="text-left">
                <p
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  {pillar.shortLabel}
                </p>
                <p className="hidden text-[0.65rem] text-slate-600 sm:block">{pillar.label}</p>
              </div>

              {isActive ? (
                <motion.div
                  layoutId="methodology-tab-indicator"
                  className={`absolute inset-0 rounded-xl border ${pillar.borderAccent} ${pillar.bgAccent}`}
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Active pillar description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePillar.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="mt-6"
        >
          <p className="text-sm leading-7 text-slate-400">{activePillar.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Bento grid */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* Tools grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id + "-tools"}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {activePillar.tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} pillar={activePillar} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Case study snippet */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id + "-case"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="methodology-case-card"
          >
            <span className={`text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${activePillar.accent}`}>
              Case Study
            </span>
            <h4 className="font-display mt-3 text-lg font-semibold tracking-tight text-white sm:text-xl">
              {activePillar.caseStudy.title}
            </h4>
            <p className="mt-3 text-sm leading-6 text-slate-400">{activePillar.caseStudy.summary}</p>

            <div className={`mt-5 rounded-xl border ${activePillar.borderAccent} ${activePillar.bgAccent} p-4`}>
              <p className="font-display text-2xl font-semibold text-white">{activePillar.caseStudy.metric}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{activePillar.caseStudy.result}</p>
            </div>

            <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-slate-600">
              {activePillar.caseStudy.category}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
