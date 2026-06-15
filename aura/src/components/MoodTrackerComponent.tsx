import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Calendar, MessageSquare, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { MoodEntry } from "../types";

interface MoodTrackerComponentProps {
  entries: MoodEntry[];
  onAddEntry: (rating: number, note: string, tags: string[]) => void;
  isDark: boolean;
}

const MOODS = [
  { rating: 1, label: "Tired / Anxious", emoji: "😢", bg: "bg-[#DCCBFF]/20 dark:bg-[#DCCBFF]/10", color: "#DCCBFF", border: "border-[#BFA9FF]/40", text: "text-[#BFA9FF] dark:text-[#DCCBFF]" },
  { rating: 2, label: "Unbalanced", emoji: "😕", bg: "bg-[#CDEBFF]/25 dark:bg-[#254563]/25", color: "#CDEBFF", border: "border-[#CDEBFF]/50", text: "text-sky-400" },
  { rating: 3, label: "Centered", emoji: "😐", bg: "bg-white/30 dark:bg-[#29221F]/30", color: "#FFF8F0", border: "border-neutral-200/40", text: "text-neutral-500" },
  { rating: 4, label: "Radiant", emoji: "🙂", bg: "bg-[#FFD6E7]/25 dark:bg-[#4E2437]/25", color: "#FFD6E7", border: "border-[#FFD6E7]/50", text: "text-pink-400" },
  { rating: 5, label: "Ecstatic / Grounded", emoji: "🤩", bg: "bg-[#BFA9FF]/20 dark:bg-[#311F57]/30", color: "#BFA9FF", border: "border-[#BFA9FF]/60", text: "text-purple-400" }
];

const PRESET_TAGS = ["Productive", "Mindful", "Anxious", "Social", "Rested", "Creative", "Overwhelmed", "Inspired", "Somatic"];

