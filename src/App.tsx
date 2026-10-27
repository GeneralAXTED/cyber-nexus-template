import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'motion/react';
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Binary, Blocks,
  Check, ChevronDown, Code2, Cpu, Database, Fingerprint, Github,
  Globe2, Hexagon, LockKeyhole, Mail, Menu, Network, Radio, ScanLine, Shield,
  ShieldCheck, ShieldEllipsis, Sparkles, Terminal, Wifi, X, Zap,
} from 'lucide-react';
import MatrixRain from './components/MatrixRain';
import BootScreen from './components/BootScreen';
import SectionHeading from './components/SectionHeading';
import TerminalPanel from './components/TerminalPanel';
import NetworkMap from './components/NetworkMap';
import ContactForm from './components/ContactForm';

type Metrics = { cpu: number; memory: number; network: number; threats: number };
const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Cyber Lab', href: '#lab' },
  { label: 'Projects', href: '#projects' },
  { label: 'Network', href: '#network' },
  { label: 'Intelligence', href: '#intelligence' },
  { label: 'Contact', href: '#contact' },
];
const initialMetrics: Metrics = { cpu: 34, memory: 62, network: 18, threats: 0 };

function useLiveTelemetry() {
  const [clock, setClock] = useState(() => new Date());
  const [uptime, setUptime] = useState(0);
  const [metrics, setMetrics] = useState(initialMetrics);
  useEffect(() => {
    const clockTimer = window.setInterval(() => setClock(new Date()), 1000);
    const uptimeTimer = window.setInterval(() => setUptime((seconds) => seconds + 1), 1000);
    const metricTimer = window.setInterval(() => setMetrics((previous) => ({
      cpu: Math.max(12, Math.min(78, previous.cpu + Math.round(Math.random() * 12 - 6))),
      memory: Math.max(45, Math.min(82, previous.memory + Math.round(Math.random() * 6 - 3))),
      network: Math.max(6, Math.min(65, previous.network + Math.round(Math.random() * 14 - 7))),
      threats: 0,
    })), 2300);
    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(uptimeTimer);
      window.clearInterval(metricTimer);
    };
  }, []);
  const formattedUptime = useMemo(() => {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;
    return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [uptime]);
  return { clock, uptime: formattedUptime, metrics };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour12: false });
}

