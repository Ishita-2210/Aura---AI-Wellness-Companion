import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Flame, Award, Plus, Trash2, Calendar, Target, Activity } from "lucide-react";
import { Habit } from "../types";

interface HabitComponentProps {
  habits: Habit[];
  onAddHabit: (name: string, icon: string) => void;
  onToggleHabit: (id: string, date: string) => void;
  onDeleteHabit: (id: string) => void;
}

const HABIT_PRESET_ICONS = ["🌿", "💧", "🧘", "☕", "🧠", "📖", "🚶", "✍️", "💻"];

const BADGES = [
  { name: "First Spark", desc: "Initiate your first micro-habit sequence", minStreak: 1, icon: "✨", bgColor: "bg-[#FFD6E7]/20" },
  { name: "Rooted Reed", desc: "Build a persistent 3-day consistency streak", minStreak: 3, icon: "🎋", bgColor: "bg-[#DCCBFF]/20" },
  { name: "Flowing River", desc: "Maintain a steady 7-day mindfulness streak", minStreak: 7, icon: "🌊", bgColor: "bg-[#CDEBFF]/20" },
  { name: "Solar Meridian", desc: "Reach a magnificent 14-day productivity streak", minStreak: 14, icon: "☀️", bgColor: "bg-[#BFA9FF]/20" },
];

export default function HabitComponent({ habits, onAddHabit, onToggleHabit, onDeleteHabit }: HabitComponentProps) {
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(HABIT_PRESET_ICONS[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0];
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName.trim(), selectedIcon);
    setNewHabitName("");
    setShowAddForm(false);
  };

  const isCompletedToday = (h: Habit) => {
    return h.history.includes(getTodayDateString());
  };

  // Compute highest streak of any habit to unlock badges
  const maxStreak = habits.reduce((max, h) => (h.streak > max ? h.streak : max), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      {/* Habits List (Left 7/12) */}
      <div className="lg:col-span-8 rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCCBFF]/30 flex items-center justify-center text-[#BFA9FF]">
              <Target className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-neutral-800 dark:text-white">Daily alignment disciplines</h3>
              <p className="text-[11px] font-mono tracking-wide text-neutral-400">Micro habits that accumulate into giant transformation</p>
            </div>
          </div>
          
          <button
            id="toggle-habit-form-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-neutral-900/10 dark:bg-white/5 border border-white/15 text-xs text-neutral-800 dark:text-white cursor-pointer hover:bg-neutral-900/25 transition-all text-medium flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discipline</span>
          </button>
        </div>

        {/* Create Form Modal overlay */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateHabit}
              className="mb-6 p-4.5 rounded-2xl bg-white/60 dark:bg-[#1A1633]/40 border border-white/20 space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">Discipline Title</label>
                <input
                  id="new-habit-title-input"
                  type="text"
                  required
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Spine stretch standing, 1 minute meditation, Drink tea with closed eyes"
                  className="w-full bg-white dark:bg-neutral-900 rounded-xl px-4 py-3 border border-neutral-300/10 text-xs text-neutral-800 dark:text-white outline-none focus:border-[#BFA9FF]/45 placeholder:text-neutral-400 font-sans"
                />
              </div>

              {/* Icon preset picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">Somatic Icon representative</label>
                <div className="flex gap-2 text-xl overflow-x-auto py-1">
                  {HABIT_PRESET_ICONS.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      id={`preset-icon-${ic}`}
                      onClick={() => setSelectedIcon(ic)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedIcon === ic
                          ? "bg-[#DCCBFF]/30 border-[#BFA9FF]/55 scale-110 shadow-sm"
                          : "bg-white/40 dark:bg-white/5 border-transparent hover:bg-white/70"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  id="cancel-habit-btn"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-habit-btn"
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-900 font-semibold text-xs tracking-wide shadow cursor-pointer"
                >
                  Save Discipline
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Habits Checklist rendering */}
        <div className="space-y-3.5">
          {habits.length > 0 ? (
            habits.map((h) => {
              const completed = isCompletedToday(h);
              return (
                <div
                  key={h.id}
                  id={`habit-row-${h.id}`}
                  className="flex items-center justify-between p-4.5 bg-white/60 dark:bg-[#1A1633]/20 border border-white/10 rounded-2xl transition-all hover:bg-white/80"
                >
                  <div className="flex items-center space-x-4">
                    {/* Toggle Circle checkpoint */}
                    <button
                      id={`check-habit-${h.id}`}
                      onClick={() => onToggleHabit(h.id, getTodayDateString())}
                      className="cursor-pointer text-[#BFA9FF] transition-all hover:scale-110"
                    >
                      {completed ? (
                        <CheckCircle2 className="w-6 h-6 fill-emerald-500/10 text-emerald-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-neutral-300 dark:text-neutral-700" />
                      )}
                    </button>

                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{h.icon}</span>
                      <div>
                        <p className={`text-sm font-serif font-bold ${completed ? "line-through text-neutral-400" : "text-neutral-800 dark:text-white"}`}>
                          {h.name}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-400">
                          <span className="bg-neutral-200/50 dark:bg-[#1A1633]/40 px-1.5 py-0.5 rounded uppercase">Daily</span>
                          {completed && <span className="text-emerald-500">Unlocking momentum</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Streak & deletions */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1.5 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl border border-amber-500/15 font-mono text-xs font-semibold select-none">
                      <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                      <span>{h.streak}d streak</span>
                    </div>

                    <button
                      id={`delete-habit-${h.id}`}
                      onClick={() => onDeleteHabit(h.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
                      title="Remove Discipline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-neutral-400">
              <Calendar className="w-10 h-10 mx-auto mb-4 text-[#DCCBFF]/60" />
              <p className="text-xs">Your disciplines garden is completely empty. Create a custom discipline above to embark.</p>
            </div>
          )}
        </div>
      </div>

      {/* Badges & Achievements unlocked map (Right 5/12) */}
      <div className="lg:col-span-4 rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-5 border-b border-neutral-200/10 pb-4">
            <Award className="w-4 h-4 text-[#FFD6E7]" />
            <h4 className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Milestone achievements</h4>
          </div>

          <div className="space-y-4">
            {BADGES.map((badge, idx) => {
              const unlocked = maxStreak >= badge.minStreak;
              return (
                <div
                  key={idx}
                  id={`milestone-badge-${idx}`}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center space-x-3.5 ${
                    unlocked
                      ? `${badge.bgColor} border-[#BFA9FF]/20`
                      : "opacity-45 bg-neutral-200/10 border-transparent select-none"
                  }`}
                >
                  <span className="text-3xl bg-white/70 dark:bg-neutral-800/50 p-2.5 rounded-xl shadow-sm block select-none">
                    {badge.icon}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold font-serif text-neutral-800 dark:text-white flex items-center space-x-1.5">
                      <span>{badge.name}</span>
                      {unlocked && (
                        <span className="text-[9px] font-mono tracking-widest text-[#BFA9FF] uppercase font-bold">
                          Unlocked
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal mt-0.5">{badge.desc}</p>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-400 block mt-1">Requires {badge.minStreak} day streak</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-200/10 pt-4 text-center">
          <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
            Discipline Level Progress: {maxStreak} / 14 consecutive days
          </p>
          <div className="w-full bg-neutral-200/30 dark:bg-[#120F22]/35 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#BFA9FF] to-[#DCCBFF] h-full"
              style={{ width: `${Math.min((maxStreak / 14) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
