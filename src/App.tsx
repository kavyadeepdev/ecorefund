import React, { useState } from 'react';
import { 
  Recycle, Smartphone, Coins, AlertTriangle, 
  ArrowRight, ShieldCheck, Factory, Leaf
} from 'lucide-react';
import { motion } from 'motion/react';
import WasteDashboard from './components/WasteDashboard';
import DigitalTwin from './components/DigitalTwin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Section from './components/Section';
import StatCounter from './components/StatCounter';
import PerformanceChart from './components/PerformanceChart';
import InteractiveModel from './components/InteractiveModel';
import BrandEprSummary from './components/BrandEprSummary.tsx';
import type { DepositItem } from './components/digital-twin/types';

export default function App() {
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);
  const [activeEconomyTab, setActiveEconomyTab] = useState<'epr' | 'material' | 'carbon'>('epr');
  const [sharedSessionItems, setSharedSessionItems] = useState<DepositItem[]>([]);

  const economyStreams = {
    epr: {
      title: 'EPR Subsidies',
      percentage: '60%',
      description: 'Funded by FMCG brands for legal compliance and verified material takeback, this is the primary structural incentive for the DRS program.',
      detail: 'EPR revenue ensures brands pay to reclaim packaging waste with traceable, clean materials that support regulatory compliance and reduce landfill leakage.'
    },
    material: {
      title: 'Material Sales',
      percentage: '30%',
      description: 'Revenue from selling cleaned, source-segregated recyclable materials to industrial buyers at a premium relative to mixed municipal scrap.',
      detail: 'Because materials come in sorted and uncontaminated, the platform captures higher resale margins on PET, glass, and paper from approved recycler partners.'
    },
    carbon: {
      title: 'Gov/Carbon Credit',
      percentage: '10%',
      description: 'Grants, carbon offsets, and public sustainability funding that reward verified collection and emissions reduction performance.',
      detail: 'This stream adds mission-aligned funding through Swachh Bharat grants and voluntary carbon markets tied to quantifiable waste diversion and CO₂ savings.'
    }
  };

  const activeStream = economyStreams[activeEconomyTab];

  if (showDigitalTwin) {
    return (
      <DigitalTwin
        onClose={() => setShowDigitalTwin(false)}
        initialSessionItems={sharedSessionItems}
        onSessionItemsChange={setSharedSessionItems}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="min-h-screen font-sans selection:bg-brand-200 selection:text-brand-900 bg-slate-50"
    >
      {/* Navigation */}
      <Navbar onLaunchDigitalTwin={() => setShowDigitalTwin(true)} />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-28">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[40px] border border-white/80 bg-gradient-to-br from-brand-50 via-slate-50 to-slate-100 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.35)]">
          <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_57%)] pointer-events-none" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />
          <div className="absolute left-0 top-24 h-40 w-40 rounded-full bg-slate-950/5 blur-2xl" />
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] p-8 md:p-12 lg:p-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-brand-200 text-brand-700 text-sm font-semibold uppercase tracking-[0.24em] shadow-sm">
                <Leaf className="w-4 h-4" />
                Premium Recycling Platform
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-950 leading-tight tracking-tight">
                  India's waste crisis is urgent. <span className="text-brand-600">Eco Refund solves it with source-segregated rewards.</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl">
                  India generates over 340,000 tonnes of municipal solid waste every day. Eco Refund cuts through the crisis by turning clean plastic and packaging deposits into instant UPI incentives, driving behavior change at the source.
                </p>
              </motion.div>
              <div className="flex flex-wrap gap-4">
                <a href="#mechanism" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all hover:gap-3 shadow-lg shadow-brand-500/10">
                  See the Core Mechanism <ArrowRight className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setShowDigitalTwin(true)}
                  className="bg-slate-950 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10"
                >
                  Launch Digital Twin <Smartphone className="w-5 h-5 text-emerald-400 animate-pulse" />
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[32px] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
                <WasteDashboard />
              </div>
              <div className="rounded-[32px] border border-slate-200 bg-slate-950/95 p-6 shadow-2xl text-white">
                <div className="mb-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">3D Live Preview</p>
                  <h3 className="mt-3 text-2xl font-display font-bold">Interactive eco module</h3>
                </div>
                <div className="grid place-items-center rounded-3xl bg-slate-900/85 p-4">
                  <InteractiveModel />
                </div>
                <p className="mt-5 text-sm leading-relaxed text-slate-400">
                  A premium animated model layered with light, orbiting rings and dynamic motion to reinforce the platform’s modern feel.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCounter label="Monthly Users" value={12880} suffix="+" description="Active households engaging with smart recycling kiosks." />
          <StatCounter label="Tonnes recycled" value={984} description="Verified source-segregated material returned to the circular economy." />
          <StatCounter label="Carbon saved" value={412} suffix="t" description="Estimated CO₂ reductions from cleaner collection streams." />
          <StatCounter label="Instant payouts" value={34200} suffix="+" description="UPI settlements delivered to citizens within seconds of each deposit." />
        </section>

        <Section id="vision" title="Performance Dashboard" icon={Coins}>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="space-y-6">
              <p className="text-slate-600 max-w-2xl leading-relaxed">
                Dynamic metrics and immersive charts make the Eco Refund experience feel premium, while reinforcing measurable impact across recycling, material quality, and citizen adoption.
              </p>
              <PerformanceChart />
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-slate-950/95 p-8 shadow-2xl text-white">
              <div className="mb-6">
                <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Rich model</span>
                <h3 className="mt-3 text-2xl font-display font-bold">Animated 3D module</h3>
              </div>
              <div className="grid place-items-center rounded-3xl bg-slate-900/80 p-6 border border-slate-800">
                <InteractiveModel />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-slate-400">
                The 3D preview reflects the platform’s premium visual depth and supports the rich storytelling of your digital twin ecosystem.
              </p>
            </div>
          </div>
        </Section>

        {/* The Mechanism */}
        <Section id="mechanism" title="The Mechanism" icon={Recycle}>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="text-6xl font-display font-bold text-slate-100 absolute -top-4 -right-4 transition-transform group-hover:scale-110">01</div>
              <ShieldCheck className="w-10 h-10 text-brand-500 mb-6 relative z-10" />
              <h3 className="text-xl font-bold mb-3 relative z-10">Source Segregation</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Citizens now segregate waste at home by brand and material (Plastic, Paper, Glass, Compostable), with brand-specific segregation right at the source. Unsegregated waste is outright rejected by the system.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="text-6xl font-display font-bold text-slate-100 absolute -top-4 -right-4 transition-transform group-hover:scale-110">02</div>
              <Factory className="w-10 h-10 text-brand-500 mb-6 relative z-10" />
              <h3 className="text-xl font-bold mb-3 relative z-10">RVM & Depot Drop-off</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Users deposit waste at automated Reverse Vending Machines (RVMs) for standard items (bottles/cans) or local AI-weighing depots for bulk separated waste. At drop-off and sorting, segregated waste is routed back to the original product manufacturers to support Extended Producer Responsibility (EPR) compliance, while all other collected non-brand-specific materials are sold to recyclers or safely disposed of.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="text-6xl font-display font-bold text-slate-100 absolute -top-4 -right-4 transition-transform group-hover:scale-110">03</div>
              <Smartphone className="w-10 h-10 text-brand-500 mb-6 relative z-10" />
              <h3 className="text-xl font-bold mb-3 relative z-10">Instant UPI Payout</h3>
              <p className="text-slate-600 leading-relaxed relative z-10">
                The machine scans a dynamic user QR code. Real-time valuation based on commodity weight triggers an instant settlement via UPI directly to their bank account.
              </p>
            </div>
          </div>
        </Section>

        {/* Tech Stack */}
        <Section id="tech" title="Proposed Tech Stack" icon={Smartphone}>
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-slate-300">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">Hardware / Edge Layer</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <p><strong className="text-white font-medium">IoT Weighing Scales:</strong> High-precision load cells connected to ESP32/Raspberry Pi microcontrollers pushing data via MQTT.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <p><strong className="text-white font-medium">Computer Vision (optional):</strong> Basic edge model (YOLOv8) inside RVMs to verify material density/shape and prevent fraud (e.g. adding rocks to plastic).</p>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">Platform / Cloud Layer</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <p><strong className="text-white font-medium">Real-time Backend:</strong> Node.js/Go microservices handling ingest. Redis for session state at RVMs.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <p><strong className="text-white font-medium">Dynamic Pricing Engine:</strong> Algorithm adjusting material payout rates daily based on local recycling market demand.</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="space-y-8">
               <div>
                  <h4 className="text-white font-semibold text-lg mb-2">Identity & Payments</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <p><strong className="text-white font-medium">Dynamic QR generation:</strong> Mobile app generates short-lived TOTP-based QR codes linked to the user account.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                      <p><strong className="text-white font-medium">UPI Integration (NPCI):</strong> Integration with payment gateways (Razorpay/Cashfree Route/Payouts) to push micro-transactions instantly upon session end.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Economic Model */}
        <Section id="economy" title="Economic Model" icon={Coins}>
          <div className="space-y-6">
            <p className="text-slate-600 max-w-3xl leading-relaxed">
              Cycle through the three core revenue streams to understand how the Eco Refund model blends brand compliance, material resale margins, and sustainability funding into a balanced economic strategy.
            </p>

            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-white/90 p-2 shadow-sm">
              {(['epr', 'material', 'carbon'] as const).map((tab) => {
                const item = economyStreams[tab];
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveEconomyTab(tab)}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
                      activeEconomyTab === tab
                        ? 'bg-slate-950 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
              <div className="rounded-[32px] border border-slate-200 bg-slate-950/95 p-8 shadow-2xl text-white">
                <span className="text-sm uppercase tracking-[0.24em] text-slate-400">Revenue contribution</span>
                <h3 className="mt-4 text-3xl font-display font-bold text-white">{activeStream.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{activeStream.description}</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="rounded-3xl bg-brand-50 px-6 py-5 text-center shadow-lg">
                    <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Contribution</p>
                    <p className="mt-3 text-4xl font-display font-bold text-brand-600">{activeStream.percentage}</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 px-6 py-5 text-slate-300 border border-white/10">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Model focus</p>
                    <p className="mt-3 text-base leading-relaxed">{activeStream.detail}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                <div className="grid gap-6">
                  <div className="rounded-3xl bg-brand-50 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-brand-700">Why it matters</p>
                    <p className="mt-3 text-slate-700 leading-relaxed">
                      {activeStream.title} drives the platform’s financial resilience and helps fund operational growth while keeping incentives aligned with sustainability goals.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-6 text-white">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Built for scale</p>
                    <p className="mt-3 leading-relaxed text-slate-200">
                      Each stream is designed to reinforce the others: brand-funded subsidies reduce user cost, material resale profits improve economics, and credits support long-term environmental credibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BrandEprSummary sessionItems={sharedSessionItems} />
        </Section>

        {/* Challenges & Mitigation */}
        <Section id="challenges" title="Strategic Solutions" icon={ShieldCheck}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-brand-50 border border-brand-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                Strategic Mitigation
              </h3>
              <ul className="space-y-4">
                <li className="bg-white/80 p-4 rounded-xl border border-brand-100/70 text-brand-900 shadow-sm">
                  <strong>Include Informal Workers:</strong> Transition scrap dealers ("kabadiwalas") into certified micro-depot operators equipped with our digital scales, giving them a formal commission rather than displacing them.
                </li>
                <li className="bg-white/80 p-4 rounded-xl border border-brand-100/70 text-brand-900 shadow-sm">
                  <strong>Ai/Hardware Checks:</strong> Use moisture sensors in scales and basic ML vision to detect obvious contamination. Flag accounts that consistently deposit heavy but low-volume materials.
                </li>
                <li className="bg-white/80 p-4 rounded-xl border border-brand-100/70 text-brand-900 shadow-sm">
                  <strong>Strategic Placement:</strong> Deploy RVMs inside secure perimeters like Metro stations, gated societies, malls, and partnered Kirana (grocery) stores rather than open streets.
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
                Challenges in Context
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                These operational challenges are the reason our solution design prioritizes local partnerships, intelligent fraud detection, and secure machine placement.
              </p>
              <ul className="space-y-4">
                <li className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-rose-800 font-medium">
                  <strong>Unorganized sector risk:</strong> Millions of informal ragpickers rely on mixed waste for livelihood, so the system must preserve local value chains.
                </li>
                <li className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-rose-800 font-medium">
                  <strong>Fraud potential:</strong> Water, stones or contamination can be added to waste, creating the need for AI-enabled validation and smart pricing controls.
                </li>
                <li className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-rose-800 font-medium">
                  <strong>Vandalism threat:</strong> Unattended machines in public spaces are vulnerable, so secure deployment sites and monitoring are essential.
                </li>
              </ul>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </motion.div>
  );
}