function MetricBar({ label, value, color = 'green' }: { label: string; value: number; color?: 'green' | 'cyan' }) {
  return <div className={`metric-bar metric-${color}`}><div className="metric-bar-head"><span>{label}</span><strong>{value}%</strong></div><div className="metric-track"><motion.span animate={{ width: `${value}%` }} transition={{ duration: 0.65, ease: 'easeOut' }} /></div></div>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = navigation.map((item) => document.querySelector(item.href)).filter(Boolean) as Element[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: '-18% 0px -65% 0px', threshold: [0, 0.15, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <a className="brand-lockup" href="#home" onClick={closeMenu} aria-label="Cyber Nexus home">
        <span className="brand-symbol"><Hexagon size={24} strokeWidth={1.6} /><span /></span>
        <span className="brand-name">CYBER<span>_NEXUS</span><small>SECURITY REIMAGINED</small></span>
      </a>
      <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        {navigation.map((item) => <a key={item.href} href={item.href} onClick={closeMenu} className={active === item.href.slice(1) ? 'nav-active' : ''}>{item.label}{active === item.href.slice(1) && <span className="nav-indicator" />}</a>)}
        <a href="#contact" onClick={closeMenu} className="nav-mobile-cta">Connect <ArrowUpRight size={14} /></a>
      </nav>
      <a className="header-connect" href="#contact">LET'S CONNECT <ArrowUpRight size={14} /></a>
      <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </header>
  );
}

function HeroTerminal({ clock, metrics }: { clock: Date; metrics: Metrics }) {
  const rows = [
    { label: 'CORE_KERNEL', value: 'NEXUS/04.27.1', tone: 'cyan' },
    { label: 'ENCRYPTION', value: 'AES-256 / ACTIVE', tone: 'green' },
    { label: 'FIREWALL', value: 'SHIELD ONLINE', tone: 'green' },
    { label: 'THREAT_LEVEL', value: 'ZERO / NOMINAL', tone: 'green' },
  ];
  return (
    <motion.div className="hero-terminal" initial={{ opacity: 0, y: 18, rotateX: 4 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.38, duration: 0.75, ease: 'easeOut' }}>
      <div className="hero-terminal-top"><div className="terminal-window-dots"><i /><i /><i /></div><span><Terminal size={12} /> SYS_DIAGNOSTICS.exe</span><span className="topbar-live"><i />LIVE</span></div>
      <div className="hero-terminal-inner">
        <div className="terminal-overline"><span className="prompt-chevron">›</span> INITIALIZING SECURE ENVIRONMENT</div>
        <div className="typing-line"><span className="terminal-cmd">$</span> nexus --diagnostics --verbose<span className="typing-cursor" /></div>
        <div className="terminal-rule" />
        {rows.map((row, index) => <motion.div key={row.label} className="diagnostic-row" initial={{ opacity: 0, x: -7 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + index * 0.14, duration: 0.25 }}><span className="diag-index">0{index + 1}</span><span className="diag-label">{row.label}</span><span className={`diag-value ${row.tone}`}>{row.value}</span><Check size={12} className="diag-check" /></motion.div>)}
        <div className="terminal-rule" />
        <div className="hero-terminal-bottom"><div className="mini-telemetry"><span>CPU <strong>{metrics.cpu}%</strong></span><span>MEM <strong>{metrics.memory}%</strong></span><span>NET <strong>{metrics.network} MB/s</strong></span></div><span className="diagnostic-time">{formatTime(clock)}</span></div>
      </div>
      <div className="terminal-scanline" />
    </motion.div>
  );
}

function LabCard({ icon, code, title, description, tag, action }: { icon: ReactNode; code: string; title: string; description: string; tag: string; action: () => void }) {
  return (
    <motion.article className="lab-card glass-card" whileHover={{ y: -5, borderColor: 'rgba(0,255,102,.42)' }} transition={{ duration: 0.2 }}>
      <div className="card-top-meta"><span>{code}</span><span className="card-live"><i /> AVAILABLE</span></div>
      <div className="lab-icon">{icon}</div>
      <h3>{title}</h3><p>{description}</p>
      <div className="lab-card-bottom"><span className="mini-tag">{tag}</span><button className="icon-action" onClick={action} aria-label={`Open ${title}`}><ArrowUpRight size={16} /></button></div>
      <span className="card-corner" />
    </motion.article>
  );
}

function App() {
  const { clock, uptime, metrics } = useLiveTelemetry();
  const reduceMotion = useReducedMotion();
  const [mouseGlow, setMouseGlow] = useState({ x: 52, y: 28 });

  const handleHeroMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setMouseGlow({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 });
  };

  const openTerminal = () => {
    document.querySelector('#terminal')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    window.setTimeout(() => document.querySelector<HTMLInputElement>('#terminal-command')?.focus(), reduceMotion ? 0 : 500);
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="app-shell">
      <BootScreen />
      <div className="ambient-background" aria-hidden="true"><MatrixRain /><div className="ambient-vignette" /><div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" /></div>
      <Header />
      <main>
        <section id="home" className="hero-section" onMouseMove={handleHeroMove} style={{ '--mouse-x': `${mouseGlow.x}%`, '--mouse-y': `${mouseGlow.y}%` } as CSSProperties}>
          <div className="hero-grid-bg" aria-hidden="true" />
          <div className="hero-inner page-wrap">
            <div className="hero-copy">
              <motion.div className="availability-pill" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><span className="live-dot" /> SYSTEM ONLINE <span className="pill-divider" /> <span className="pill-code">NXS-0427</span></motion.div>
              <motion.div className="hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>BEYOND THE FIREWALL <span>//</span> EST. 20XX</motion.div>
              <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.65 }}><span>ENTER THE</span><br /><span className="headline-outline">CYBER</span><span className="headline-accent"> WORLD<span className="headline-dot">.</span></span></motion.h1>
              <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>Explore the digital frontier.<br /><span>Think beyond the system.</span></motion.p>
              <motion.div className="hero-actions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
                <a href="#lab" className="button button-primary"><Zap size={15} /> INITIALIZE SYSTEM <ArrowUpRight size={15} /></a>
                <a href="#network" className="button button-ghost">EXPLORE NETWORK <ArrowDownRight size={15} /></a>
              </motion.div>
              <motion.div className="hero-footnote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}><span className="footnote-shape">⌁</span><span>A SAFE SPACE FOR UNSAFE THINKING.<br /><small>100% SIMULATED · 0% REAL-WORLD RISK</small></span></motion.div>
            </div>
            <div className="hero-visual"><div className="hero-visual-glow" /><div className="orbit orbit-outer"><span className="orbit-point point-a" /><span className="orbit-point point-b" /></div><div className="orbit orbit-inner"><span className="orbit-point point-c" /></div><div className="core-emblem"><div className="core-emblem-inner"><Hexagon size={112} strokeWidth={0.7} /><span className="core-glyph">N<span>/</span>X</span></div></div><div className="hero-visual-label label-top"><span>FIG 01.0</span><span>FIG. 01 / THE CORE</span></div><div className="hero-visual-label label-bottom"><span>LATENCY <b>04ms</b></span><span>ENCRYPTED NODE <i /></span></div><div className="crosshair crosshair-one" /><div className="crosshair crosshair-two" /></div>
            <HeroTerminal clock={clock} metrics={metrics} />
          </div>
          <div className="hero-bottom-strip"><div className="strip-marquee"><span>ETHICAL BY DESIGN <i>✳</i> SIMULATED INTELLIGENCE <i>✳</i> SECURE BY DEFAULT <i>✳</i> THINK DIFFERENTLY <i>✳</i> </span><span aria-hidden="true">ETHICAL BY DESIGN <i>✳</i> SIMULATED INTELLIGENCE <i>✳</i> SECURE BY DEFAULT <i>✳</i> THINK DIFFERENTLY <i>✳</i></span></div></div>
          <a href="#about" className="scroll-cue"><span>SCROLL TO EXPLORE</span><ChevronDown size={14} /></a>
        </section>

        <section id="about" className="section about-section page-wrap">
          <div className="about-lead"><SectionHeading eyebrow="THE NEXUS DIRECTIVE" index="01" title="Built for the" accent="curious." description="The digital world isn't a black box. It's a system of choices, patterns, and possibilities. We make the complex visible — so you can build what's next." />
            <a href="#lab" className="text-link">DISCOVER THE LAB <ArrowRight size={15} /></a>
          </div>
          <div className="about-aside"><div className="about-graphic"><div className="graphic-orbit g-orbit-1" /><div className="graphic-orbit g-orbit-2" /><div className="graphic-orbit g-orbit-3" /><div className="graphic-center"><Fingerprint size={38} strokeWidth={1.1} /></div><span className="graphic-point gp-1" /><span className="graphic-point gp-2" /><span className="graphic-point gp-3" /><span className="graphic-label gl-1">IDENTITY / VERIFIED</span><span className="graphic-label gl-2">TRUST IS A PROTOCOL</span></div><div className="about-stats"><div><strong>01<span>/</span></strong><span>MISSION</span><p>Make security intuitive.</p></div><div><strong>∞</strong><span>MINDSET</span><p>Stay relentlessly curious.</p></div><div><strong>0</strong><span>COMPROMISE</span><p>Privacy first. Always.</p></div></div></div>
          <div className="about-principles"><div className="principle"><div className="principle-icon"><ShieldCheck size={19} /></div><div><h3>Security without the noise</h3><p>Understand the signal. Cut through complexity with clear, practical visual tools.</p></div><span className="principle-index">A1</span></div><div className="principle"><div className="principle-icon cyan-icon"><Blocks size={19} /></div><div><h3>Built to be explored</h3><p>Interact, experiment, make mistakes safely, and understand why systems behave as they do.</p></div><span className="principle-index">A2</span></div><div className="principle"><div className="principle-icon"><LockKeyhole size={19} /></div><div><h3>Ethics at the core</h3><p>Every demonstration is isolated, fictional, and designed for responsible learning.</p></div><span className="principle-index">A3</span></div></div>
        </section>

        <section id="lab" className="section lab-section section-surface">
          <div className="page-wrap"><SectionHeading eyebrow="INTERACTIVE ENVIRONMENTS" index="02" title="Enter the" accent="cyber lab." description="A playground for digital curiosity. Run safe simulations, inspect system signals, and learn by doing — no real targets, no live scans." />
            <div className="lab-cards-grid"><LabCard code="LAB / 001" icon={<ScanLine size={24} />} title="Threat Simulator" description="Walk through a mock event stream and learn how common indicators are identified and triaged." tag="BLUE TEAM" action={openTerminal} /><LabCard code="LAB / 002" icon={<Binary size={24} />} title="Signal Decoder" description="Explore encoded sample strings and see how data representations change across formats." tag="FUNDAMENTALS" action={() => document.querySelector('#terminal')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} /><LabCard code="LAB / 003" icon={<ShieldEllipsis size={24} />} title="Policy Sandbox" description="Inspect fictional access policies and understand the principles of least privilege and defense in depth." tag="SECURE DESIGN" action={() => document.querySelector('#network')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} /></div>
            <div className="lab-terminal-layout"><div className="terminal-intro"><div className="terminal-intro-index">N° 01 / INTERACTIVE SHELL</div><h3>Don't just watch.<br /><span>Run the simulation.</span></h3><p>A command-line interface that behaves like a real terminal without executing real system commands. Try a command, inspect the output, learn the pattern.</p><div className="terminal-capabilities"><span><Check size={13} /> Command history</span><span><Check size={13} /> Safe fake scan</span><span><Check size={13} /> No network access</span></div><button className="text-link terminal-reset-link" onClick={openTerminal}>FOCUS TERMINAL <ArrowRight size={14} /></button></div><div id="terminal" className="terminal-mount"><TerminalPanel /></div></div>
          </div>
        </section>

        <section id="projects" className="section projects-section page-wrap"><SectionHeading eyebrow="FIELD NOTES / SELECTED WORK" index="03" title="Tools for a" accent="new frontier." description="Concept builds exploring how interfaces can make invisible systems feel tangible, understandable, and a little more human." />
          <div className="projects-grid">
            <motion.article className="project-card project-featured" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}><div className="project-visual visual-orbit"><div className="project-hud hud-left">NEXUS / 001<br /><span>LIVE FEED: MOCK</span></div><div className="project-orbital"><span /><span /><span /><div><Globe2 size={36} /></div></div><div className="project-scan-bar" /><span className="project-coordinates">40° 43' 55.3" N<br />73° 59' 11.2" W</span></div><div className="project-content"><div className="project-meta"><span>01 — VISUAL INTELLIGENCE</span><span className="project-year">2026</span></div><h3>Sentinel / Atlas</h3><p>A visual language for complex telemetry. Turn streams of abstract signals into an understandable, navigable world.</p><div className="project-tags"><span>DATA VIZ</span><span>INTERACTION</span><span>RESEARCH</span></div><a className="project-link" href="#intelligence">EXPLORE CONCEPT <ArrowUpRight size={15} /></a></div></motion.article>
            <motion.article className="project-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}><div className="project-visual visual-code"><div className="code-window"><div className="code-window-bar"><i /><i /><i /><span>policy.rules</span></div><div className="code-lines"><span><b>01</b> <em>policy</em> <strong>{'{'}</strong></span><span><b>02</b> &nbsp; access: <i>'least-privilege'</i></span><span><b>03</b> &nbsp; audit: <u>true</u></span><span><b>04</b> &nbsp; trust: <i>'verify'</i></span><span><b>05</b> <strong>{'}'}</strong></span><span><b>06</b> <s>// defense in depth</s></span></div><div className="code-stamp"><ShieldCheck size={17} /> POLICY VALIDATED</div></div></div><div className="project-content"><div className="project-meta"><span>02 — SECURE BY DESIGN</span><span className="project-year">2026</span></div><h3>Trust / Protocol</h3><p>An approachable toolkit for explaining identity, access boundaries, and safer defaults without the jargon.</p><div className="project-tags"><span>DESIGN SYSTEM</span><span>IAM</span></div><a className="project-link" href="#lab">OPEN LAB <ArrowUpRight size={15} /></a></div></motion.article>
            <motion.article className="project-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}><div className="project-visual visual-radar"><div className="radar-rings"><span /><span /><span /><span /><i className="radar-sweep" /><i className="radar-blip blip-one" /><i className="radar-blip blip-two" /><i className="radar-blip blip-three" /></div><div className="radar-coord">SIGNAL MAP<br /><span>SIMULATION ONLY</span></div></div><div className="project-content"><div className="project-meta"><span>03 — PATTERN RECOGNITION</span><span className="project-year">2026</span></div><h3>Ghost / Signal</h3><p>A fictional activity feed for practicing triage, separating meaningful indicators from background noise.</p><div className="project-tags"><span>TELEMETRY</span><span>BLUE TEAM</span></div><a className="project-link" href="#intelligence">VIEW SIGNALS <ArrowUpRight size={15} /></a></div></motion.article>
          </div><div className="project-bottom-line"><span>MORE EXPERIMENTS IN PROGRESS</span><span className="line-through" /><span>03 / 03</span></div>
        </section>

        <section id="network" className="section network-section section-surface"><div className="page-wrap network-section-inner"><div className="network-copy"><SectionHeading eyebrow="MAPPING THE INVISIBLE" index="04" title="Everything is" accent="connected." description="Explore a fictional system topology. Select a node to inspect its role, status, and boundaries. Every edge and signal is generated locally." /><div className="network-callout"><div className="callout-icon"><Network size={18} /></div><div><strong>THE NEXUS GRID</strong><p>6 simulated nodes <span>·</span> 7 mock links <span>·</span> 0 external connections</p></div></div><div className="network-status-list"><div><span className="status-indicator green-status" /> NODE HEALTH <strong>100%</strong></div><div><span className="status-indicator cyan-status" /> ROUTE INTEGRITY <strong>OPTIMAL</strong></div><div><span className="status-indicator green-status" /> DEMO ISOLATION <strong>ENABLED</strong></div></div></div><div className="network-map-column"><NetworkMap /></div></div></section>

        <section id="intelligence" className="section intelligence-section page-wrap"><SectionHeading eyebrow="SIGNALS / SYSTEM TELEMETRY" index="05" title="Read between" accent="the packets." description="A fictional live-looking dashboard. Values below are generated in the browser for visual demonstration — they are not measurements from a real machine." />
          <div className="intel-dashboard"><div className="intel-main-panel glass-card"><div className="intel-panel-head"><div><span className="panel-kicker">NEXUS CORE / RESOURCE MONITOR</span><h3>System telemetry</h3></div><span className="demo-pill"><span className="live-dot" /> SIMULATED LIVE</span></div><div className="telemetry-metrics"><div className="telemetry-stat"><div className="telemetry-stat-icon"><Cpu size={16} /></div><span>CPU LOAD</span><strong>{metrics.cpu}<small>%</small></strong><MetricBar label="PROCESSING" value={metrics.cpu} /></div><div className="telemetry-stat"><div className="telemetry-stat-icon cyan-stat-icon"><Database size={16} /></div><span>MEMORY</span><strong>{metrics.memory}<small>%</small></strong><MetricBar label="ALLOCATION" value={metrics.memory} color="cyan" /></div><div className="telemetry-stat"><div className="telemetry-stat-icon"><Wifi size={16} /></div><span>NETWORK I/O</span><strong>{metrics.network}<small> MB/s</small></strong><MetricBar label="THROUGHPUT" value={metrics.network * 1.4} color="green" /></div></div><div className="intel-chart"><div className="chart-heading"><span>ACTIVITY TIMELINE</span><span><i className="legend-dot green" /> SIGNAL <i className="legend-dot cyan" /> BASELINE</span></div><div className="chart-area"><div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span><span>00</span></div><svg viewBox="0 0 620 140" preserveAspectRatio="none" role="img" aria-label="Decorative simulated activity timeline chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00ff66" stopOpacity=".22" /><stop offset="100%" stopColor="#00ff66" stopOpacity="0" /></linearGradient></defs>{[0, 1, 2, 3, 4].map((line) => <line key={line} x1="0" x2="620" y1={line * 35} y2={line * 35} stroke="rgba(165,190,177,.11)" strokeDasharray="3 5" />)}<path d="M0,108 C22,105 25,85 49,91 S76,61 96,71 S120,101 140,83 S164,64 184,70 S214,27 235,52 S265,90 280,78 S304,36 328,61 S350,83 370,64 S390,51 408,58 S437,29 456,45 S482,77 504,53 S530,67 547,42 S578,54 594,30 S608,41 620,23 L620,140 L0,140 Z" fill="url(#chartFill)" /><path d="M0,108 C22,105 25,85 49,91 S76,61 96,71 S120,101 140,83 S164,64 184,70 S214,27 235,52 S265,90 280,78 S304,36 328,61 S350,83 370,64 S390,51 408,58 S437,29 456,45 S482,77 504,53 S530,67 547,42 S578,54 594,30 S608,41 620,23" fill="none" stroke="#00ff66" strokeWidth="1.7" vectorEffect="non-scaling-stroke" /><path d="M0,115 C50,108 70,116 120,101 S180,105 230,90 S290,103 340,93 S390,104 450,90 S520,100 570,78 S600,84 620,74" fill="none" stroke="#00e5ff" strokeWidth="1" strokeDasharray="4 4" opacity=".65" vectorEffect="non-scaling-stroke" /></svg><div className="chart-x-labels"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>NOW</span></div></div></div></div>
            <div className="intel-side-column"><div className="intel-uptime glass-card"><div className="side-card-head"><span className="panel-kicker">SESSION UPTIME</span><Activity size={15} /></div><div className="uptime-digits">{uptime}</div><div className="uptime-units"><span>DD</span><span>HH</span><span>MM</span><span>SS</span></div><div className="uptime-foot"><span className="status-indicator green-status" /> RUNNING LOCALLY</div></div><div className="intel-threat glass-card"><div className="side-card-head"><span className="panel-kicker">THREAT INDEX</span><Shield size={15} /></div><div className="threat-value">00<span>/100</span></div><div className="threat-scale"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="threat-foot"><span className="safe-label">NOMINAL</span><span>MOCK DATA</span></div></div></div>
          </div>
          <div className="activity-log glass-card"><div className="log-head"><div><span className="panel-kicker">EVENT STREAM / LOCAL SAMPLE</span><h3>Activity log</h3></div><span className="log-record-count"><i /> 04 RECORDS</span></div><div className="log-table"><div className="log-row log-table-head"><span>TIMESTAMP</span><span>EVENT</span><span>SEVERITY</span><span>STATE</span></div><div className="log-row"><span>{formatTime(new Date(clock.getTime() - 18000))}</span><span><Check size={13} /> Policy engine initialized</span><span><i className="severity-dot sev-low" /> INFO</span><strong className="log-state">RESOLVED</strong></div><div className="log-row"><span>{formatTime(new Date(clock.getTime() - 11000))}</span><span><ShieldCheck size={13} /> Mock firewall rules loaded</span><span><i className="severity-dot sev-low" /> INFO</span><strong className="log-state">RESOLVED</strong></div><div className="log-row"><span>{formatTime(new Date(clock.getTime() - 5000))}</span><span><Radio size={13} /> Telemetry stream connected</span><span><i className="severity-dot sev-medium" /> NOTICE</span><strong className="log-state">MONITORING</strong></div><div className="log-row"><span>{formatTime(clock)}</span><span><Sparkles size={13} /> Sandbox integrity verified</span><span><i className="severity-dot sev-low" /> INFO</span><strong className="log-state">NOMINAL</strong></div></div><div className="log-disclaimer"><span><LockKeyhole size={12} /> All records are fictional demonstration data.</span><span>LOCAL / EPHEMERAL</span></div></div>
        </section>

        <section id="contact" className="section contact-section section-surface"><div className="page-wrap contact-layout"><div className="contact-copy"><SectionHeading eyebrow="OPEN A CHANNEL" index="06" title="Let's build the" accent="next layer." description="Have an idea, an interface problem, or a cybersecurity concept you want to make clearer? Send a message and start a conversation." /><div className="contact-signal"><div className="signal-icon"><Mail size={19} /></div><div><span>SECURE CHANNEL</span><strong>Connection starts here.</strong><p>Replies and delivery depend on your configured backend.</p></div></div><div className="contact-direct"><span className="panel-kicker">TRANSMISSION PROTOCOL</span><div><span className="contact-protocol-dot" /> HTTPS / JSON <span className="contact-protocol-note">WHEN CONFIGURED</span></div></div><div className="contact-coordinate">N 41° 18' 00.0" <span>·</span> E 69° 16' 00.0"<small>LOCATION IS DECORATIVE / NO GEOLOCATION USED</small></div></div><div className="contact-form-wrap"><div className="contact-form-header"><div><span className="panel-kicker">ENCRYPTED COMMS / FORM 01</span><h3>Transmit a message<span>.</span></h3></div><span className="form-serial">NX-04-27</span></div><ContactForm /><div className="form-bottom-note"><LockKeyhole size={12} /> Never include passwords, API keys, or sensitive personal data.</div></div></div></section>
      </main>
      <footer className="site-footer"><div className="page-wrap"><div className="footer-main"><a className="brand-lockup footer-brand" href="#home"><span className="brand-symbol"><Hexagon size={24} strokeWidth={1.6} /><span /></span><span className="brand-name">CYBER<span>_NEXUS</span><small>SECURITY REIMAGINED</small></span></a><p className="footer-manifesto">A little less noise.<br /><span>A little more signal.</span></p><div className="footer-links"><span className="panel-kicker">EXPLORE THE GRID</span><div><a href="#about">About</a><a href="#lab">Cyber Lab</a><a href="#projects">Projects</a><a href="#network">Network</a><a href="#contact">Contact</a></div></div><div className="footer-social"><span className="panel-kicker">OPEN CHANNELS</span><a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a><a href="https://developer.mozilla.org" target="_blank" rel="noreferrer" aria-label="Developer documentation"><Code2 size={16} /></a><a href="mailto:" aria-label="Open email client"><Mail size={16} /></a></div></div><div className="footer-bottom"><div><span>© 2026 CYBER_NEXUS</span><span className="footer-divider">/</span><span>BUILT FOR THE CURIOUS</span></div><div className="footer-status"><span className="live-dot" /> ALL SYSTEMS NOMINAL <span className="footer-divider">/</span><span>DEMO MODE</span></div><a href="#home">BACK TO TOP <ArrowUpRight size={12} /></a></div></div></footer>
      <a className="back-to-top" href="#home" aria-label="Back to top"><ArrowUpRight size={16} /></a>
      <div className="global-statusline"><span><span className="live-dot" /> NEXUS OS <b>0.4.27</b></span><span className="statusline-center">SECURE SIMULATION ENVIRONMENT</span><span>LOCAL TIME <b>{formatTime(clock)}</b></span></div>
    </div>
    </MotionConfig>
  );
}

export default App;
