
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: '🪄',
    title: 'Meet the Wizard!',
    description: "I'm your personal stylist who ONLY uses the clothes you already own. Let's make sustainable style your superpower!",
    color: 'bg-indigo-500'
  },
  {
    icon: '👕',
    title: 'Digital Closet',
    description: "Snap and organize your pieces. No more 'I have nothing to wear' moments—everything you own is right here.",
    color: 'bg-pink-500'
  },
  {
    icon: '✨',
    title: 'Mix & Match',
    description: "Use the Designer to shuffle combinations you never thought of. Refresh your look without spending a dime!",
    color: 'bg-emerald-500'
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-indigo-900 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-500">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-white' : 'w-2 bg-white/30'
              }`} 
            />
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-[48px] p-8 pt-12 shadow-2xl relative w-full mb-8">
          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 ${steps[currentStep].color} rounded-3xl flex items-center justify-center text-4xl shadow-xl border-4 border-white animate-bounce`}>
            {steps[currentStep].icon}
          </div>
          
          <h2 className="text-2xl font-black text-indigo-900 mb-4 uppercase tracking-tight">
            {steps[currentStep].title}
          </h2>
          
          <p className="text-indigo-900/60 font-medium leading-relaxed mb-8">
            {steps[currentStep].description}
          </p>

          <button 
            onClick={next}
            className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            {currentStep === steps.length - 1 ? "Let's Style! ✨" : "Next Vibe"}
          </button>
        </div>

        <button 
          onClick={onComplete}
          className="text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
