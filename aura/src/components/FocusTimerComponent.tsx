import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Play, Pause, RotateCcw, Award, Sparkles, Sliders, Volume2, VolumeX, Eye, Minimize2 } from "lucide-react";

interface FocusTimerComponentProps {
  onLogFocusSession: (minutes: number, type: "work" | "meditate" | "breath") => void;
}

const MODES = [
  { id: "pomodoro", label: "Classic Focus", duration: 1500, type: "work", icon: "🌱" },
  { id: "short", label: "Rest Interval", duration: 300, type: "meditate", icon: "🍵" },
  { id: "breath", label: "Pranayama Breath", duration: 600, type: "breath", icon: "🌬️" },
];

export default function FocusTimerComponent({ onLogFocusSession }: FocusTimerComponentProps) {
  const [activeMode, setActiveMode] = useState(MODES[0]);
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientZen, setAmbientZen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Statistics
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);

  // Breath cues for Pranayama option (contracts/expands)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const breathTick = useRef(0);

  // Sync mode changes
  useEffect(() => {
    setSecondsLeft(activeMode.duration);
    setIsRunning(false);
  }, [activeMode]);

  // Main countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
        
        // Pacing breath phase if custom breath work is active (cyclic 4-4-4-4 seconds Box Breathing)
        if (activeMode.id === "breath") {
          breathTick.current = (breathTick.current + 1) % 16;
          if (breathTick.current < 4) setBreathPhase("inhale");
          else if (breathTick.current < 8) setBreathPhase("hold");
          else if (breathTick.current < 12) setBreathPhase("exhale");
          else setBreathPhase("rest");
        }
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const handleSessionComplete = () => {
    const mins = Math.ceil(activeMode.duration / 60);
    onLogFocusSession(mins, activeMode.type as any);
    setCyclesCompleted((prev) => prev + 1);
    setTotalFocusMinutes((prev) => prev + mins);
    
    // Play subtle audio synthetic note if enabled
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 440; // beautiful A4 pitch center
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        oscillator.stop(audioCtx.currentTime + 1.6);
      } catch (err) {
        // Safe play fail
      }
    }
    
    // reset countdown
    setSecondsLeft(activeMode.duration);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressFraction = secondsLeft / activeMode.duration;
  // SVG circular dimensions
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressFraction);

  return (
    <div className="w-full relative">
      
      <AnimatePresence>
        {ambientZen ? (
          /* Ambient Minimal Fullscreen Focus state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FFF8F0] dark:bg-[#090611] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Soft background glow */}
            <div className="absolute w-[45vw] h-[45vw] rounded-full bg-[#BFA9FF]/10 dark:bg-[#BFA9FF]/5 blur-[120px] pointer-events-none" />

            <div className="relative mb-12 flex items-center justify-center">
              {/* Box Breathing visual expander ball */}
              {activeMode.id === "breath" && isRunning ? (
                <motion.div
                  animate={{
                    scale: 
                      breathPhase === "inhale" ? 1.4 :
                      breathPhase === "hold" ? 1.4 :
                      breathPhase === "exhale" ? 0.95 :
                      0.95
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute w-52 h-52 rounded-full bg-[#DCCBFF]/25 dark:bg-[#DCCBFF]/10 blur-xl pointer-events-none"
                />
              ) : (
                <motion.div
                  animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-52 h-52 rounded-full bg-[#FFD6E7]/15 dark:bg-[#FFD6E7]/5 blur-lg pointer-events-none"
                />
              )}

              <div className="z-10 bg-white/30 dark:bg-white/5 border border-white/20 p-10 rounded-full w-56 h-56 flex flex-col items-center justify-center backdrop-blur-md">
                <span className="text-[10px] font-mono tracking-widest text-[#BFA9FF] uppercase mb-1">
                  {activeMode.id === "breath" ? `Breath: ${breathPhase}` : activeMode.label}
                </span>
                <span className="text-5xl font-mono text-neutral-800 dark:text-white font-medium tracking-tight">
                  {formatTime(secondsLeft)}
                </span>
                <span className="text-[10px] font-mono text-neutral-400 mt-2">
                  {isRunning ? "flowing" : "paused"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 z-10">
              <button
                id="zen-play-pause"
                onClick={() => setIsRunning(!isRunning)}
                className="px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 text-white font-medium text-xs tracking-wider cursor-pointer transition-all"
              >
                {isRunning ? "PAUSE ANCHOR" : "RESUME"}
              </button>
              
              <button
                id="zen-exit"
                onClick={() => setAmbientZen(false)}
                className="p-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-all flex items-center space-x-1"
                title="Exit Zen Fullscreen"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="text-[10px] font-mono px-1">Exit Ambient</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Normal Dashboard Layout */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
          >
            {/* Setting Configuration side & statistics (Left 5/12) */}
            <div className="lg:col-span-5 flex flex-col gap-6.5">
              
              {/* Select focus mode trigger cards */}
              <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5.5 backdrop-blur-xl shadow-xl space-y-4">
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Select Focus Flow state</h4>
                <div className="space-y-3">
                  {MODES.map((mode) => (
                    <button
                      key={mode.id}
                      id={`timer-mode-${mode.id}`}
                      onClick={() => {
                        setActiveMode(mode);
                        setIsRunning(false);
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        activeMode.id === mode.id
                          ? "bg-[#DCCBFF]/25 border-[#BFA9FF]/50 scale-[1.01]"
                          : "bg-white/30 dark:bg-white/5 border-neutral-200/10 hover:bg-white/60 dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span className="text-2xl">{mode.icon}</span>
                        <div>
                          <p className="text-xs font-serif font-bold text-neutral-800 dark:text-white">{mode.label}</p>
                          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{mode.type === "work" ? "Peak focus" : "Reflection rest"}</p>
                        </div>
                      </div>
                      <span className="text-sm font-mono text-neutral-600 dark:text-neutral-300 font-semibold">
                        {Math.floor(mode.duration / 60)}:00
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Score card */}
              <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5.5 backdrop-blur-xl shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-4 h-4 text-[#FFD6E7]" />
                  <span className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Focus Achievements Today</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-[#1A1633]/30 border border-white/10 text-center">
                    <span className="text-2xl font-semibold font-mono text-neutral-800 dark:text-white block">{cyclesCompleted}</span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block mt-1">Cycles Completed</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-[#1A1633]/30 border border-white/10 text-center">
                    <span className="text-2xl font-semibold font-mono text-neutral-800 dark:text-white block">{totalFocusMinutes}</span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block mt-1">Focus Minutes</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Main Visual Clock Ring Representation (Right 7/12) */}
            <div className="lg:col-span-7 rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-6.5 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
              
              {/* Toggle controls at top and corner */}
              <div className="absolute top-5 inset-x-5 flex justify-between items-center z-10">
                <div className="flex space-x-1 border border-neutral-200/10 rounded-lg p-0.5 bg-white/20">
                  <button
                    id="sound-opt-toggle"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded hover:bg-neutral-200/30 dark:hover:bg-white/5 cursor-pointer text-neutral-500 transition-all"
                    title={soundEnabled ? "Mute audio focus guides" : "Enable sound focus guides"}
                  >
                    {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#BFA9FF]" /> : <VolumeX className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  id="zen-opt-enter"
                  onClick={() => setAmbientZen(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-200/20 bg-white/30 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-all flex items-center space-x-1"
                  title="Fullscreen Zen mode"
                >
                  <Eye className="w-3.5 h-3.5 text-[#FFD6E7]" />
                  <span>Ambient Zen Mode</span>
                </button>
              </div>

              {/* Progress SVG circular shape */}
              <div className="relative mb-8 mt-6">
                
                {/* Cyclic Breathing bubble under the timer */}
                {activeMode.id === "breath" && isRunning && (
                  <motion.div
                    animate={{
                      scale: 
                        breathPhase === "inhale" ? [1, 1.25] :
                        breathPhase === "hold" ? 1.25 :
                        breathPhase === "exhale" ? [1.25, 0.95] :
                        0.95
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-5 rounded-full bg-[#BFA9FF]/15 blur-xl pointer-events-none"
                  />
                )}

                <svg className="w-56 h-56 transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-neutral-200/25 dark:text-neutral-800/10"
                  />
                  <motion.circle
                    cx="112"
                    cy="112"
                    r={radius}
                    stroke="url(#aura_timer_gradient)"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ ease: "linear", duration: 1 }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="aura_timer_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#BFA9FF" />
                      <stop offset="50%" stopColor="#FFD6E7" />
                      <stop offset="100%" stopColor="#CDEBFF" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Centered Clock reading */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-mono text-neutral-800 dark:text-white font-medium tracking-tight">
                    {formatTime(secondsLeft)}
                  </span>
                  {activeMode.id === "breath" && isRunning ? (
                    <motion.span
                      layoutId="breath-phase-caption"
                      className="text-[8px] font-mono text-[#BFA9FF] uppercase tracking-widest mt-1 block h-3"
                    >
                      {breathPhase}...
                    </motion.span>
                  ) : (
                    <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest mt-1 block">
                      {activeMode.type} status
                    </span>
                  )}
                </div>
              </div>

              {/* Main controls button array */}
              <div className="flex items-center space-x-4">
                <button
                  id="timer-play-pause"
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 text-white font-semibold text-xs tracking-wider cursor-pointer shadow-md hover:scale-[1.02] flex items-center space-x-1.5 transition-all"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Focus</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Begin Focus</span>
                    </>
                  )}
                </button>

                <button
                  id="timer-reset"
                  onClick={() => {
                    setIsRunning(false);
                    setSecondsLeft(activeMode.duration);
                  }}
                  className="p-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-neutral-800 dark:hover:text-white cursor-pointer transition-all hover:scale-105"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
