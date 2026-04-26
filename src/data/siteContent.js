import {
  BarChart3,
  BookOpenText,
  ChartNoAxesCombined,
  Handshake,
  Inbox,
  Megaphone,
  PenSquare,
  Search,
  Users,
} from "lucide-react";

export const navigation = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Proof", href: "#proof" },
  { label: "Work", href: "#work" },
  { label: "Insights", href: "#insights" },
  { label: "Audit", href: "#audit" },
];

export const heroSignals = ["SEO", "Paid Media", "Social Growth", "Lifecycle Email", "Creator Partnerships"];

export const metrics = [
  { value: 240, prefix: "+", suffix: "%", label: "organic traffic lift" },
  { value: 3.8, suffix: "x", label: "average blended ROAS", decimals: 1 },
  { value: 32, suffix: "%", label: "lower cost per acquisition" },
  { value: 180, prefix: "+", suffix: "%", label: "qualified lead growth" },
];

export const researchTakeaways = [
  {
    title: "A sharp promise in the first screen",
    description:
      "Strong agency sites quickly explain the business outcome they drive, not just the channels they manage.",
  },
  {
    title: "Proof that is visible before the scroll gets deep",
    description:
      "Results, testimonials, and operating principles appear early so trust builds before someone evaluates the service menu.",
  },
  {
    title: "Clear grouping instead of a long service list",
    description:
      "The strongest sites turn many offerings into a few easy-to-scan capability groups with distinct use cases.",
  },
  {
    title: "Thought leadership tied to performance",
    description:
      "Content, reporting language, and case studies all reinforce expertise instead of sounding like generic marketing copy.",
  },
];

export const operatingPrinciples = [
  {
    label: "Attribution-ready",
    value: "Every campaign rolls into one reporting rhythm across traffic, leads, and revenue quality.",
  },
  {
    label: "Creative with context",
    value: "Ad, email, and social creative are tied to funnel stage so the message changes with intent.",
  },
  {
    label: "Fast optimization",
    value: "Weekly testing loops keep SEO, paid media, and lifecycle campaigns compounding instead of drifting.",
  },
  {
    label: "Senior visibility",
    value: "Founders and marketing leads get plain-language insight instead of channel screenshots and vanity metrics.",
  },
];

export const serviceGroups = [
  {
    eyebrow: "Search & Acquisition",
    title: "Own high-intent demand across search and paid media.",
    description:
      "We connect technical SEO, content architecture, landing pages, and paid acquisition so traffic quality improves with every sprint.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Marketing analytics dashboard on a laptop screen.",
    services: [
      {
        title: "SEO",
        icon: Search,
        summary: "Technical audits, local SEO, content clusters, and on-page systems built for discoverability.",
        bullets: ["Technical SEO and site health", "Keyword mapping and search intent", "Local and organic growth plans"],
      },
      {
        title: "PPC",
        icon: ChartNoAxesCombined,
        summary: "Search, social, and retargeting campaigns tuned around CAC, ROAS, and conversion quality.",
        bullets: ["Search and paid social management", "Landing page and offer testing", "Budget pacing and CPA control"],
      },
    ],
  },
  {
    eyebrow: "Content & Community",
    title: "Create attention that looks native to the platforms where buyers spend time.",
    description:
      "From search-led editorial systems to social calendars and creator partnerships, we build campaigns that travel well across organic and paid channels.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Creative team collaborating around a table in a modern office.",
    services: [
      {
        title: "Content Marketing",
        icon: PenSquare,
        summary: "Editorial planning, landing pages, and conversion-focused assets that support search and nurture.",
        bullets: ["Topic clusters and briefs", "Lead magnets and campaign pages", "Conversion-first copy systems"],
      },
      {
        title: "Social Media Marketing",
        icon: Megaphone,
        summary: "Platform-native publishing, community management, and reporting that focuses on business impact.",
        bullets: ["Content calendars and publishing", "Community management support", "Performance analysis by channel"],
      },
      {
        title: "Influencer Marketing",
        icon: Users,
        summary: "Creator sourcing, UGC partnerships, and campaign structures designed for reach and believable trust.",
        bullets: ["Creator discovery and outreach", "UGC collaboration and ad usage", "Influencer performance reporting"],
      },
    ],
  },
  {
    eyebrow: "Retention & Partnerships",
    title: "Keep demand moving after the first click with lifecycle systems and partner channels.",
    description:
      "We strengthen repeat purchase, lead nurture, and partner-driven revenue so growth does not depend on a single campaign spike.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Person shopping online while reviewing marketing offers on a laptop.",
    services: [
      {
        title: "Email Marketing",
        icon: Inbox,
        summary: "Segmentation, automation, and lifecycle flows that turn interested traffic into repeat customers.",
        bullets: ["Lifecycle automation flows", "Segmentation and personalization", "Campaign reporting by funnel stage"],
      },
      {
        title: "Affiliate Marketing",
        icon: Handshake,
        summary: "Partner recruitment and incentive design that turns aligned publishers into scalable acquisition.",
        bullets: ["Partner sourcing and onboarding", "Commission and offer design", "Affiliate channel reporting"],
      },
    ],
  },
];

export const services = serviceGroups.flatMap((group) =>
  group.services.map((service) => ({
    title: service.title,
    description: service.summary,
    icon: service.icon,
  })),
);

