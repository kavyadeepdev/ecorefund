import React, { useState } from 'react';
import {
  Recycle, Smartphone, Coins,
  ArrowRight, ShieldCheck, Truck, Factory, Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DigitalTwin from './components/DigitalTwin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Section from './components/Section';
import MetricCard from './components/MetricCard';
import ThreeDGlobe from './components/ThreeDGlobe';

export default function App() {
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);
  const [activeTab, setActiveTab] = useState<'epr' | 'material' | 'carbon'>('epr');

  const revenueStreams = [
    {
      id: 'epr' as const,
      title: 'EPR Subsidies',
      value: '60%',
      label: 'Funded by FMCG brands for legal compliance',
      icon: Coins,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      explanation: 'Indian law mandates brands to pull back a percentage of the plastic they put into the market. Brands will pay the DRS platform a premium to acquire verifiable "EPR Credits" because DRS provides clean, traceable source material unlike the mixed landfill dumps.'
    },
    {
      id: 'material' as const,
      title: 'Material Sales',
      value: '30%',
      label: 'Revenue from selling clean scrap to recyclers',
      icon: Truck,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      explanation: 'Because the waste is 100% source-segregated, it doesn\'t need expensive multi-stage manual sorting to remove food contamination. Clean PET/Paper commands a 30-50% price premium from industrial recyclers compared to municipal solid waste.'
    },
    {
      id: 'carbon' as const,
      title: 'Gov & Carbon Credits',
      value: '10%',
      label: 'Swachh Bharat grants & voluntary carbon markets',
      icon: Recycle,
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      borderColor: 'border-cyan-200',
      explanation: 'Government grants from the Swachh Bharat Mission and municipal contracts cover local infrastructure setups. Voluntary carbon markets provide additional revenue streams by issuing high-quality offsets for verified methane avoidance and plastic recovery.'
    }
  ];

  return (
    <AnimatePresence mode="wait">
      {showDigitalTwin ? (
        <motion.div
          key="digital-twin"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <DigitalTwin onClose={() => setShowDigitalTwin(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="landing-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          id="top"
          className="min-h-screen font-sans selection:bg-brand-200 selection:text-brand-900 bg-grid-pattern relative overflow-clip"
        >
          {/* Background Ambient Glows */}
          <div className="glow-orb glow-orb-green w-[500px] h-[500px] -top-60 -left-60 pointer-events-none" />
          <div className="glow-orb glow-orb-cyan w-[600px] h-[600px] top-[1200px] -right-80 pointer-events-none" />
          <div className="glow-orb glow-orb-green w-[500px] h-[500px] bottom-10 -left-60 pointer-events-none" />

          {/* Navigation */}
          <Navbar onLaunchDigitalTwin={() => setShowDigitalTwin(true)} />

          <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-32 relative z-10">
            {/* Hero Section */}
            <section id="vision" className="relative pb-16 md:pb-24 overflow-visible">
              <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                {/* Left Side: Hero Text */}
                <div className="lg:col-span-6 space-y-8 text-center lg:text-left mx-auto lg:mx-0 relative z-10 max-w-xl lg:pr-12">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold uppercase tracking-wider"
                    >
                      <Leaf className="w-4 h-4 text-brand-600" />
                      Project Pilot
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-slate-900 leading-[1.1] tracking-tight hero-heading"
                    >
                      A Tech-Enabled <span className="text-brand-600 bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">Deposit Refund Scheme</span> for India
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-slate-600 leading-relaxed font-medium"
                    >
                      A tech-enabled deposit refund scheme designed to incentivize proper waste disposal. Rewarding citizens with instant UPI payouts for 100% source-segregated waste.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center lg:justify-start"
                  >
                    <a href="#mechanism" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all hover:gap-3 shadow-md hover:shadow-brand-500/20">
                      Explore Mechanism <ArrowRight className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => setShowDigitalTwin(true)}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                    >
                      Launch Digital Twin <Smartphone className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </button>
                  </motion.div>
                </div>

                {/* Right Side: Interactive 3D Globe */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="hidden lg:flex lg:col-span-6 justify-center items-center relative lg:pl-12"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/5 to-cyan-500/5 rounded-full blur-2xl -z-10" />
                  <ThreeDGlobe />
                </motion.div>
              </div>
            </section>

            {/* The Mechanism */}
            <Section id="mechanism" title="The Mechanism" icon={Recycle}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="text-6xl font-display font-bold text-slate-100 absolute top-2 right-4 transition-transform group-hover:scale-110">01</div>
                  <ShieldCheck className="w-10 h-10 text-brand-500 mb-6 relative z-10" />
                  <h3 className="text-xl font-bold mb-3 relative z-10">Source Segregation</h3>
                  <p className="text-slate-600 leading-relaxed relative z-10">
                    Citizens now segregate waste at home by brand and material (Plastic, Paper, Glass, Compostable), with brand-specific segregation right at the source. Unsegregated waste is outright rejected by the system.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="text-6xl font-display font-bold text-slate-100 absolute top-2 right-4 transition-transform group-hover:scale-110">02</div>
                  <Factory className="w-10 h-10 text-brand-500 mb-6 relative z-10" />
                  <h3 className="text-xl font-bold mb-3 relative z-10">RVM & Depot Drop-off</h3>
                  <p className="text-slate-600 leading-relaxed relative z-10">
                    Users deposit bottles and cans at automated RVMs, or bulk waste at local AI-weighing depots. Segregated materials are routed to brands for EPR compliance, while the rest are recycled.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="text-6xl font-display font-bold text-slate-100 absolute top-2 right-4 transition-transform group-hover:scale-110">03</div>
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
              <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-slate-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-500/5 blur-[80px] pointer-events-none" />
                <div className="grid md:grid-cols-2 gap-12 relative z-10">
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
              <div className="grid md:grid-cols-12 gap-8 items-stretch">
                {/* Left Side: Interactive Tabs */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  {revenueStreams.map((stream) => {
                    const Icon = stream.icon;
                    const isActive = activeTab === stream.id;
                    return (
                      <button
                        key={stream.id}
                        onClick={() => setActiveTab(stream.id)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${isActive
                          ? 'bg-white border-brand-500 shadow-md shadow-brand-500/5 translate-x-2'
                          : 'bg-white/50 border-slate-200 hover:border-slate-300 hover:bg-white'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600'
                            }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm md:text-base">{stream.title}</h4>
                            <p className="text-slate-500 text-xs mt-0.5">{stream.label}</p>
                          </div>
                        </div>
                        <div className={`text-2xl font-display font-extrabold ml-4 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                          }`}>
                          {stream.value}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Tab Details Panel */}
                <div className="md:col-span-7">
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm h-full flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-slate-50/50 -z-10 blur-3xl pointer-events-none" />

                    <div className="space-y-6">
                      {revenueStreams.map((stream) => {
                        if (stream.id !== activeTab) return null;
                        const Icon = stream.icon;
                        return (
                          <motion.div
                            key={stream.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stream.bgColor} ${stream.textColor} border ${stream.borderColor}`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <span className={`text-xs font-bold uppercase tracking-widest ${stream.textColor}`}>
                                  Revenue Stream
                                </span>
                                <h3 className="text-2xl font-display font-bold text-slate-900 mt-0.5">
                                  {stream.title}
                                </h3>
                              </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                              <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-4xl font-display font-extrabold text-slate-900">{stream.value}</span>
                                <span className="text-sm font-semibold text-slate-500">financial contribution</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed text-base font-medium">
                                {stream.explanation}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Challenges & Solutions */}
            <Section id="challenges" title="Strategic Solutions" icon={ShieldCheck}>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-brand-50 border border-brand-100 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-brand-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    Include Informal Workers
                  </h3>
                  <p className="text-brand-800 mb-4 leading-relaxed">
                    Transition scrap dealers ("kabadiwalas") into certified micro-depot operators equipped with our digital scales, giving them a formal commission rather than displacing them.
                  </p>
                  <p className="text-sm text-brand-700 italic">
                    Addresses: Millions of informal ragpickers and waste workers who depend on mixed waste for livelihood
                  </p>
                </div>

                <div className="bg-brand-50 border border-brand-100 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-brand-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    Fraud Prevention Systems
                  </h3>
                  <p className="text-brand-800 mb-4 leading-relaxed">
                    Use moisture sensors in scales and basic ML vision to detect obvious contamination. Flag accounts that consistently deposit heavy but low-volume materials to prevent gaming the system.
                  </p>
                  <p className="text-sm text-brand-700 italic">
                    Addresses: Risk of adding water/stones to waste to artificially inflate weight and extract higher payouts
                  </p>
                </div>

                <div className="bg-brand-50 border border-brand-100 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-brand-900 mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    Secure Strategic Placement
                  </h3>
                  <p className="text-brand-800 mb-4 leading-relaxed">
                    Deploy RVMs inside secure perimeters like Metro stations, gated societies, malls, and partnered Kirana (grocery) stores rather than open streets for protection and accessibility.
                  </p>
                  <p className="text-sm text-brand-700 italic">
                    Addresses: Hardware vandalism and theft risk in public spaces across India
                  </p>
                </div>
              </div>
            </Section>
          </main>

          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
