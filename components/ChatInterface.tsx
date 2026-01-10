
import React, { useState, useRef, useEffect } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { getStylingAdvice } from '../services/geminiService';
import { Message } from '../types';

const ChatInterface: React.FC = () => {
  const { items } = useWardrobe();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! 👋 I'm WardrobeWizard — your personal stylist who only plays with the clothes you already own. \n\nWhat's the occasion today? College day? Date night? Interview? Or want a full 7-day plan? Let's make your closet shine! ✨" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const advice = await getStylingAdvice(userMsg, items, messages);
    setMessages(prev => [...prev, { role: 'model', content: advice }]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl h-[600px] flex flex-col border border-white/10 shadow-inner overflow-hidden">
      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-[24px] p-4 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-indigo-900 rounded-tl-none shadow-lg'
            }`}>
              <div className="whitespace-pre-wrap font-medium">
                {msg.content.split('\n').map((line, i) => {
                   if (line.startsWith('**Outfit')) {
                     return <div key={i} className="font-black text-indigo-700 mt-3 mb-1 uppercase tracking-tight">{line.replace(/\*\*/g, '')}</div>
                   }
                   if (line.startsWith('•')) {
                     return <div key={i} className="pl-2 opacity-90">• {line.substring(1)}</div>
                   }
                   return <p key={i} className={i === 0 ? '' : 'mt-2'}>{line}</p>
                })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 rounded-[24px] rounded-tl-none p-4 flex gap-1">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="What's the occasion today?"
          className="flex-1 bg-white/20 text-white placeholder:text-white/40 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-11 h-11 bg-white text-indigo-600 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
        >
          🪄
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