export const processSteps = [
  {
    title: "Audit the funnel",
    description: "We review discoverability, acquisition cost, messaging, and the places users hesitate before converting.",
  },
  {
    title: "Prioritize leverage",
    description: "We rank the fastest wins and the highest-value bets so teams know what to fix first and why.",
  },
  {
    title: "Launch connected campaigns",
    description: "SEO, paid, social, and lifecycle work from one narrative so the brand feels consistent across touchpoints.",
  },
  {
    title: "Report what matters",
    description: "Dashboards and strategy notes focus on lead quality, pipeline movement, and revenue signals rather than vanity numbers.",
  },
  {
    title: "Scale with evidence",
    description: "The channels and creatives that prove efficient get more budget, more iterations, and better support assets.",
  },
];

export const caseStudies = [
  {
    category: "Local Service Brand",
    title: "Technical SEO plus content systems rebuilt inbound momentum.",
    metric: "+240%",
    result: "organic traffic in 6 months",
    summary:
      "We paired site cleanup, local intent pages, and content clusters to lift visibility on service terms that were ready to convert.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Team reviewing marketing performance on a large screen.",
  },
  {
    category: "E-commerce Growth",
    title: "Paid search, retargeting, and landing-page tuning cut waste fast.",
    metric: "3.8x",
    result: "blended ROAS with 32% lower CPA",
    summary:
      "Audience cleanup, creative testing, and stronger product-page intent mapping pushed efficiency without slowing volume.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Strategy session around a desk with documents and laptops.",
  },
  {
    category: "DTC Launch",
    title: "Creator-led content and social campaigns improved reach and lead quality.",
    metric: "1.2M",
    result: "impressions and +180% qualified leads",
    summary:
      "We matched creators to purchase intent, reused UGC in paid social, and tightened the path from discovery to capture.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Marketing team collaborating in front of laptops and a digital whiteboard.",
  },
];

export const testimonials = [
  {
    quote: "The reporting finally made sense. We could see what was creating pipeline, not just clicks.",
    name: "Avery Chen",
    role: "Head of Growth",
    company: "Northline Commerce",
  },
  {
    quote: "Their mix of SEO, paid, and email gave us one joined-up growth story instead of disconnected channel work.",
    name: "Maya Thompson",
    role: "Marketing Director",
    company: "Summit Health Partners",
  },
  {
    quote: "The strategy was sharp, but the speed of iteration is what changed our results month over month.",
    name: "Daniel Brooks",
    role: "Founder",
    company: "Crafted Supply Co.",
  },
];

export const insights = [
  {
    category: "SEO",
    title: "People-first search content wins when the page is useful before it is clever.",
    excerpt: "Content should answer intent clearly, demonstrate experience, and avoid sounding mass-produced for rankings.",
    icon: BookOpenText,
  },
  {
    category: "Measurement",
    title: "Attribution gets more believable when campaign, CRM, and landing-page signals are connected.",
    excerpt: "Strong agency sites explain how they measure lead quality, not only how they buy traffic.",
    icon: BarChart3,
  },
  {
    category: "Creative",
    title: "Visual consistency across ads, pages, and email makes conversion journeys feel more trustworthy.",
    excerpt: "Great digital-marketing sites show that creative execution and performance strategy belong in the same system.",
    icon: PenSquare,
  },
];

export const faqs = [
  {
    question: "How quickly can a digital marketing project start?",
    answer:
      "Most engagements can start within one to two weeks after discovery, depending on tracking access, creative needs, and how much infrastructure already exists.",
  },
  {
    question: "Do you offer only one service at a time?",
    answer:
      "Yes. Some brands hire us for a single channel such as SEO or PPC, while others bring us in to connect search, paid, social, and lifecycle work together.",
  },
  {
    question: "What does the free audit include?",
    answer:
      "The audit covers discoverability, conversion friction, messaging, paid efficiency, and next-step opportunities prioritized by likely business impact.",
  },
  {
    question: "How do you measure success?",
    answer:
      "We align channel reporting to business outcomes such as qualified leads, revenue efficiency, conversion rate, retention, and contribution to pipeline.",
  },
];

export const marketingGoals = [
  "Increase qualified leads",
  "Improve ROAS",
  "Grow organic visibility",
  "Scale e-commerce revenue",
  "Improve conversion rate",
  "Launch a new growth channel",
];

export const contactPoints = [
  { label: "Email", value: "hello@growthpulsedigital.com", href: "mailto:hello@growthpulsedigital.com" },
  { label: "Phone", value: "+1 (555) 240-1128", href: "tel:+15552401128" },
  { label: "Location", value: "Remote-first growth team serving brands across the U.S. and beyond.", href: "#contact" },
];

export const footerLinks = ["Home", "Services", "Proof", "Work", "Insights", "Audit"];

export const footerServices = services.map((service) => service.title);

export const footerSocials = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "X", href: "https://www.x.com" },
];

export const schemaServices = services.map((service) => ({
  "@type": "Service",
  name: service.title,
  description: service.description,
  provider: {
    "@type": "Organization",
    name: "GrowthPulse Digital",
  },
}));

export const faqSchema = faqs.map((faq) => ({
  "@type": "Question",
  name: faq.question,
  acceptedAnswer: {
    "@type": "Answer",
    text: faq.answer,
  },
}));

export const reviewSchema = testimonials.map((testimonial) => ({
  "@type": "Review",
  reviewBody: testimonial.quote,
  author: {
    "@type": "Person",
    name: testimonial.name,
  },
  reviewRating: {
    "@type": "Rating",
    ratingValue: "5",
    bestRating: "5",
  },
}));
