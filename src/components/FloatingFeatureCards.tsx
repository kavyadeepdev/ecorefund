import React, { useRef } from 'react';

type FeatureCard = {
  icon: string;
  label: string;
  title: string;
  description: string;
  desktopStyle: React.CSSProperties;
  animationClass: string;
  fadeDelay: string;
  parallaxStrength: number;
};

const featureCards: FeatureCard[] = [
  {
    icon: '🤖',
    label: 'AI-Powered',
    title: 'Waste Detection',
    description: 'AI identifies and classifies plastic waste instantly.',
    desktopStyle: { left: '-11rem', top: '-4.5rem', '--card-rotation': '-2deg' } as React.CSSProperties,
    animationClass: 'float-one',
    fadeDelay: '0.1s',
    parallaxStrength: 1,
  },
  {
    icon: '⚡',
    label: 'Instant',
    title: 'Reward Processing',
    description: 'Earn rewards immediately after verification.',
    desktopStyle: { left: '-9.5rem', bottom: '-4.5rem', '--card-rotation': '2deg' } as React.CSSProperties,
    animationClass: 'float-three',
    fadeDelay: '0.22s',
    parallaxStrength: 0.95,
  },
  {
    icon: '♻️',
    label: '95%',
    title: 'Recycling Accuracy',
    description: 'High-precision waste sorting with AI.',
    desktopStyle: { right: '-11rem', top: '-4.5rem', '--card-rotation': '2deg' } as React.CSSProperties,
    animationClass: 'float-two',
    fadeDelay: '0.18s',
    parallaxStrength: 0.85,
  },
  {
    icon: '🌐',
    label: '24/7',
    title: 'Smart Recycling Network',
    description: 'Always connected for continuous recycling.',
    desktopStyle: { right: '-9.5rem', bottom: '-4.5rem', '--card-rotation': '-2deg' } as React.CSSProperties,
    animationClass: 'float-four',
    fadeDelay: '0.28s',
    parallaxStrength: 0.75,
  },
];

export default function FloatingFeatureCards() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty('--pointer-x', `${x}px`);
      wrapperRef.current.style.setProperty('--pointer-y', `${y}px`);
    }
  };

  const handleMouseLeave = () => {
    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty('--pointer-x', '0px');
      wrapperRef.current.style.setProperty('--pointer-y', '0px');
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="floating-cards-overlay relative z-10 pointer-events-none md:absolute md:inset-0"
    >
      <div className="hidden md:block absolute inset-0">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="floating-card-shell absolute w-56 pointer-events-none"
            style={{ ...card.desktopStyle, '--parallax-strength': card.parallaxStrength } as React.CSSProperties}
          >
            <article
              className={`floating-card ${card.animationClass} pointer-events-auto`}
              style={{ '--fade-delay': card.fadeDelay, opacity: 1, backgroundColor: '#ffffff' } as React.CSSProperties}
            >
              <div
                className="floating-card-inner rounded-3xl bg-white p-3.5 border border-slate-200/60 shadow-sm"
                style={{ opacity: 1, backgroundColor: '#ffffff' }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-3xl bg-gradient-to-br from-emerald-200/60 to-brand-500/20 text-slate-900 text-base shadow-soft-glow">
                    {card.icon}
                  </div>
                  <div className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-700 bg-slate-50 border border-slate-200/50">
                    {card.label}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-950 leading-tight mb-2">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-5">{card.description}</p>
              </div>
            </article>
          </div>
        ))}
      </div>

      <div className="relative mt-12 grid grid-cols-2 gap-4 justify-center md:hidden">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="floating-card-shell relative w-[min(86vw,13.5rem)] max-w-[13.5rem] pointer-events-none"
            style={{ '--parallax-strength': card.parallaxStrength } as React.CSSProperties}
          >
            <article
              className={`floating-card ${card.animationClass} pointer-events-auto`}
              style={{ '--fade-delay': card.fadeDelay, opacity: 1, backgroundColor: '#ffffff' } as React.CSSProperties}
            >
              <div
                className="floating-card-inner rounded-3xl bg-white p-3.5 border border-slate-200/60 shadow-sm"
                style={{ opacity: 1, backgroundColor: '#ffffff' }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-3xl bg-gradient-to-br from-emerald-200/60 to-brand-500/20 text-slate-900 text-base shadow-soft-glow">
                    {card.icon}
                  </div>
                  <div className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-700 bg-slate-50 border border-slate-200/50">
                    {card.label}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-950 leading-tight mb-2">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-5">{card.description}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
