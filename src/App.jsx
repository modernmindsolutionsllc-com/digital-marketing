import { lazy, Suspense, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Reveal from "./components/Reveal";
import SectionHeading from "./components/SectionHeading";
import SmartAuditFlow from "./components/SmartAuditFlow";
import DashboardTeaser from "./components/DashboardTeaser";
import MethodologyMatrix from "./components/MethodologyMatrix";
import {
  auditDeliverables,
  buyerSegments,
  caseStudies,
  contactPoints,
  faqSchema,
  faqs,
  footerLinks,
  footerServices,
  footerSocials,
  heroSignals,
  insights,
  marketingGoals,
  metrics,
  navigation,
  operatingPrinciples,
  platformFluency,
  pricingTiers,
  processSteps,
  schemaServices,
  serviceGroups,
  testimonials,
  trustMarkers,
} from "./data/siteContent";

const HeroSignalScene = lazy(() => import("./components/HeroSignalScene"));

const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: faqSchema,
    },
    ...schemaServices,
  ],
};

function trackLeadEvent(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const storedTheme = window.localStorage.getItem("growthpulse-theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function ServiceGroup({ group, index }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className="grid gap-7 border-t border-white/10 py-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
        <div>
          <span className="eyebrow">{group.eyebrow}</span>
          <h3 className="font-display mt-4 max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-[2.15rem] sm:leading-tight">
            {group.title}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{group.description}</p>

          <div className="media-frame mt-6">
            <img src={group.image} alt={group.imageAlt} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="grid content-start items-start gap-5 sm:grid-cols-2">
          {group.services.map((service) => {
            const Icon = service.icon;

            return (
              <div key={service.title} className="service-panel">
                <div className="flex items-start gap-4">
                  <div className="icon-chip">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{service.title}</h4>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{service.summary}</p>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-sm text-slate-200">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <Check className="mt-0.5 shrink-0 text-cyan-300" size={16} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </article>
    </Reveal>
  );
}

function CaseStudyCard({ study, index }) {
  return (
    <Reveal delay={index * 0.08}>
      <article className="case-study-card">
        <img src={study.image} alt={study.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="case-study-overlay" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200/90">{study.category}</p>
          <h3 className="font-display mt-3 max-w-sm text-2xl font-semibold tracking-tight text-white">
            {study.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">{study.summary}</p>

          <dl className="mt-4 grid gap-3 text-sm text-slate-200">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Challenge</dt>
              <dd className="mt-2 leading-6">{study.challenge}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Action</dt>
              <dd className="mt-2 leading-6">{study.approach}</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-end justify-between gap-5 border-t border-white/15 pt-4">
            <div>
              <p className="font-display text-3xl font-semibold text-white">{study.metric}</p>
              <p className="mt-2 text-sm text-slate-300">{study.result}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{study.timeframe}</p>
            </div>
            <a
              href="#audit"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white"
              onClick={() => trackLeadEvent("case_study_cta_click", { case_study: study.category })}
            >
              Get this type of plan
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {study.channels.map((channel) => (
              <span key={channel} className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs text-slate-200">
                {channel}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Testimonial({ testimonial, index }) {
  return (
    <Reveal delay={index * 0.05}>
      <figure className="quote-line">
        <blockquote className="text-lg leading-8 text-white">"{testimonial.quote}"</blockquote>
        <figcaption className="mt-4 text-sm text-slate-400">
          <span className="font-semibold text-white">{testimonial.name}</span>
          {` - ${testimonial.role}, ${testimonial.company}`}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function BuyerSegment({ segment, index }) {
  const Icon = segment.icon;

  return (
    <Reveal delay={index * 0.06}>
      <article className="segment-panel">
        <div className="icon-chip">
          <Icon size={20} />
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">{segment.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{segment.summary}</p>
        <ul className="mt-5 space-y-3 text-sm text-slate-200">
          {segment.needs.map((need) => (
            <li key={need} className="flex items-start gap-3">
              <Check className="mt-0.5 shrink-0 text-cyan-300" size={16} />
              <span>{need}</span>
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function PricingTier({ tier, index }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className={`pricing-panel ${tier.featured ? "pricing-panel-featured" : ""}`}>
        {tier.featured ? <span className="pricing-badge">Most requested</span> : null}
        <h3 className="text-xl font-semibold tracking-tight text-white">{tier.name}</h3>
        <p className="font-display mt-3 text-3xl font-semibold text-white">{tier.price}</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">{tier.bestFor}</p>
        <ul className="mt-5 space-y-3 text-sm text-slate-200">
          {tier.includes.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <Check className="mt-0.5 shrink-0 text-cyan-300" size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

function InsightCard({ insight, index }) {
  const Icon = insight.icon;

  return (
    <Reveal delay={index * 0.06}>
      <article className="insight-panel">
        <div className="icon-chip">
          <Icon size={18} />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{insight.category}</p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">{insight.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{insight.excerpt}</p>
      </article>
    </Reveal>
  );
}

function FaqItem({ faq, index }) {
  return (
    <Reveal delay={index * 0.05}>
      <details className="faq-item group">
        <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl text-left text-lg font-semibold text-white">
          <span>{faq.question}</span>
          <ChevronDown className="shrink-0 text-cyan-300 transition-transform duration-200 group-open:rotate-180" size={20} />
        </summary>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{faq.answer}</p>
      </details>
    </Reveal>
  );
}

export default function App() {
  const [formStatus, setFormStatus] = useState("idle");
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem("growthpulse-theme", theme);
    } catch {
      // Theme still works for the active session when storage is unavailable.
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  function handleAuditSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setFormStatus("error");
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    trackLeadEvent("audit_form_submit", {
      goal: formData.get("goal"),
      website: formData.get("website"),
    });
    setFormStatus("success");
    form.reset();
  }

  return (
    <div className={`relative overflow-x-clip theme-${theme}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }} />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[52rem] bg-[radial-gradient(circle_at_top,_rgba(116,248,255,0.16),_transparent_42%),radial-gradient(circle_at_78%_16%,_rgba(255,153,92,0.16),_transparent_20%)]" />
      <div className="pointer-events-none absolute left-[-10rem] top-[34rem] h-80 w-80 rounded-full bg-cyan-400/8 blur-[150px]" />
      <div className="pointer-events-none absolute right-[-12rem] top-[68rem] h-96 w-96 rounded-full bg-orange-400/10 blur-[180px]" />

      <Navbar theme={theme} onThemeToggle={toggleTheme} />

      <main>
        <section id="home" className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80"
            alt="Digital marketing team collaborating around laptops and presentation screens."
            className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(4,10,18,0.92)_0%,_rgba(4,10,18,0.8)_42%,_rgba(4,10,18,0.48)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(116,248,255,0.14),_transparent_20%),radial-gradient(circle_at_82%_72%,_rgba(255,153,92,0.18),_transparent_24%)]" />

          <div className="section-shell relative flex min-h-[calc(100svh-4.5rem)] items-center py-12 sm:py-14 lg:py-16">
            <div className="grid w-full gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <Reveal>
                <div className="max-w-2xl">
                  <span className="eyebrow">GrowthPulse Digital</span>
                  <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[4.4rem] lg:leading-[0.98]">
                    Digital marketing systems that turn attention into qualified growth.
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                    SEO, content, social media, PPC, email, affiliate, and influencer campaigns aligned to one clear
                    goal: more pipeline, stronger conversion, and better return on every channel.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="#audit"
                      className="focus-ring action-primary inline-flex items-center justify-center rounded-full px-6 py-4 text-base font-semibold text-slate-950"
                      onClick={() => trackLeadEvent("hero_cta_click")}
                    >
                      Get a free growth audit
                    </a>
                    <a
                      href="#work"
                      className="focus-ring inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-6 py-4 text-base font-semibold text-white hover:bg-white/[0.08]"
                      onClick={() => trackLeadEvent("hero_work_click")}
                    >
                      See selected work
                    </a>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {heroSignals.map((signal) => (
                      <span key={signal} className="signal-pill">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="hero-stage">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,_rgba(116,248,255,0.12),_transparent_26%),linear-gradient(180deg,_rgba(6,16,26,0.32)_0%,_rgba(6,16,26,0.9)_100%)]" />
                  <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(127,245,255,0.12),_transparent_24%)]" />}>
                    <HeroSignalScene />
                  </Suspense>

                  <div className="absolute left-5 top-5 rounded-full border border-white/12 bg-slate-950/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200 backdrop-blur">
                    Live growth signal
                  </div>

                  <div className="absolute left-5 bottom-5 max-w-[16rem] rounded-[1.5rem] border border-white/12 bg-slate-950/62 p-4 backdrop-blur">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Connected channels</p>
                    <p className="mt-3 text-sm leading-7 text-slate-200">
                      Search, paid, social, and lifecycle campaigns sharing one message and one reporting rhythm.
                    </p>
                  </div>

                  <div className="absolute right-5 top-5 rounded-[1.5rem] border border-white/12 bg-slate-950/58 px-4 py-4 text-right backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Average lift</p>
                    <p className="font-display mt-2 text-3xl font-semibold text-white">+180%</p>
                    <p className="mt-1 text-sm text-slate-300">qualified lead growth</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="section-shell py-8">
          <Reveal>
            <div className="metrics-strip">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="font-display text-3xl font-semibold text-white sm:text-4xl">
                    {metric.prefix}
                    {metric.value}
                    {metric.suffix}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="trust-band mt-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">Platform fluency</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {platformFluency.map((platform) => (
                    <span key={platform} className="platform-chip">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[28rem]">
                {trustMarkers.map((marker) => (
                  <div key={marker.label} className="border-t border-white/10 pt-4">
                    <p className="font-display text-3xl font-semibold text-white">{marker.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">{marker.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="proof" className="section-shell section-space">
          <div className="grid gap-9 lg:grid-cols-[0.84fr_1.16fr]">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <span className="eyebrow">Why Growth Teams Stay</span>
                <h2 className="font-display mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-[2.65rem] sm:leading-tight">
                  One operating model across strategy, creative, media, and reporting.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                  The best digital-marketing experiences feel clear from the first click: the promise is obvious, the
                  proof is visible, and the next step is easy to take on mobile or desktop.
                </p>

                <div className="media-frame mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=1200&q=80"
                    alt="Marketer reviewing campaign performance in a modern office."
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <div className="space-y-6">
              {operatingPrinciples.map((principle, index) => (
                <Reveal key={principle.label} delay={index * 0.05}>
                  <article className="border-t border-white/10 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{principle.label}</p>
                    <p className="mt-3 max-w-2xl text-xl leading-8 text-white sm:text-[1.35rem] sm:leading-8">
                      {principle.value}
                    </p>
                  </article>
                </Reveal>
              ))}

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Delivery rhythm</p>
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {processSteps.map((step, index) => (
                    <Reveal key={step.title} delay={index * 0.04}>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-sm text-slate-400">{`0${index + 1}`}</p>
                        <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">{step.timeframe}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section-shell section-space pt-0">
          <SectionHeading
            eyebrow="Services"
            title="Seven digital marketing capabilities working as one growth system."
            description="Your customers move across search, social, content, email, and partner touchpoints. Our service mix is designed to make that journey feel connected from first visit to repeat conversion."
          />

          <div className="mt-7">
            {serviceGroups.map((group, index) => (
              <ServiceGroup key={group.title} group={group} index={index} />
            ))}
          </div>
        </section>

        <section className="section-shell section-space pt-0">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionHeading
              eyebrow="Who We Help"
              title="Built around the buying problems behind the channel list."
              description="Most brands do not need more disconnected tactics. They need the right channel mix for their market, sales cycle, budget, and conversion path."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {buyerSegments.map((segment, index) => (
                <BuyerSegment key={segment.title} segment={segment} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="section-shell section-space">
          <SectionHeading
            eyebrow="Selected Work"
            title="Proof of how channel strategy turns into measurable growth."
            description="Each engagement starts with a clear business problem, a focused plan, and a result that can be traced back to real customer behavior."
          />

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {caseStudies.map((study, index) => (
              <CaseStudyCard key={study.title} study={study} index={index} />
            ))}
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={testimonial.name} testimonial={testimonial} index={index} />
            ))}
          </div>
        </section>

        <section className="section-shell section-space pt-0">
          <SectionHeading
            eyebrow="Starting Investment"
            title="Clear engagement shapes before anyone books a call."
            description="Pricing depends on channel scope, production needs, ad spend, and reporting complexity, but these ranges help teams decide whether the fit is right before requesting an audit."
          />

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <PricingTier key={tier.name} tier={tier} index={index} />
            ))}
          </div>
        </section>

        <section id="smart-audit" className="section-shell section-space pt-0">
          <SectionHeading
            eyebrow="Smart Audit"
            title="Tell us your goal. We will shape the audit around it."
            description="Answer three quick questions so our team can prepare a tailored opportunity map instead of a generic checklist."
          />

          <div className="mt-7">
            <Reveal>
              <SmartAuditFlow />
            </Reveal>
          </div>
        </section>

        <section id="portal" className="section-shell section-space pt-0">
          <SectionHeading
            eyebrow="Client Portal"
            title="Transparency is the strategy. Every client sees the full picture."
            description="Our reporting portal connects campaign performance, channel health, and optimization actions in one live view — updated weekly with plain-language strategy notes."
          />

          <div className="mt-7">
            <Reveal>
              <DashboardTeaser />
            </Reveal>
          </div>
        </section>

        <section id="methodology" className="section-shell section-space pt-0">
          <SectionHeading
            eyebrow="Methodology"
            title="Platform fluency organized by growth pillar."
            description="We use best-in-class tools for every stage of the funnel. Select a pillar to explore the stack and see a relevant case study."
          />

          <div className="mt-7">
            <Reveal>
              <MethodologyMatrix />
            </Reveal>
          </div>
        </section>

        <section id="insights" className="section-shell section-space pt-0">
          <div className="grid gap-9 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <SectionHeading
                eyebrow="Insights"
                title="Useful thinking that shapes better campaigns."
                description="The same thinking behind strong SEO, paid media, and lifecycle performance should be visible in the way an agency explains strategy, measurement, and customer intent."
              />

              <div className="mt-7 grid gap-5">
                {insights.map((insight, index) => (
                  <InsightCard key={insight.title} insight={insight} index={index} />
                ))}
              </div>
            </div>

            <div className="lg:pt-10">
              <span className="eyebrow">FAQ</span>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-white sm:text-[2.65rem] sm:leading-tight">
                Quick answers before someone books the audit.
              </h2>
              <div className="mt-7 grid gap-4">
                {faqs.map((faq, index) => (
                  <FaqItem key={faq.question} faq={faq} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="audit" className="section-shell section-space pt-0">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(255,255,255,0.04)_0%,_rgba(255,255,255,0.02)_100%)]">
              <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="audit-visual-panel relative overflow-hidden border-b border-white/10 p-8 sm:p-10 lg:border-b-0 lg:border-r">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                    alt="Team workshop session around laptops and notes."
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(6,16,26,0.78)_0%,_rgba(6,16,26,0.92)_100%)]" />

                  <div className="relative z-10">
                    <span className="eyebrow">Free Audit</span>
                    <h2 className="font-display mt-5 text-2xl font-semibold tracking-tight text-white sm:text-[2.15rem] sm:leading-tight">
                      Bring us your funnel. We will show you where demand is leaking.
                    </h2>
                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                      Your audit includes channel review, messaging friction, conversion blockers, and a short list of
                      changes that can improve visibility, response, and return.
                    </p>

                    <div className="mt-6 space-y-3">
                      {auditDeliverables.map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <ShieldCheck className="mt-0.5 text-cyan-300" size={18} />
                          <span className="text-sm text-slate-200">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 rounded-[1.25rem] border border-white/10 bg-slate-950/45 p-5">
                      <p className="text-sm font-semibold text-white">A good fit for brands that need:</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        stronger lead quality, better paid efficiency, better organic visibility, or a clearer picture
                        of which channels deserve the next dollar.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 sm:p-10">
                  <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">Request the audit</p>
                    <p className="mt-2 text-sm text-slate-400">Most teams hear back within one business day.</p>
                  </div>

                  <form className="grid gap-5" onSubmit={handleAuditSubmit}>
                    <label className="grid gap-2 text-sm text-slate-200">
                      <span>Name</span>
                      <input
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Your full name"
                        className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white placeholder:text-slate-500"
                      />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm text-slate-200">
                        <span>Email</span>
                        <input
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                          placeholder="you@company.com"
                          className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white placeholder:text-slate-500"
                        />
                      </label>

                      <label className="grid gap-2 text-sm text-slate-200">
                        <span>Website URL</span>
                        <input
                          type="url"
                          name="website"
                          required
                          autoComplete="url"
                          placeholder="https://yourwebsite.com"
                          className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white placeholder:text-slate-500"
                        />
                      </label>
                    </div>

                    <label className="grid gap-2 text-sm text-slate-200">
                      <span>Main marketing goal</span>
                      <select
                        name="goal"
                        defaultValue=""
                        required
                        className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white"
                      >
                        <option value="" disabled>
                          Select your main goal
                        </option>
                        {marketingGoals.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="grid gap-2 text-sm text-slate-200">
                      <span>Message</span>
                      <textarea
                        name="message"
                        rows="5"
                        placeholder="Tell us where your funnel feels stuck right now."
                        className="focus-ring rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-white placeholder:text-slate-500"
                      />
                    </label>

                    {formStatus === "success" ? (
                      <div className="form-status form-status-success" role="status">
                        <CheckCircle2 size={18} />
                        <span>Audit request captured. In production, this is ready to connect to your form service or CRM endpoint.</span>
                      </div>
                    ) : null}

                    {formStatus === "error" ? (
                      <div className="form-status form-status-error" role="alert">
                        <AlertCircle size={18} />
                        <span>Please complete the required fields so the audit request has enough context.</span>
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      className="focus-ring action-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-slate-950"
                    >
                      <Send size={18} />
                      Send my audit request
                    </button>

                    <p className="text-xs leading-6 text-slate-500">
                      No spam. Your details are used only to prepare the audit response and next-step recommendations.
                    </p>
                  </form>

                  <div id="contact" className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                    {contactPoints.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        {item.label === "Email" ? (
                          <Mail className="mt-0.5 text-cyan-300" size={16} />
                        ) : item.label === "Phone" ? (
                          <Phone className="mt-0.5 text-cyan-300" size={16} />
                        ) : (
                          <MapPin className="mt-0.5 text-cyan-300" size={16} />
                        )}
                        <a href={item.href} className="focus-ring text-sm leading-6 text-slate-300 hover:text-white">
                          {item.value}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/45">
        <div className="section-shell py-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
            <div>
              <a href="#home" className="focus-ring flex w-fit items-center gap-3 rounded-full">
                <span className="brand-mark">GP</span>
                <span className="font-display text-lg font-semibold tracking-tight text-white">GrowthPulse Digital</span>
              </a>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                GrowthPulse Digital helps ambitious brands build clearer reporting, stronger conversion paths, and more
                connected performance across SEO, paid, social, content, email, affiliate, and influencer marketing.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Navigate</h3>
              <ul className="mt-5 space-y-3">
                {footerLinks.map((link) => {
                  const item = navigation.find((navItem) => navItem.label === link);
                  return (
                    <li key={link}>
                      <a href={item?.href ?? "#home"} className="focus-ring text-sm text-slate-300 hover:text-white">
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Capabilities</h3>
              <ul className="mt-5 space-y-3">
                {footerServices.map((service) => (
                  <li key={service}>
                    <a href="#services" className="focus-ring text-sm text-slate-300 hover:text-white">
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">Follow</h3>
              <div className="mt-5 flex flex-wrap gap-4">
                {footerSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring text-sm text-slate-300 hover:text-white"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500">
            (c) 2026 GrowthPulse Digital. Built for stronger first impressions and clearer conversion paths.
          </p>
        </div>
      </footer>

      <div className="mobile-cta-bar lg:hidden">
        <a
          href="#audit"
          className="focus-ring action-primary inline-flex flex-1 items-center justify-center rounded-full px-3.5 py-2.5 text-sm font-semibold text-slate-950"
          onClick={() => trackLeadEvent("mobile_sticky_audit_click")}
        >
          Get audit
        </a>
        <a
          href="tel:+15552401128"
          className="focus-ring inline-flex items-center justify-center rounded-full border border-white/12 bg-slate-950/80 px-3.5 py-2.5 text-sm font-semibold text-white"
          onClick={() => trackLeadEvent("mobile_sticky_call_click")}
        >
          Call
        </a>
      </div>
    </div>
  );
}