export default function MoodTrackerComponent({ entries, onAddEntry, isDark }: MoodTrackerComponentProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) return;
    onAddEntry(selectedRating, noteText, selectedTags);
    setSelectedRating(null);
    setNoteText("");
    setSelectedTags([]);
  };

  // Get days in current month calendar
  const today = new Date();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, currentMonthIndex + 1, 0).getDate();
  const monthName = new Date(year, currentMonthIndex, 1).toLocaleString("default", { month: "long" });

  const getMoodForDay = (day: number) => {
    const formattedDate = `${year}-${(currentMonthIndex + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    return entries.find((e) => e.date === formattedDate);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      
      {/* 1. New Mood Check-In Form (Left Col - 7/12) */}
      <div className="lg:col-span-7 glass-panel rounded-3xl p-7 relative hover-glow transition-all duration-500 overflow-hidden">
        
        {/* Subtle reflective glare bar */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <div className="flex items-center space-x-4 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#FFD6E7]/30 flex items-center justify-center text-[#E693B6] shadow-sm select-none">
            <Heart className="w-5 h-5 fill-current animate-pulse text-pink-400" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-neutral-800 dark:text-white leading-tight">Daily somatic tides</h3>
            <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mt-0.5">Observe and catalogue your current coordinates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3.5">
            <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block">How is your water flowing today?</label>
            <div className="grid grid-cols-5 gap-3.5">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m.rating}
                  id={`mood-option-${m.rating}`}
                  onClick={() => setSelectedRating(m.rating)}
                  className={`p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer relative group flex flex-col items-center ${
                    selectedRating === m.rating
                      ? `${m.bg} border-purple-400/40 scale-102 shadow-xl`
                      : "bg-white/35 dark:bg-white/3 border-white/10 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/8 hover:scale-[1.03]"
                  }`}
                >
                  <span className="text-4xl block filter drop-shadow-md mb-2 cursor-pointer transition-transform group-hover:scale-110 duration-300">{m.emoji}</span>
                  <span className={`block text-[8px] font-mono tracking-widest uppercase font-bold text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-205`}>
                    {m.label.split(" / ")[0]}
                  </span>
                  
                  {selectedRating === m.rating && (
                    <motion.div 
                      layoutId="selected-indicator-blob" 
                      className="absolute inset-[2px] border border-[#BFA9FF]/35 rounded-[14px] pointer-events-none" 
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedRating && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 pt-2"
              >
                {/* Optional note */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block">Add a quick reflection statement</label>
                  <div className="flex items-center space-x-3.5 bg-white/45 dark:bg-neutral-900/35 rounded-2xl px-5 py-4 border border-white/15 dark:border-white/5 shadow-inner">
                    <MessageSquare className="w-4 h-4 text-neutral-400" />
                    <input
                      id="mood-note-input"
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="e.g., A gentle fog lift, feeling sudden somatic stillness..."
                      className="flex-grow bg-transparent outline-none text-xs text-neutral-800 dark:text-white placeholder:text-neutral-400 font-medium"
                    />
                  </div>
                </div>

                {/* Tag Selection */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block font-serif italic">Descriptive tag notes</label>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          id={`mood-tag-${tag}`}
                          onClick={() => handleToggleTag(tag)}
                          className={`px-4 py-2 rounded-xl text-[9px] font-mono uppercase tracking-widest cursor-pointer border transition-all duration-200 ${
                            isSelected
                              ? "bg-gradient-to-r from-[#BFA9FF] to-[#DCCBFF] text-neutral-950 border-transparent font-bold shadow-md scale-102"
                              : "bg-white/40 dark:bg-[#1A1633]/40 text-neutral-500 dark:text-neutral-400 border-white/10 hover:bg-white/60 dark:hover:bg-white/10"
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-mood-entry"
                  className="w-full py-4 rounded-xl bg-neutral-950 dark:bg-white dark:text-neutral-950 hover:bg-neutral-850 dark:hover:bg-neutral-100 text-white font-bold font-mono text-[10px] tracking-widest uppercase shadow-xl transition-all hover:scale-[1.01] active:scale-95 cursor-pointer border border-white/10"
                >
                  Log Emotional Coordinates
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* 2. Monthly Calendar + Trends (Right Col - 5/12) */}
      <div className="lg:col-span-5 flex flex-col gap-6.5">
        
        {/* Calendar Card */}
        <div className="glass-panel rounded-3xl p-6 hover-glow transition-all duration-500 relative overflow-hidden">
          
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-[#BFA9FF] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-neutral-400">{monthName} {year}</span>
            </div>
            
            <div className="flex items-center space-x-1 border border-white/15 dark:border-white/5 rounded-xl p-0.5. bg-white/20 dark:bg-[#120F22]/20">
              <button
                type="button"
                id="mood-prev-month"
                onClick={() => setCurrentMonthIndex((m) => (m === 0 ? 11 : m - 1))}
                className="p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 cursor-pointer text-neutral-500"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id="mood-next-month"
                onClick={() => setCurrentMonthIndex((m) => (m === 11 ? 0 : m + 1))}
                className="p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 cursor-pointer text-neutral-500"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid represent monthly tracker */}
          <div className="grid grid-cols-7 gap-2.5 text-center text-[9px] font-mono text-neutral-400 mb-4 border-b border-white/10 pb-3">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>

          <div className="grid grid-cols-7 gap-2.5 text-center">
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              const entry = getMoodForDay(day);
              const foundMood = entry ? MOODS.find((m) => m.rating === entry.rating) : null;

              return (
                <div
                  key={day}
                  id={`calendar-day-${day}`}
                  className="flex flex-col items-center justify-center aspect-square rounded-xl relative border border-transparent select-none cursor-pointer group hover:bg-white/15 dark:hover:bg-white/5"
                >
                  <span className="text-[10px] font-mono text-neutral-500 group-hover:text-[#BFA9FF]">{day}</span>
                  {foundMood ? (
                    <motion.div
                      layoutId={`calendar-mood-dot-${day}`}
                      className={`absolute inset-0.5 rounded-xl ${foundMood.bg} border ${foundMood.border} flex items-center justify-center text-sm shadow-md`}
                      title={`${entry?.note || foundMood.label}`}
                    >
                      <span className="text-sm">{foundMood.emoji}</span>
                    </motion.div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Trend Quick Chart */}
        <div className="glass-panel rounded-3xl p-6 hover-glow transition-all duration-500 flex-grow relative overflow-hidden">
          
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="flex items-center space-x-2.5 mb-6. border-b border-white/10 pb-3">
            <Activity className="w-4 h-4 text-[#FFD6E7]" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Weekly spatial tides</h4>
          </div>

          <div className="h-32 flex items-end justify-between px-2 pt-6 relative">
            {/* Horizontal Guide lines */}
            <div className="absolute inset-x-0 top-6 border-t border-dotted border-white/10 dark:border-white/5" />
            <div className="absolute inset-x-0 bottom-6 border-b border-dotted border-white/10 dark:border-white/5" />

            {/* Quick columns mapping last 7 days */}
            {[...Array(7)].map((_, i) => {
              const dateObj = new Date();
              dateObj.setDate(dateObj.getDate() - (6 - i));
              const dateStr = dateObj.toISOString().split("T")[0];
              const entry = entries.find((e) => e.date === dateStr);
              const heightPercent = entry ? (entry.rating / 5) * 100 : 25; // fallback default
              
              const m = entry ? MOODS.find((md) => md.rating === entry.rating) : null;

              return (
                <div key={i} className="flex flex-col items-center space-y-2 flex-grow">
                  <div className="w-5 bg-white/20 dark:bg-neutral-800/10 rounded-full h-18 relative overflow-hidden flex items-end justify-center border border-white/5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-full bg-gradient-to-t from-[#BFA9FF] to-[#FFD6E7] dark:from-[#311F57] dark:to-[#4E2437] opacity-80`}
                      transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                    {dateObj.toLocaleDateString("default", { weekday: "narrow" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
