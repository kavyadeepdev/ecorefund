import React, { useState } from 'react';
import { 
  Recycle, Smartphone, Coins, AlertTriangle, 
  ArrowRight, ShieldCheck, Truck, Factory, Leaf
} from 'lucide-react';
import Calculator from './components/Calculator';
import DigitalTwin from './components/DigitalTwin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Section from './components/Section';
import MetricCard from './components/MetricCard';

export default function App() {
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);

  if (showDigitalTwin) {
    return <DigitalTwin onClose={() => setShowDigitalTwin(false)} />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Navigation */}
      <Navbar onLaunchDigitalTwin={() => setShowDigitalTwin(true)} />

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-24 space-y-32">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold uppercase tracking-wide">
              <Leaf className="w-4 h-4" />
              Policy Proposal
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 leading-tight tracking-tight">
              A Tech-Enabled <span className="text-brand-500">Deposit Refund Scheme</span> for India
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-lg">
              A tech-enabled deposit refund scheme designed to incentivize proper waste disposal. Rewarding citizens with instant UPI payouts for 100% source-segregated waste.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#mechanism" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all hover:gap-3">
                Explore Mechanism <ArrowRight className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setShowDigitalTwin(true)} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
              >
                Launch Digital Twin <Smartphone className="w-5 h-5 text-emerald-400 animate-pulse" />
              </button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Calculator />
          </div>
        </section>

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
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <MetricCard title="EPR Subsidies" value="60%" label="Funded by FMCG brands for legal compliance" />
            <MetricCard title="Material Sales" value="30%" label="Revenue from selling clean scrap to recyclers" />
            <MetricCard title="Gov/Carbon Credit" value="10%" label="Swachh Bharat grants & voluntary carbon markets" />
          </div>

          <div className="bg-white border text-slate-700 border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex gap-4">
               <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                 <Coins className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-xl font-bold text-slate-900 mb-2">1. Extended Producer Responsibility (EPR)</h4>
                 <p className="leading-relaxed">Indian law mandates brands to pull back a percentage of the plastic they put into the market. Brands will pay the DRS platform a premium to acquire verifiable "EPR Credits" because DRS provides clean, traceable source material unlike the mixed landfill dumps.</p>
               </div>
            </div>
            
             <hr className="border-slate-100" />
            
            <div className="flex gap-4">
               <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
                 <Truck className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-xl font-bold text-slate-900 mb-2">2. Selling High-Quality Raw Materials</h4>
                 <p className="leading-relaxed">Because the waste is 100% source-segregated, it doesn't need expensive multi-stage manual sorting to remove food contamination. Clean PET/Paper commands a 30-50% price premium from industrial recyclers compared to municipal solid waste.</p>
               </div>
            </div>
          </div>
        </Section>

        {/* Challenges & Solutions */}
        <Section id="challenges" title="Challenges & Mitigation" icon={AlertTriangle}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-rose-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                Key Sector Hurdles
              </h3>
              <ul className="space-y-4">
                <li className="bg-white/60 p-4 rounded-xl border border-rose-100/50 text-rose-800 font-medium">
                  <strong>The Unorganized Sector:</strong> Millions of informal ragpickers rely on mixed waste for livelihood. A formal DRS could displace them.
                </li>
                <li className="bg-white/60 p-4 rounded-xl border border-rose-100/50 text-rose-800 font-medium">
                  <strong>System Gamification (Fraud):</strong> Adding water/stones to paper/plastic to increase weight and extract higher payouts.
                </li>
                <li className="bg-white/60 p-4 rounded-xl border border-rose-100/50 text-rose-800 font-medium">
                  <strong>Hardware Vandalism:</strong> Unattended machines in public spaces in India are prone to damage or theft.
                </li>
              </ul>
            </div>
            
            <div className="bg-brand-50 border border-brand-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6" />
                Strategic Mitigation
              </h3>
              <ul className="space-y-4">
                <li className="bg-white/60 p-4 rounded-xl border border-brand-100/50 text-brand-800">
                  <strong>Include Informal Workers:</strong> Transition scrap dealers ("kabadiwalas") into certified micro-depot operators equipped with our digital scales, giving them a formal commission rather than displacing them.
                </li>
                <li className="bg-white/60 p-4 rounded-xl border border-brand-100/50 text-brand-800">
                  <strong>Ai/Hardware Checks:</strong> Use moisture sensors in scales and basic ML vision to detect obvious contamination. Flag accounts that consistently deposit heavy but low-volume materials.
                </li>
                <li className="bg-white/60 p-4 rounded-xl border border-brand-100/50 text-brand-800">
                  <strong>Strategic Placement:</strong> Deploy RVMs inside secure perimeters like Metro stations, gated societies, malls, and partnered Kirana (grocery) stores rather than open streets.
                </li>
              </ul>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
