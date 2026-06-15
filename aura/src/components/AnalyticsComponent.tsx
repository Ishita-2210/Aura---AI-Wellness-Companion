import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Activity, Star, Calendar, Clock, Trophy, Heart, ShieldAlert, Sparkles, Target } from "lucide-react";
import { MoodEntry, Habit, JournalEntry, Goal } from "../types";

interface AnalyticsComponentProps {
  moods: MoodEntry[];
  habits: Habit[];
  journals: JournalEntry[];
  goals: Goal[];
}

export default function AnalyticsComponent({ moods, habits, journals, goals }: AnalyticsComponentProps) {
  
  // 1. Productivity Score: habits done + tasks done + focus minutes logged
  const metrics = useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const goalRatio = totalGoals > 0 ? completedGoals / totalGoals : 0;

    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.history.includes(new Date().toISOString().split("T")[0])).length;
    const habitRatio = totalHabits > 0 ? completedHabits / totalHabits : 0;

    const aggregateJournalsCount = journals.length;

    // Alignment Score formula (scale 0-100)
    let score = Math.round((goalRatio * 40) + (habitRatio * 45) + (Math.min(aggregateJournalsCount, 5) * 3));
    if (goals.length === 0 && habits.length === 0) score = 65; // fallback neutral baseline
    return {
      alignmentScore: Math.max(10, Math.min(100, score)),
      comGoals: completedGoals,
      totGoals: totalGoals,
      comHabits: completedHabits,
      totHabits: totalHabits,
      journalsCount: aggregateJournalsCount
    };
  }, [goals, habits, journals]);

  // Translate mood data points into beautiful SVG coordinates
  // Map rating (1 to 5) to coordinates on 100x300 container
  const chartPath = useMemo(() => {
    if (moods.length < 2) return "";
    
    // Sort latest 7 chronologically
    const sortedMoods = [...moods]
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);

    if (sortedMoods.length < 2) return "";

    const width = 500;
    const height = 150;
    const padding = 25;

    const points = sortedMoods.map((m, idx) => {
      const x = padding + (idx * (width - 2 * padding)) / (sortedMoods.length - 1);
      // invert y (rating 5 is high, y coordinate 0 is top)
      const y = padding + ((5 - m.rating) * (height - 2 * padding)) / 4;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  }, [moods]);

  // Compute average rating symbol
  const avgMoodRating = useMemo(() => {
    if (moods.length === 0) return 3.5;
    const sum = moods.reduce((a, b) => a + b.rating, 0);
    return (sum / moods.length).toFixed(1);
  }, [moods]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      
      {/* Productivity Alignment Score Card (Left 5/12) */}
      <div className="lg:col-span-5 glass-panel rounded-3xl p-7 relative hover-glow transition-all duration-500 overflow-hidden flex flex-col justify-between">
        
        {/* Subtle top glare reflection */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div>
          <div className="flex items-center space-x-3.5 mb-6 border-b border-white/10 dark:border-white/5 pb-4.">
            <Trophy className="w-4 h-4 text-[#BFA9FF] animate-pulse" />
            <h4 className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest font-mono">Productivity alignment Score</h4>
          </div>

          <div className="text-center py-7 relative flex flex-col items-center justify-center">
            {/* Concentric rotating accent layers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-45">
              <div className="w-36 h-36 rounded-full border-2 border-dotted border-[#BFA9FF]/20 animate-spin-slow" />
              <div className="w-28 h-28 rounded-full border border-dashed border-[#FFD6E7]/15 absolute animate-reverse-spin" style={{ animationDuration: "12s" }} />
            </div>

            <motion.span 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-7xl font-mono tracking-tighter font-extrabold bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent block"
            >
              {metrics.alignmentScore}
            </motion.span>
            <span className="text-[8px] font-mono text-neutral-400 block mt-2 tracking-widest font-bold">ALIGNED_ENERGY / MAXIMUM UNITS</span>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10 dark:border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-600 dark:text-neutral-300 font-sans flex items-center space-x-2">
              <Target className="w-4 h-4 text-[#BFA9FF]" />
              <span className="font-medium">Sacred Goals Completed</span>
            </span>
            <span className="font-mono text-neutral-500 dark:text-neutral-400 font-bold">{metrics.comGoals} / {metrics.totGoals}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-600 dark:text-neutral-300 font-sans flex items-center space-x-2">
              <Activity className="w-4 h-4 text-pink-400" />
              <span className="font-medium">Disciplines Active Today</span>
            </span>
            <span className="font-mono text-neutral-500 dark:text-neutral-400 font-bold">{metrics.comHabits} / {metrics.totHabits}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-600 dark:text-neutral-300 font-sans flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#CDEBFF]" />
              <span className="font-medium">Chronicles Filed</span>
            </span>
            <span className="font-mono text-neutral-500 dark:text-neutral-400 font-bold">{metrics.journalsCount} scrolls</span>
          </div>
        </div>
      </div>

      {/* Interactive mood trends panel charts (Right 7/12) */}
      <div className="lg:col-span-7 flex flex-col gap-6.5">
        
        {/* Mood Trend High Fidelity Card */}
        <div className="glass-panel rounded-3xl p-6 hover-glow transition-all duration-500 flex-grow relative overflow-hidden flex flex-col justify-between">
          
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div>
            <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4.">
              <div className="flex items-center space-x-2.5">
                <Heart className="w-4 h-4 text-pink-400 fill-current/10" />
                <h4 className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest font-mono">In-depth Mood Currents</h4>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-serif italic text-neutral-400">Average state: </span>
                <span className="text-[10px] font-bold font-mono text-[#BFA9FF] bg-[#BFA9FF]/10 px-2.5 py-1 rounded-lg border border-[#BFA9FF]/15">
                  {avgMoodRating} / 5
                </span>
              </div>
            </div>

            {/* Render Vector Chart */}
            {moods.length >= 2 ? (
              <div className="w-full overflow-hidden pt-4 select-none">
                <svg viewBox="0 0 500 150" className="w-full h-36">
                  <defs>
                    <linearGradient id="chart_grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#BFA9FF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#FFD6E7" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid guidelines */}
                  {[...Array(5)].map((_, idx) => {
                    const y = 25 + (idx * 100) / 4;
                    return (
                      <line
                        key={idx}
                        x1="15"
                        y1={y}
                        x2="485"
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-neutral-200/10 dark:text-neutral-800/15"
                        strokeDasharray="5 5"
                      />
                    );
                  })}

                  {/* SVG Line representation */}
                  <path
                    d={chartPath}
                    fill="transparent"
                    stroke="#BFA9FF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-lg transition-all duration-300"
                  />

                  {/* Subtle fill gradient under path */}
                  {(() => {
                    const points = chartPath.substring(2).split(" L ");
                    if (points.length < 2) return null;
                    const firstX = points[0].split(",")[0];
                    const lastX = points[points.length - 1].split(",")[0];
                    const fillD = `${chartPath} L ${lastX},150 L ${firstX},150 Z`;
                    return (
                      <path
                        d={fillD}
                        fill="url(#chart_grad)"
                        className="pointer-events-none"
                      />
                    );
                  })()}

                  {/* Individual anchor dots */}
                  {(() => {
                    const points = chartPath.substring(2).split(" L ");
                    return points.map((p, idx) => {
                      const xy = p.split(",");
                      if (xy.length < 2) return null;
                      return (
                        <g key={idx} className="cursor-pointer">
                          <circle
                            cx={xy[0]}
                            cy={xy[1]}
                            r="6"
                            fill="#FFD6E7"
                            stroke="#BFA9FF"
                            strokeWidth="2"
                          />
                          <circle
                            cx={xy[0]}
                            cy={xy[1]}
                            r="1.5"
                            fill="#FFFFFF"
                          />
                        </g>
                      );
                    });
                  })()}

                </svg>
                
                <div className="flex justify-between text-[8px] font-mono text-neutral-400 uppercase tracking-widest mt-2 px-1">
                  <span>Chamber History Index (left: Past, right: Present)</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400">
                <ShieldAlert className="w-10 h-10 mx-auto mb-4 text-[#DCCBFF]/60 animate-bounce" />
                <p className="text-xs max-w-xs mx-auto">Not enough historical coordinates. Please record at least 2 distinct daily mood check-ins to map vector alignment charts.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
