import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Clock, CheckCircle2, Feather, Star, ArrowRight, Compass, RefreshCw } from "lucide-react";

interface LandingPageProps {
  onEnterApp: (visitorName?: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function LandingPage({ onEnterApp, isDark, toggleTheme }: LandingPageProps) {
  const [visitorName, setVisitorName] = useState("");
  const [activeTab, setActiveTab] = useState<"mood" | "timer" | "affirmation" | "habit">("mood");
  const [previewMood, setPreviewMood] = useState<string | null>(null);
  const [previewTimerSeconds, setPreviewTimerSeconds] = useState(1500); // 25 mins
  const [timerRunning, setTimerRunning] = useState(false);
  const [previewHabitDone, setPreviewHabitDone] = useState(false);

  // Timer interval for the interactive preview
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && previewTimerSeconds > 0) {
      interval = setInterval(() => {
        setPreviewTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (previewTimerSeconds === 0) {
      setTimerRunning(false);
      setPreviewTimerSeconds(1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, previewTimerSeconds]);

  const formatPreviewTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden text-neutral-800 dark:text-neutral-100 selection:bg-[#BFA9FF]/35 select-none transition-colors duration-500">
      
      {/* Immersive Depth Background Blurs (Only for Landing Page Layout) */}
      <div className="absolute top-[12%] left-[-15%] w-[500px] h-[500px] rounded-full bg-[#FFD6E7]/25 dark:bg-[#341121]/15 blur-[140px] pointer-events-none animate-float-slow -z-10" />
      <div className="absolute top-[45%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#DCCBFF]/30 dark:bg-[#1E113C]/20 blur-[160px] pointer-events-none animate-float-slow -z-10" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-[10%] left-[20%] w-[450px] h-[450px] rounded-full bg-[#CDEBFF]/25 dark:bg-[#0E2849]/15 blur-[130px] pointer-events-none animate-float-slow -z-10" style={{ animationDelay: "1.5s" }} />

      {/* Luxury Spatial Navigation Header */}
      <nav id="landing-navbar" className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-white/25 dark:bg-[#07050F]/25 border-b border-white/10 dark:border-white/5 px-6 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#BFA9FF] via-[#FFD6E7] to-[#CDEBFF] p-[1.5px] shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
              <div className="w-full h-full bg-white dark:bg-[#0A0713] rounded-2xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#BFA9FF] fill-current/10" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif tracking-[0.25em] bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent font-medium">
                AURA
              </span>
              <span className="text-[7.5px] font-mono tracking-widest text-[#BFA9FF] uppercase -mt-0.5">
                Spatial Sanctum
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/30 dark:bg-[#120F22]/30 border border-white/15 hover:bg-white/50 dark:hover:bg-white/10 transition-all cursor-pointer text-xs font-mono font-bold tracking-wide text-neutral-600 dark:text-neutral-300 flex items-center space-x-1"
              title="Toggle theme mode"
            >
              {isDark ? <span>🔆 LIGHT</span> : <span>🌙 DARK</span>}
            </button>
            
            <button
              id="nav-launch-sanctuary"
              onClick={() => onEnterApp()}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center space-x-1.5 shadow-xl hover:-translate-y-[1px] border border-white/20"
            >
              <span>Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="pt-36 pb-24 px-6 max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* HERO INTENTION ZONE */}
        <div className="text-center max-w-3xl mb-24 relative flex flex-col items-center">
          
          {/* Subtle Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-4.5 py-1.5 rounded-full bg-[#DCCBFF]/15 dark:bg-[#DCCBFF]/5 border border-[#BFA9FF]/35 text-[10px] text-[#BFA9FF] dark:text-[#DCCBFF] font-mono tracking-wider uppercase mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Aura</span>
          </motion.div>

          {/* Animated Display Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-5xl md:text-8xl font-serif tracking-tight leading-[1.08] mb-8 bg-gradient-to-b from-neutral-900 via-neutral-700 to-neutral-950 dark:from-white dark:via-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent"
          >
            Your luxury digital <br />
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-[#BFA9FF] dark:via-[#FFD6E7] dark:to-[#CDEBFF] pb-2 px-1">
              sanctuary
            </span>{" "}
            for mind.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-sans leading-relaxed tracking-wide mb-12 max-w-xl mx-auto px-4"
          >
            Observe your emotional currents, anchor concentration intervals, and synchronize daily micro-disciplines on glassmorphic spatial canvases.
          </motion.p>

          {/* Luxury Floating Interactive Name Onboarder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-md p-2.5 rounded-2xl bg-white/45 dark:bg-[#120F22]/45 border border-white/20 dark:border-white/5 shadow-2xl backdrop-blur-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <input
              id="visitor-name-input"
              type="text"
              placeholder="Enter your name, seeker..."
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              className="flex-grow px-5 py-3 rounded-xl bg-white/35 dark:bg-neutral-900/35 border border-white/10 dark:border-white/5 outline-none text-center sm:text-left text-neutral-800 dark:text-white placeholder:text-neutral-400 font-sans tracking-wide focus:border-[#BFA9FF]/40 focus:ring-1 focus:ring-[#BFA9FF]/20 transition-all font-medium text-xs uppercase"
              onKeyDown={(e) => {
                if (e.key === "Enter") onEnterApp(visitorName);
              }}
            />
            <button
              id="visitor-join-btn"
              onClick={() => onEnterApp(visitorName)}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#BFA9FF] via-[#FFD6E7] to-[#CDEBFF] hover:opacity-90 font-bold font-mono uppercase tracking-widest text-neutral-950 text-[10px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Initialize Workspace</span>
              <ArrowRight className="w-4 h-4 text-neutral-950" />
            </button>
          </motion.div>
        </div>

        {/* SPATIAL APPLE VISION PRO INTERACTIVE PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="w-full max-w-5xl rounded-3xl bg-white/15 dark:bg-[#120F22]/20 border border-white/25 dark:border-white/5 p-6 md:p-10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.4)] mb-28 relative overflow-hidden animate-float-slow"
        >
          {/* Visual Glare overlays mimicking premium hardware glass */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[1.5px] bg-gradient-to-b from-white/30 to-transparent" />

          {/* Interactive Mock Top Window Controls Bar */}
          <div className="flex flex-col sm:flex-row items-between sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="flex space-x-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500/30 border border-rose-500/20 shadow-md" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500/30 border border-amber-500/20 shadow-md" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/30 border border-emerald-500/20 shadow-md" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#BFA9FF] uppercase ml-1">AURA_SPATIAL_HUD_PREVIEW</span>
            </div>
            
            <div className="flex bg-white/20 dark:bg-[#1A1633]/55 rounded-2xl p-1.5 border border-white/10 w-full sm:w-auto">
              {[
                { id: "mood", label: "Emotional Tides", icon: Heart },
                { id: "timer", label: "Focus Anchor", icon: Clock },
                { id: "affirmation", label: "Mindful AI", icon: Sparkles },
                { id: "habit", label: "Disciplines Link", icon: CheckCircle2 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    id={`preview-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-white/90 dark:bg-[#120F22]/90 text-[#BFA9FF] dark:text-white shadow-xl scale-105"
                        : "text-neutral-550 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Showcase Sandbox Area */}
          <div className="relative min-h-[340px] flex items-center justify-center z-10 transition-all duration-300">
            <AnimatePresence mode="wait">
              {activeTab === "mood" && (
                <motion.div
                  key="preview-mood"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-xl flex flex-col items-center text-center p-7 bg-white/35 dark:bg-[#1A1633]/30 rounded-3xl border border-white/15 shadow-xl"
                >
                  <p className="text-2xl font-serif italic mb-8 text-neutral-800 dark:text-white">"How is your water flowing today?"</p>
                  <div className="grid grid-cols-5 gap-3 sm:gap-4.5 mb-8">
                    {[
                      { emoji: "😢", label: "Anxious", id: "tired" },
                      { emoji: "😕", label: "Daze", id: "unbalanced" },
                      { emoji: "😐", label: "Centered", id: "centered" },
                      { emoji: "🙂", label: "Radiant", id: "radiant" },
                      { emoji: "🤩", label: "Ecstatic", id: "ecstatic" },
                    ].map((mood) => (
                      <button
                        key={mood.id}
                        id={`preview-mood-btn-${mood.id}`}
                        onClick={() => setPreviewMood(mood.label)}
                        className={`p-4.5 rounded-2xl text-3xl transition-all cursor-pointer border ${
                          previewMood === mood.label
                            ? "bg-[#DCCBFF]/45 border-[#BFA9FF]/55 scale-110 shadow-lg text-emerald-300"
                            : "bg-white/45 dark:bg-white/5 border-transparent hover:bg-white/70 dark:hover:bg-white/15"
                        }`}
                      >
                        <div className="transform transition-transform">{mood.emoji}</div>
                        <span className="block text-[8px] font-mono tracking-widest uppercase mt-2 text-neutral-500 dark:text-neutral-400">
                          {mood.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {previewMood ? (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono uppercase tracking-widest text-[#BFA9FF] dark:text-[#DCCBFF] bg-white/70 dark:bg-neutral-900/40 px-5 py-2.5 rounded-xl border border-white/10 shadow"
                    >
                      Logged as <span className="underline text-purple-500 font-bold">{previewMood}</span>. A perfect trace in present awareness.
                    </motion.p>
                  ) : (
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-widest">Select a coordinate above to preview the somatic logger.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "timer" && (
                <motion.div
                  key="preview-timer"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md flex flex-col items-center bg-white/35 dark:bg-[#1A1633]/30 rounded-3xl border border-white/15 p-8 text-center"
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4 font-bold">Deep Focus Anchor</p>
                  
                  <div className="relative flex items-center justify-center w-44 h-44 rounded-full border-4 border-dotted border-[#BFA9FF]/35 dark:border-[#BFA9FF]/10 mb-8">
                    <div className="absolute inset-2.5 rounded-full border-2 border-[#BFA9FF]/40 flex flex-col items-center justify-center bg-white/40 dark:bg-[#120F22]/45 backdrop-blur-md">
                      <span className="text-4xl font-mono text-neutral-800 dark:text-white font-bold tracking-tighter animate-pulse">
                        {formatPreviewTime(previewTimerSeconds)}
                      </span>
                      <span className="text-[9px] font-mono text-[#BFA9FF] uppercase tracking-widest block mt-2 font-bold select-none">Pomodoro</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      id="preview-timer-toggle"
                      onClick={() => setTimerRunning(!timerRunning)}
                      className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white font-semibold text-[10px] font-mono tracking-widest uppercase cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-1 border border-white/10"
                    >
                      <span>{timerRunning ? "Pause Anchor" : "Enter Calm / Start"}</span>
                    </button>
                    <button
                      id="preview-timer-reset"
                      onClick={() => {
                        setTimerRunning(false);
                        setPreviewTimerSeconds(1500);
                      }}
                      className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-white/40 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-all hover:rotate-90 duration-300"
                      title="Reset Timer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "affirmation" && (
                <motion.div
                  key="preview-affirmation"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-xl p-8 bg-gradient-to-tr from-white/60 to-[#FFD6E7]/25 dark:from-[#1A1633]/40 dark:to-[#38204B]/35 rounded-3xl border border-white/20 shadow-xl text-left"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono text-[#BFA9FF] border border-[#BFA9FF]/35 px-3 py-1 rounded-md uppercase tracking-widest bg-white/50 dark:bg-neutral-800/20">
                      MIND_AFFIRM_Aura
                    </span>
                    <Sparkles className="w-5 h-5 text-[#BFA9FF]" />
                  </div>
                  <blockquote className="text-xl md:text-2xl font-serif tracking-wide leading-relaxed italic text-neutral-800 dark:text-white mb-8">
                    "Do not seek to push the water. It flows gracefully on its own. Trust the steady unfolding of your capacity, for clarity resides where effort ceases."
                  </blockquote>
                  <div className="border-t border-white/10 pt-5 flex justify-between items-center text-[10px] text-neutral-500 dark:text-neutral-400 font-mono tracking-wider">
                    <span className="font-serif italic">— Grounded Focus Matrix</span>
                    <span className="flex items-center text-[#FFD6E7]">
                      <Star className="w-3.5 h-3.5 fill-current mr-1 text-pink-400" /> Premium Experience
                    </span>
                  </div>
                </motion.div>
              )}

              {activeTab === "habit" && (
                <motion.div
                  key="preview-habit"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-md bg-white/35 dark:bg-[#1A1633]/30 rounded-3xl border border-white/15 p-8 flex flex-col justify-center"
                >
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#BFA9FF] mb-6 text-center font-bold">Micro-Habit Evolution</p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 bg-white/70 dark:bg-neutral-900/30 border border-white/10 rounded-2xl shadow-sm">
                      <div className="flex items-center space-x-3.5">
                        <span className="text-2xl bg-white/50 dark:bg-neutral-800/30 p-2 rounded-xl block">🌿</span>
                        <div className="text-left">
                          <p className="text-xs font-semibold">Grounded Breathing Interval</p>
                          <p className="text-[9px] text-neutral-400 font-mono uppercase tracking-wide">1 minute daily</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-505/10 text-emerald-500 px-2.5 py-1 rounded-full font-mono font-bold border border-emerald-500/15 uppercase">
                        Active
                      </span>
                    </div>

                    <button
                      id="preview-habit-toggle"
                      onClick={() => setPreviewHabitDone(!previewHabitDone)}
                      className="w-full flex items-center justify-between p-4 bg-white/70 dark:bg-neutral-900/40 border border-white/10 rounded-2xl hover:bg-white/95 dark:hover:bg-neutral-900/65 cursor-pointer transition-all shadow-sm"
                    >
                      <div className="flex items-center space-x-3.5">
                        <span className="text-2xl bg-white/50 dark:bg-neutral-800/30 p-2 rounded-xl block">☕</span>
                        <div className="text-left">
                          <p className="text-xs font-semibold">Tasting Tea with Closed Eyes</p>
                          <p className="text-[9px] text-neutral-400 font-mono uppercase tracking-wide">Morning triggers</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                        previewHabitDone 
                          ? "bg-[#BFA9FF] border-transparent text-neutral-900" 
                          : "border-neutral-300 dark:border-neutral-750"
                      }`}>
                        {previewHabitDone && <CheckCircle2 className="w-4 h-4 text-neutral-950" />}
                      </div>
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono uppercase tracking-widest">
                    {previewHabitDone ? "🎉 Streak updated! 4 days and mounting." : "Click box above to experience a micro-streak update."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* FEATURES HIGHLIGHT PREMIUM BENTO GRID */}
        <div className="mb-28 w-full max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-[9px] font-mono tracking-widest text-[#BFA9FF] uppercase font-bold block mb-3">Core Modular Functions</span>
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight text-neutral-900 dark:text-white mb-4">
              Designed for the contemplative creator.
            </h2>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#BFA9FF] to-transparent mx-auto mt-6" />
          </div>

          {/* Premium asymmetric bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-7">
            {/* Bento Cell 1 - Emotional Tides (3 Columns wide) */}
            <div className="md:col-span-3 p-8 rounded-3xl bg-white/30 dark:bg-[#120F22]/25 border border-white/15 dark:border-white/5 backdrop-blur-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-[#BFA9FF]/25 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-pink-100/80 dark:bg-[#FFD6E7]/30 text-pink-600 dark:text-[#FFD6E7] flex items-center justify-center mb-6">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-xl font-serif text-neutral-800 dark:text-white mb-2">Grounded Mood Analytics</h3>
                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans mb-8">
                  Chronicle daily states and analyze emotional coordinates securely on local ledgers, visually tracking waves of peaceful alignment.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded bg-pink-50 dark:bg-[#FFD6E7]/10 text-xs text-pink-700 dark:text-[#FFD6E7]/80 font-mono uppercase tracking-wide border border-pink-100 dark:border-[#FFD6E7]/10">Tides</span>
                <span className="px-2.5 py-1 rounded bg-pink-50 dark:bg-[#FFD6E7]/10 text-xs text-pink-700 dark:text-[#FFD6E7]/80 font-mono uppercase tracking-wide border border-pink-100 dark:border-[#FFD6E7]/10">Calendar API</span>
              </div>
            </div>

            {/* Bento Cell 2 - AI Affirmations (3 Columns wide - Large focal cell) */}
            <div className="md:col-span-3 p-8 rounded-3xl bg-gradient-to-br from-white/30 to-[#DCCBFF]/20 dark:from-[#120F22]/25 dark:to-[#22173B]/25 border border-white/20 dark:border-white/5 backdrop-blur-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-[#BFA9FF]/20 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-purple-100/80 dark:bg-[#DCCBFF]/30 text-purple-600 dark:text-[#DCCBFF] flex items-center justify-center mb-6">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-neutral-800 dark:text-white mb-2">Google Gemini AI Whispers</h3>
                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans mb-8">
                  Choose a theme for curated reflections, or configure the server to generate affirmations with Gemini.
                </p>
              </div>
              <span className="self-start px-2.5 py-1 rounded bg-purple-50 dark:bg-[#DCCBFF]/15 text-xs text-purple-700 dark:text-[#DCCBFF] font-mono uppercase tracking-wide border border-purple-100 dark:border-[#DCCBFF]/15">
                Powered by Gemini SDK
              </span>
            </div>

            {/* Bento Cell 3 - Focus Timer (2 Columns wide) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/30 dark:bg-[#120F22]/25 border border-white/15 dark:border-white/5 backdrop-blur-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-[#BFA9FF]/25 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-sky-100/80 dark:bg-[#CDEBFF]/30 text-sky-600 dark:text-[#CDEBFF] flex items-center justify-center mb-6">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-neutral-800 dark:text-white mb-2">Focus Anchor Timer</h3>
                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Deep Concentration clock modeled on traditional pranayama breathing cycles to guide focused attention intervals.
                </p>
              </div>
            </div>

            {/* Bento Cell 4 - Daily Disciplines (2 Columns wide) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/30 dark:bg-[#120F22]/25 border border-white/15 dark:border-white/5 backdrop-blur-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-[#BFA9FF]/25 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-indigo-100/80 dark:bg-[#BFA9FF]/30 text-indigo-600 dark:text-[#BFA9FF] flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-neutral-800 dark:text-white mb-2">Micro-Discipline Streaks</h3>
                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Cultivate daily consistency. Maintain steady habit chains to unlock spatial status badges and level meters.
                </p>
              </div>
            </div>

            {/* Bento Cell 5 - Sanctuary Journal (2 Columns wide) */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/30 dark:bg-[#120F22]/25 border border-white/15 dark:border-white/5 backdrop-blur-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-[#BFA9FF]/25 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 flex items-center justify-center mb-6">
                  <Feather className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-neutral-800 dark:text-white mb-2">Private Chronicles</h3>
                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
                  Browser-local journal entries with keyword search and category tags. Entries are not encrypted or synced by the app.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WORKFLOW EXAMPLES */}
        <div className="w-full text-center mb-28">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#BFA9FF] mb-3">EVERYDAY WORKFLOWS</p>
          <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 dark:text-white mb-14">Three ways to use your workspace.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl">
            {[
              {
                text: "Record a mood rating, add a note and revisit the entries stored in this browser.",
                name: "Notice patterns",
                title: "Mood journal"
              },
              {
                text: "Choose a reflection theme. Use curated text offline or a configured server-side Gemini model.",
                name: "Take a reflective pause",
                title: "Affirmations"
              },
              {
                text: "Start a focus session and keep your goals, habits and journal in the same workspace.",
                name: "Plan a focused session",
                title: "Timer and goals"
              }
            ].map((t, i) => (
              <div key={i} className="p-7.5 rounded-2xl bg-white/30 dark:bg-[#120F22]/30 border border-white/15 dark:border-white/5 text-left backdrop-blur-xl">
                <p className="text-xs md:text-[13px] text-neutral-605 dark:text-neutral-350 italic leading-relaxed mb-6 font-serif">{t.text}</p>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-white">{t.name}</h4>
                  <p className="text-[9px] text-[#BFA9FF] uppercase tracking-wider font-mono mt-0.5">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONCLUDING CALL-TO-ACTION CARD */}
        <div className="w-full max-w-5xl rounded-3xl bg-gradient-to-tr from-[#BFA9FF]/15 via-[#FFD6E7]/10 to-[#CDEBFF]/15 border border-white/20 dark:border-white/5 p-12 md:p-20 text-center backdrop-blur-3xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 dark:bg-black/5 opacity-50 block" />
          <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-serif text-neutral-900 dark:text-white tracking-tight mb-5">
              Step into your sanctuary.
            </h2>
            <p className="text-xs md:text-sm text-neutral-550 dark:text-neutral-400 mb-10 max-w-md font-sans">
              Connect with your daily rhythm, archive reflective thoughts, and observe emotional waves. Zero barrier. Infinite clarity.
            </p>
            <div className="w-full max-w-sm flex items-center space-x-2.5 bg-white/55 dark:bg-neutral-900/55 p-1.5 rounded-2xl border border-white/25">
              <input
                id="footer-join-input"
                type="text"
                placeholder="What is your first name?"
                className="flex-grow bg-transparent outline-none px-4 text-xs font-medium dark:text-white"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEnterApp(visitorName);
                }}
              />
              <button
                id="footer-join-btn"
                onClick={() => onEnterApp(visitorName)}
                className="px-5 py-3 rounded-xl bg-neutral-950 text-white hover:bg-neutral-850 dark:bg-white dark:text-neutral-950 font-bold font-mono tracking-widest text-[9px] uppercase cursor-pointer transition-transform active:scale-95 duration-100"
              >
                Access
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200/10 py-12 px-6 text-center max-w-7xl mx-auto relative z-10">
        <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase leading-loose">
          &copy; 2026 Aura Technologies. All spatial chambers protected. Integrated via deep intelligence.
        </p>
      </footer>
    </div>
  );
}
