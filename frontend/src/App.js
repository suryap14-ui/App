import React, { useState, useRef, useEffect, useMemo, Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import {
  ArrowUpRight,
  Sparkles,
  Cpu,
  Smartphone,
  Cloud,
  LayoutGrid,
  Bug,
  ShoppingBag,
  Users,
  Brush,
  Code2,
  Server,
  MessageSquare,
  Send,
  X,
  Bot,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Quote,
  ChevronRight,
  Check,
} from "lucide-react";
import axios from "axios";

const HeroScene = lazy(() =>
  import("@/components/HeroScene").then((m) => ({ default: m.HeroScene }))
);
const CapabilitiesScene = lazy(() =>
  import("@/components/HeroScene").then((m) => ({ default: m.CapabilitiesScene }))
);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ---------------- Hero ----------------
const Particles = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }).map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 12}s`,
        duration: `${8 + Math.random() * 10}s`,
      })),
    []
  );
  return (
    <div className="particles" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={i}
          style={{
            top: d.top,
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
};

const Nav = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 nav-blur" data-testid="main-nav">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2" data-testid="nav-logo">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center glow-cyan">
            <Sparkles size={18} className="text-deepnavy" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-lg">BVM<span className="text-gradient">.</span></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">Consultancy</div>
          </div>
        </a>
        <ul className="hidden md:flex items-center gap-9 text-sm text-white/70">
          {["Services", "Capabilities", "Work", "Clients", "Contact"].map((l) => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase()}`}
                className="hover:text-white transition-colors"
                data-testid={`nav-link-${l.toLowerCase()}`}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn-primary !py-2.5 !px-5 text-sm hidden md:inline-flex" data-testid="nav-cta">
          Get in touch <ArrowUpRight size={16} />
        </a>
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
        >
          <div className="space-y-1.5">
            <div className="w-6 h-px bg-white" />
            <div className="w-6 h-px bg-white" />
          </div>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 space-y-3" data-testid="mobile-menu">
          {["Services", "Capabilities", "Work", "Clients", "Contact"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block text-white/80 py-2"
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden grain">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <Particles />
      {/* Orb */}
      <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
        <div className="ai-orb" data-testid="hero-orb" />
      </div>
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-violet/30 blur-[120px] pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-[360px] h-[360px] rounded-full bg-cyan/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overline mb-6"
            data-testid="hero-overline"
          >
            <span className="divider-dot" />
            BVM CONSULTANCY · EST. 2014
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] leading-[0.95] font-bold"
            data-testid="hero-headline"
          >
            We build{" "}
            <span className="text-gradient">world-class</span>{" "}
            <br className="hidden sm:block" />
            digital products with{" "}
            <span className="italic font-light text-white/80">intelligence</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 text-lg text-white/65 max-w-xl leading-relaxed"
            data-testid="hero-subhead"
          >
            A studio of engineers, designers, and AI craftspeople designing custom
            applications for ambitious teams. From idea to scale — engineered to be
            beautiful, fast, and unmistakably native.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a href="#contact" className="btn-primary" data-testid="hero-cta-primary">
              Start a project <ArrowUpRight size={18} />
            </a>
            <a href="#work" className="btn-ghost" data-testid="hero-cta-secondary">
              See our work
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
            data-testid="hero-stats"
          >
            {[
              ["50+", "products shipped"],
              ["20+", "enterprise clients"],
              ["10y", "of engineering"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="font-display text-3xl font-bold text-gradient">{k}</div>
                <div className="text-xs text-white/50 mt-1 uppercase tracking-wider font-mono">{v}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ---------------- Services ----------------
const services = [
  { icon: Brush, title: "UI / UX Design", desc: "Interfaces that feel obvious, even when they're inventive." },
  { icon: Smartphone, title: "Mobile Solutions", desc: "Native iOS, Android & cross-platform that earn screen time." },
  { icon: Cloud, title: "Cloud", desc: "AWS, Heroku, GCP — architectures that scale silently." },
  { icon: LayoutGrid, title: "Architectural", desc: "Systems designed to grow without rewrites." },
  { icon: Bug, title: "Quality & Testing", desc: "Selenium, Cypress, Mocha — confidence on every commit." },
  { icon: ShoppingBag, title: "E‑Commerce", desc: "High-conversion storefronts engineered for performance." },
  { icon: Users, title: "Staffing Service", desc: "Senior engineers, embedded with your team in days." },
  { icon: Code2, title: "Frontend", desc: "React, Angular, Next — pixel-perfect, accessible, fast." },
  { icon: Server, title: "Backend", desc: "Ruby on Rails, Node, Java. APIs that don't blink under load." },
];

const Services = () => (
  <section id="services" className="relative py-32 md:py-40">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid lg:grid-cols-12 gap-12 mb-16">
        <div className="lg:col-span-5">
          <div className="section-overline-wrap">
            <span className="overline">
              <span className="divider-dot" /> 01 — WHAT WE BUILD
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-testid="services-headline">
            One studio.
            <br />
            <span className="text-gradient">Every layer</span> of the stack.
          </h2>
        </div>
        <div className="lg:col-span-7 lg:pt-12">
          <p className="text-lg text-white/65 leading-relaxed max-w-2xl">
            From the first sketch to the last deployment — we obsess over the
            details that turn software into a product people love. Tell us what
            you're trying to build, and we'll show up with the right team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="service-card group"
              data-testid={`service-card-${i}`}
            >
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon size={22} className="text-cyan" />
              </div>
              <h3 className="font-display text-xl font-medium mb-2">{s.title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
              <div className="mt-6 flex items-center text-cyan text-xs font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ChevronRight size={14} className="ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

// ---------------- Tech Marquee ----------------
const techStack = [
  "Ruby on Rails", "React", "Next.js", "Angular", "Node.js", "Python", "Java",
  "PostgreSQL", "MongoDB", "Redis", "AWS", "Heroku", "Nginx", "HaProxy",
  "Selenium", "Cypress", "iOS", "Android", "Figma", "TypeScript",
];

const TechMarquee = () => (
  <section className="relative py-16 border-y border-white/5 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-deepnavy via-transparent to-deepnavy pointer-events-none z-10" />
    <div className="overline mb-6 max-w-7xl mx-auto px-6 md:px-12">
      <span className="divider-dot" /> TECH WE WIELD DAILY
    </div>
    <Marquee gradient={false} speed={40} pauseOnHover>
      {techStack.map((t, i) => (
        <div key={i} className="flex items-center mx-8" data-testid={`tech-${i}`}>
          <span className="font-display text-2xl md:text-3xl text-white/40 hover:text-white transition-colors">
            {t}
          </span>
          <span className="mx-8 text-violet text-2xl">✦</span>
        </div>
      ))}
    </Marquee>
  </section>
);

// ---------------- Capabilities Tabs ----------------
const capabilities = {
  "UI / UX": {
    headline: "Designed to feel inevitable.",
    desc: "We sketch, prototype, and pressure-test every flow before a line of code is written. Result: interfaces that feel like they were always meant to be there.",
    bullets: ["Discovery & strategy", "Design systems", "Interactive prototypes", "Accessibility built-in"],
  },
  Frontend: {
    headline: "Pixel-perfect at 60fps.",
    desc: "Modern React/Angular stacks, hand-tuned animations, perfect Core Web Vitals. We obsess over the milliseconds users feel but never see.",
    bullets: ["React, Next.js, Angular", "Framer Motion, Three.js", "TypeScript end-to-end", "Lighthouse 95+ scores"],
  },
  Mobile: {
    headline: "Native where it matters.",
    desc: "iOS, Android, and Flutter — built by engineers who ship to millions. We pick the stack that fits your roadmap, not the other way around.",
    bullets: ["Swift / Kotlin native", "Flutter & React Native", "Offline-first architectures", "App Store launch support"],
  },
  Backend: {
    headline: "APIs that don't blink.",
    desc: "Ruby on Rails experts with deep wells in Node, Java, and Python. From greenfield APIs to legacy rescues, we keep your data layer boringly reliable.",
    bullets: ["Ruby on Rails specialists", "Event-driven systems", "GraphQL & REST", "Postgres / Mongo / Redis"],
  },
  Testing: {
    headline: "Ship on Friday. Sleep on Saturday.",
    desc: "Automated test suites, performance audits, and CI gates. We make confidence the default state of your engineering team.",
    bullets: ["Selenium, Cypress, Mocha", "Load & stress testing", "CI/CD pipelines", "Manual QA when it counts"],
  },
};

const Capabilities = () => {
  const tabs = Object.keys(capabilities);
  const [active, setActive] = useState(tabs[0]);
  const data = capabilities[active];
  return (
    <section id="capabilities" className="relative py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="section-overline-wrap">
          <span className="overline">
            <span className="divider-dot" /> 02 — CAPABILITIES
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-14 max-w-3xl" data-testid="capabilities-headline">
          A team that <span className="text-gradient">owns the stack</span> — so you don't have to.
        </h2>

        <div className="glass rounded-3xl p-2 inline-flex flex-wrap gap-2 mb-12" data-testid="capabilities-tablist">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              data-testid={`capability-tab-${t.toLowerCase().replace(/[^a-z]/g, "")}`}
              className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                active === t
                  ? "bg-gradient-to-r from-cyan to-violet text-deepnavy"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-7">
            <h3 className="font-display text-3xl md:text-4xl font-medium mb-5">{data.headline}</h3>
            <p className="text-white/65 text-lg leading-relaxed max-w-xl">{data.desc}</p>
          </div>
          <div className="lg:col-span-5">
            <div className="glass-strong rounded-2xl p-8 space-y-4 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 opacity-80 pointer-events-none">
                <Suspense fallback={null}>
                  <CapabilitiesScene />
                </Suspense>
              </div>
              {data.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3 relative z-10">
                  <div className="mt-1 w-5 h-5 rounded-full bg-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-cyan" strokeWidth={3} />
                  </div>
                  <span className="text-white/80">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------- Work / Portfolio ----------------
const portfolio = [
  { img: "https://www.bvmcs.com/images/our-work1.png", title: "MasterGST", tag: "Fintech · Web App", color: "from-cyan/30 to-violet/30" },
  { img: "https://www.bvmcs.com/images/our-work2.png", title: "Edvantagepoint", tag: "EdTech · Marketplace", color: "from-violet/30 to-cyan/30" },
  { img: "https://www.bvmcs.com/images/our-work3.png", title: "Healthcare Suite", tag: "Health · Mobile", color: "from-cyan/30 to-violet/30" },
  { img: "https://www.bvmcs.com/images/our-work0.png", title: "Logistics Platform", tag: "Enterprise · SaaS", color: "from-violet/30 to-cyan/30" },
];

const Work = () => (
  <section id="work" className="relative py-32 md:py-40">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="flex flex-wrap items-end justify-between mb-14 gap-6">
        <div>
          <div className="section-overline-wrap">
            <span className="overline">
              <span className="divider-dot" /> 03 — SELECTED WORK
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl" data-testid="work-headline">
            Products we're <span className="text-gradient">quietly proud</span> of.
          </h2>
        </div>
        <a href="#contact" className="btn-ghost" data-testid="work-cta">
          Talk about yours <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {portfolio.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`group relative rounded-3xl overflow-hidden border border-white/10 ${i % 3 === 0 ? "md:col-span-2" : ""}`}
            data-testid={`work-card-${i}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-50 group-hover:opacity-80 transition-opacity z-10 pointer-events-none`} />
            <div className="absolute inset-0 bg-deepnavy/40 z-10 pointer-events-none" />
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-[340px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { e.target.style.background = "linear-gradient(135deg, #0a0a25, #1a0a45)"; e.target.style.minHeight = "340px"; }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <div className="font-mono text-xs uppercase tracking-widest text-cyan mb-2">{p.tag}</div>
              <h3 className="font-display text-2xl md:text-3xl font-medium flex items-center gap-3">
                {p.title}
                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ---------------- Testimonials ----------------
const testimonials = [
  { name: "Sudhakar Pala", role: "Edvantagepoint", img: "https://www.bvmcs.com/images/user.jpg", quote: "We needed a partner who could move fast without breaking the platform. BVMCS shipped a complete rebuild in three months — and our conversion went up 38%." },
  { name: "Mahender", role: "Edvantagepoint", img: "https://www.bvmcs.com/images/user2.jpg", quote: "Found exactly the information I needed urgently. The platform BVMCS built feels like it was designed by someone who actually understands the problem." },
  { name: "Ramesh K.", role: "MasterGST", img: "https://www.bvmcs.com/images/user.jpg", quote: "Five years in, they still feel like an extension of our team. That's the highest compliment I can give an agency." },
];

const Testimonials = () => (
  <section id="clients" className="relative py-32 md:py-40 overflow-hidden">
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet/10 blur-[120px] pointer-events-none" />
    <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
      <div className="section-overline-wrap">
        <span className="overline">
          <span className="divider-dot" /> 04 — CLIENTS
        </span>
      </div>
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-16 max-w-3xl" data-testid="testimonials-headline">
        Trusted by teams that ship <span className="text-gradient">real things</span>.
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass rounded-3xl p-8 relative"
            data-testid={`testimonial-${i}`}
          >
            <Quote className="text-cyan/40 mb-4" size={28} />
            <p className="text-white/80 leading-relaxed mb-8">{t.quote}</p>
            <div className="flex items-center gap-3 pt-6 border-t border-white/10">
              <img src={t.img} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan/30" onError={(e) => { e.target.style.background = "linear-gradient(135deg, #00f0ff, #b026ff)"; }} />
              <div>
                <div className="font-display font-medium text-sm">{t.name}</div>
                <div className="text-xs text-white/50 font-mono uppercase tracking-wider">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="border-y border-white/5 py-12">
      <div className="overline mb-8 max-w-7xl mx-auto px-6 md:px-12">
        <span className="divider-dot" /> 200+ TEAMS HAVE TRUSTED US
      </div>
      <Marquee gradient={false} speed={30}>
        {["logo-mastergst.png", "logo2.png", "logo4.png", "logo5.png", "logo7.png", "logo9.png", "logo10.png", "logo12.png", "logo13.png", "logo14.png", "logo15.png", "logo16.png"].map((l, i) => (
          <img
            key={i}
            src={`https://www.bvmcs.com/images/${l}`}
            alt="client"
            className="h-10 mx-10 logo-tile"
            data-testid={`client-logo-${i}`}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ))}
      </Marquee>
    </div>
  </section>
);

// ---------------- Contact ----------------
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post(`${API}/contact`, { ...form, source: "contact_form" });
      setStatus("sent");
      setForm({ name: "", email: "", company: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };
  return (
    <section id="contact" className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-cyan/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-violet/20 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="section-overline-wrap">
            <span className="overline">
              <span className="divider-dot" /> 05 — START SOMETHING
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" data-testid="contact-headline">
            Got an idea?{" "}
            <span className="text-gradient">Let's prototype it</span> by Friday.
          </h2>
          <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-md">
            Drop us a line. We reply within 24 hours with a no-nonsense proposal,
            a rough timeline, and the exact team we'd put on your project.
          </p>
          <div className="space-y-5 font-mono text-sm">
            <div className="flex items-center gap-3 text-white/70" data-testid="contact-email">
              <Mail size={16} className="text-cyan" /> hello@bvmcs.com
            </div>
            <div className="flex items-center gap-3 text-white/70" data-testid="contact-phone">
              <Phone size={16} className="text-cyan" /> +91 · talk to a human
            </div>
            <div className="flex items-center gap-3 text-white/70" data-testid="contact-location">
              <MapPin size={16} className="text-cyan" /> Hyderabad, India · Remote-first
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={submit} className="glass-strong rounded-3xl p-8 md:p-10 space-y-5" data-testid="contact-form">
            <div className="grid md:grid-cols-2 gap-5">
              <Input label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} testid="contact-input-name" required />
              <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testid="contact-input-email" required />
              <Input label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} testid="contact-input-company" />
              <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} testid="contact-input-phone" />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Tell us about your project</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What are you trying to build?"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:border-cyan focus:ring-2 focus:ring-cyan/30 transition-all"
                data-testid="contact-input-message"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-xs text-white/40 font-mono">We never share your details.</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary"
                data-testid="contact-submit"
              >
                {status === "sending" ? "Sending..." : status === "sent" ? "Sent ✓" : "Send message"}
                {status !== "sent" && <Send size={16} />}
              </button>
            </div>
            {status === "sent" && (
              <div className="text-cyan text-sm font-mono" data-testid="contact-success">
                ✓ Thanks — we'll be in touch within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div className="text-red-400 text-sm font-mono" data-testid="contact-error">
                Something went wrong. Email us at hello@bvmcs.com instead.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

const Input = ({ label, value, onChange, type = "text", testid, required }) => (
  <div>
    <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">{label}{required && " *"}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/30 focus:border-cyan focus:ring-2 focus:ring-cyan/30 transition-all"
      data-testid={testid}
    />
  </div>
);

// ---------------- Footer ----------------
const Footer = () => (
  <footer className="relative border-t border-white/5 py-14">
    <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-12 gap-8">
      <div className="md:col-span-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
            <Sparkles size={18} className="text-deepnavy" strokeWidth={2.5} />
          </div>
          <div className="font-display font-bold text-lg">BVM<span className="text-gradient">.</span> Consultancy</div>
        </div>
        <p className="text-white/50 text-sm max-w-sm leading-relaxed">
          We design and develop custom applications to meet our client's needs &
          objectives — engineered with intelligence, shipped with care.
        </p>
      </div>
      <div className="md:col-span-3">
        <div className="font-mono text-xs uppercase tracking-widest text-cyan mb-4">Studio</div>
        <ul className="space-y-2 text-sm text-white/60">
          <li><a href="#services" className="hover:text-white">Services</a></li>
          <li><a href="#work" className="hover:text-white">Work</a></li>
          <li><a href="#capabilities" className="hover:text-white">Capabilities</a></li>
          <li><a href="#contact" className="hover:text-white">Contact</a></li>
        </ul>
      </div>
      <div className="md:col-span-4">
        <div className="font-mono text-xs uppercase tracking-widest text-cyan mb-4">Elsewhere</div>
        <div className="flex gap-3">
          {[Twitter, Linkedin, Github].map((I, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:border-cyan/50 transition" data-testid={`social-${i}`}>
              <I size={16} className="text-white/70" />
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/40 font-mono">
      <div>© {new Date().getFullYear()} BVM Consultancy Services. Built with intelligence.</div>
      <div className="flex items-center gap-2"><span className="divider-dot" /> all systems operational</div>
    </div>
  </footer>
);

// ---------------- Chatbot ----------------
const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey, I'm Nova — BVMCS's AI assistant. Ask me anything about our services, or tell me about the project you're cooking up.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "" });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/chat`, {
        message: userMsg,
        session_id: sessionId,
      });
      setSessionId(data.session_id);
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      // simple intent: if reply mentions "name and email" show lead form
      if (/name and email|drop your name|share your name/i.test(data.reply) && !leadCaptured) {
        setShowLeadForm(true);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I had trouble reaching the server. Try again in a moment, or email hello@bvmcs.com." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (!lead.name || !lead.email) return;
    try {
      await axios.post(`${API}/leads`, { ...lead, source: "chatbot" });
      setLeadCaptured(true);
      setShowLeadForm(false);
      setMessages((m) => [
        ...m,
        { role: "user", content: `Name: ${lead.name} · Email: ${lead.email}` },
        { role: "assistant", content: `Got it, ${lead.name.split(" ")[0]}. Our team will reach out within 24 hours. In the meantime — anything else you want me to dig into?` },
      ]);
      setLead({ name: "", email: "" });
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center glow-cyan transition-transform hover:scale-110"
        data-testid="chatbot-trigger"
        aria-label="Open AI chat"
      >
        {!open && <span className="pulse-ring" />}
        {open ? <X size={22} className="text-deepnavy" /> : <Bot size={26} className="text-deepnavy" strokeWidth={2.2} />}
      </button>

      {/* Panel */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-28 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[560px] glass-strong rounded-3xl flex flex-col overflow-hidden shadow-2xl"
          data-testid="chatbot-panel"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-cyan/10 to-violet/10">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
                <Bot size={18} className="text-deepnavy" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 ring-2 ring-deepnavy" />
            </div>
            <div className="flex-1">
              <div className="font-display font-medium text-sm">Nova</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-cyan">BVMCS · AI Assistant</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white" data-testid="chatbot-close">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3" data-testid="chatbot-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {showLeadForm && !leadCaptured && (
              <form onSubmit={submitLead} className="glass rounded-2xl p-4 space-y-3 mt-2" data-testid="chatbot-lead-form">
                <div className="text-xs font-mono uppercase tracking-widest text-cyan">Get a reply within 24h</div>
                <input
                  placeholder="Your name"
                  value={lead.name}
                  onChange={(e) => setLead({ ...lead, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan"
                  data-testid="chatbot-lead-name"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={lead.email}
                  onChange={(e) => setLead({ ...lead, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-cyan"
                  data-testid="chatbot-lead-email"
                  required
                />
                <button type="submit" className="btn-primary !py-2 !px-4 text-sm w-full justify-center" data-testid="chatbot-lead-submit">
                  Send to BVMCS team <Send size={14} />
                </button>
              </form>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="p-4 border-t border-white/10 flex gap-2" data-testid="chatbot-input-form">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nova anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-cyan focus:ring-2 focus:ring-cyan/20"
              data-testid="chatbot-input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center disabled:opacity-50"
              data-testid="chatbot-send"
            >
              <Send size={15} className="text-deepnavy" strokeWidth={2.5} />
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
};

// ---------------- App ----------------
function App() {
  return (
    <div className="bg-deepnavy text-white min-h-screen" data-testid="app-root">
      <Nav />
      <Hero />
      <Services />
      <TechMarquee />
      <Capabilities />
      <Work />
      <Testimonials />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
