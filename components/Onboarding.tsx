import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: '🪄',
    title: 'Your Style Wizard',
    description: "Welcome to the future of your closet. I'm here to make sure you never say 'I have nothing to wear' again.",
    color: 'bg-gradient-to-br from-[#0D01F5] to-[#1A0B6A]',
    accent: 'text-cyan-400'
  },
  {
    icon: '👑',
    title: 'First things first...',
    description: "I'm your personal stylist, but we haven't been introduced. What's your name?",
    color: 'bg-gradient-to-br from-[#0D01F5] to-[#1A0B6A]',
    isNamingStep: true,
    accent: 'text-yellow-400'
  },
  {
    icon: '👕',
    title: 'Digital Closet',
    description: "Snap and organize your pieces. We only style what you already own. Sustainable, smart, and purely you.",
    color: 'bg-gradient-to-br from-[#0D01F5] to-[#1A0B6A]',
    accent: 'text-emerald-400'
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { userName, setUserName } = useWardrobe();
  const [tempName, setTempName] = useState(userName === 'Fashionista' ? '' : userName);

  const next = () => {
    if (steps[currentStep].isNamingStep && !tempName.trim()) {
      return; 
    }
    
    if (steps[currentStep].isNamingStep) {
      setUserName(tempName.trim());
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#0D01F5] via-[#1A0B6A] to-[#050133] flex flex-col items-center justify-between py-16 px-8 overflow-hidden text-white">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full animate-blob" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-blob animation-delay-2000" />

      {/* Header Info */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
          <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Highlight</span>
        </div>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/20'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex flex-col items-center z-10 text-center">
        <div className="mb-12 animate-in zoom-in fade-in duration-700">
           <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-[32px] border border-white/20 flex items-center justify-center text-5xl shadow-2xl shadow-indigo-500/20">
              {steps[currentStep].icon}
           </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-6 leading-tight tracking-tight uppercase">
          {steps[currentStep].title.split(' ').map((word, i) => (
            <span key={i} className={i === 1 && currentStep === 0 ? steps[currentStep].accent : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>

        <p className="text-white/60 text-lg font-medium leading-relaxed max-w-[280px] mb-12">
          {steps[currentStep].description}
        </p>

        {steps[currentStep].isNamingStep && (
          <div className="w-full mb-12 animate-in slide-in-from-bottom-8 duration-500">
            <input
              autoFocus
              type="text"
              placeholder="YOUR NAME"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/20 pb-4 text-center text-3xl font-black text-white placeholder:text-white/10 outline-none focus:border-cyan-400 transition-all uppercase tracking-tighter"
              onKeyDown={(e) => e.key === 'Enter' && next()}
            />
          </div>
        )}
      </div>

      {/* Footer Button */}
      <div className="w-full max-w-xs z-10 space-y-6">
        <button 
          onClick={next}
          disabled={steps[currentStep].isNamingStep && !tempName.trim()}
          className="w-full py-5 bg-white text-[#0D01F5] font-black text-sm uppercase tracking-[0.15em] rounded-[24px] shadow-[0_15px_30px_rgba(0,0,0,0.3)] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3 group"
        >
          {currentStep === steps.length - 1 ? "ENTER CLOSET" : "CONTINUE"}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>

        <button 
          onClick={onComplete}
          className="w-full text-white/30 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
        >
          SKIP PREFACE
        </button>
      </div>
    </div>
  );
};

export default Onboarding;