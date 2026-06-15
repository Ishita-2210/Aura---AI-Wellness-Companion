import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Quote, Compass, Sliders, Play, RefreshCw, Feather, CheckCircle2 } from "lucide-react";

const QUOTES = [
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "Focus" },
  { text: "Your calm mind is the ultimate weapon against your challenges. So relax.", author: "Bryant McGill", category: "Peace" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "Consistent" },
  { text: "Do not fear slow progression; fear only standing completely still.", author: "Zen Wisdom", category: "Courage" },
  { text: "Be like water making its way through cracks. Do not be assertive, but adjust to the object.", author: "Bruce Lee", category: "Flow" },
  { text: "The presentation of the present is the rarest luxury. Open it with absolute attention.", author: "Aura Wisdom", category: "Peace" }
];

const SUGGESTIONS = [
  {
    title: "The Water Ripple Awareness",
    detail: "Sip clean water slowly. Feel the exact temperature, the texture of gravity, and the ripple of somatic refreshment sliding down your throat. Realize you are 70% rivers.",
    duration: "1 Min Somatic Ritual",
    emoji: "💧"
  },
  {
    title: "The Silent Spine Realignment",
    detail: "Extend your head high to the absolute ceiling, feeling your vertebrates stack like elegant pebbles. Inhale deep, roll your shoulders back, drop your chin 2 degrees, and smile for a peaceful 10-second anchor.",
    duration: "30 Sec Somatic Ritual",
    emoji: "🧘"
  },
  {
    title: "The Five-Senses Room Audit",
    detail: "Look in 3 different directions. Name 1 distant mechanical sound, 1 nearby organic scent, 1 skin contact pressure, and 1 beautiful visual reflection in your immediate space.",
    duration: "1.5 Min Somatic Ritual",
    emoji: "🍁"
  }
];

export default function InspirationComponent() {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [reflectionInput, setReflectionInput] = useState("");
  const [savedReflections, setSavedReflections] = useState<string[]>([]);

  const handleNextQuote = () => {
    setActiveQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    setSavedReflections([reflectionInput.trim(), ...savedReflections]);
    setReflectionInput("");
  };

  const currentQuote = QUOTES[activeQuoteIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      {/* Visual Quote Card (Left 7/12) */}
      <div className="lg:col-span-8 flex flex-col gap-6.5">
        <div className="rounded-3xl bg-gradient-to-tr from-white/70 to-[#DCCBFF]/20 dark:from-[#120F22]/40 dark:to-[#1C1333]/30 border border-white/20 p-8.5 backdrop-blur-xl shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute inset-0 bg-white/5 opacity-40 pointer-events-none" />
          
          <div className="flex justify-between items-center z-10">
            <span className="text-[10px] font-mono tracking-widest text-[#BFA9FF] border border-[#BFA9FF]/20 bg-white/40 dark:bg-[#1A1633]/20 px-2.5 py-1 rounded-md uppercase">
              Curated Wisdom Series {currentQuote.category}
            </span>
            <button
              id="next-quote-btn"
              onClick={handleNextQuote}
              className="p-2 rounded-xl bg-white/45 dark:bg-[#120F22]/20 hover:bg-white/75 text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-all hover:rotate-90 duration-300"
              title="Next motivation card"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="my-10 z-10 relative">
            <Quote className="w-12 h-12 text-[#FFD6E7]/40 dark:text-[#FFD6E7]/10 absolute -top-8 -left-3" />
            <blockquote className="text-xl md:text-2xl font-serif leading-relaxed italic text-neutral-800 dark:text-white pl-4 border-l-2 border-[#FFD6E7]/55">
              "{currentQuote.text}"
            </blockquote>
            <p className="text-right text-xs font-serif text-neutral-500 italic mt-4">— {currentQuote.author}</p>
          </div>

          <div className="border-t border-neutral-200/10 pt-4 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
            <span>Aura curated database</span>
            <span>Uninterrupted peaceful wisdom</span>
          </div>
        </div>

        {/* Dynamic Reflection Prompt Input block */}
        <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-6.5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center space-x-2.5 mb-4 pb-2 border-b border-neutral-200/10">
            <Feather className="w-4 h-4 text-[#FFD6E7]" />
            <h4 className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Moments of self study</h4>
          </div>

          <form onSubmit={handleSaveReflection} className="space-y-4">
            <p className="text-xs font-serif italic text-neutral-600 dark:text-neutral-350">
              Prompt: "What is one fear you had that dissolved immediately after walking through it?"
            </p>

            <div className="flex items-center space-x-3 bg-white/50 dark:bg-[#120F22]/30 px-4 py-3 rounded-2xl border border-white/10">
              <input
                id="reflection-prompt-input"
                type="text"
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="Write a brief realization note..."
                className="flex-grow bg-transparent outline-none text-xs text-neutral-800 dark:text-white placeholder:text-neutral-400"
              />
              <button
                type="submit"
                id="save-reflection-btn"
                className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-[10px] tracking-wide uppercase cursor-pointer"
              >
                Seal Note
              </button>
            </div>
          </form>

          {savedReflections.length > 0 && (
            <div className="mt-5 space-y-2.5">
              {savedReflections.map((ref, i) => (
                <div key={i} className="p-3.5 bg-white/60 dark:bg-[#1A1633]/30 border border-white/5 rounded-xl text-xs flex items-center justify-between select-text selection:bg-[#BFA9FF]/20">
                  <p className="font-serif italic text-neutral-700 dark:text-neutral-350">"{ref}"</p>
                  <span className="text-[8px] font-mono uppercase text-[#BFA9FF]">Logged</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Somatic suggestion card (Right 5/12) */}
      <div className="lg:col-span-4 rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-6 border-b border-neutral-200/10 pb-4">
            <Compass className="w-4 h-4 text-[#BFA9FF]" />
            <h4 className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Somatic suggestions</h4>
          </div>

          <div className="space-y-5">
            {SUGGESTIONS.map((sug, idx) => (
              <div key={idx} className="flex items-start space-x-3.5 select-none">
                <span className="text-3xl bg-white/60 dark:bg-neutral-900/30 p-2 rounded-xl block border border-white/10 shadow-sm">
                  {sug.emoji}
                </span>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold font-serif text-neutral-800 dark:text-white">{sug.title}</h5>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">{sug.detail}</p>
                  <span className="inline-block text-[8px] font-mono uppercase tracking-widest text-[#BFA9FF] bg-[#BFA9FF]/10 px-2 py-0.5 rounded border border-[#BFA9FF]/15">
                    {sug.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-200/10 text-center">
          <p className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest leading-loose">
            Take a deep breath. Aura provides guidance on alignment. Keep floating.
          </p>
        </div>
      </div>
    </div>
  );
}
