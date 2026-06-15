import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Square, Trash2, Plus, Flag, Compass, CheckCircle2, Circle } from "lucide-react";
import { Goal } from "../types";

interface GoalsComponentProps {
  goals: Goal[];
  onAddGoal: (text: string, category: "daily" | "weekly", priority: "low" | "medium" | "high") => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

const PRIORITY_BADGES = {
  high: "bg-rose-500/10 text-rose-500 border-rose-500/15",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/15",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/15",
};

export default function GoalsComponent({ goals, onAddGoal, onToggleGoal, onDeleteGoal }: GoalsComponentProps) {
  const [goalText, setGoalText] = useState("");
  const [category, setCategory] = useState<"daily" | "weekly">("daily");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalText.trim()) return;
    onAddGoal(goalText.trim(), category, priority);
    setGoalText("");
    setShowAddForm(false);
  };

  const dailyGoals = goals.filter((g) => g.category === "daily");
  const weeklyGoals = goals.filter((g) => g.category === "weekly");

  const completedRatio = (list: Goal[]) => {
    if (list.length === 0) return 0;
    const comp = list.filter((g) => g.completed).length;
    return Math.round((comp / list.length) * 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      {/* Configuration Column for creation (Left col - 4/12) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5.5 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-neutral-200/10">
            <Compass className="w-4 h-4 text-[#BFA9FF]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Intended milestones</h4>
          </div>

          <button
            id="toggle-add-goal"
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white font-serif font-bold text-xs tracking-wider uppercase cursor-pointer"
          >
            <span>{showAddForm ? "Cancel Goal" : "Formulate Specific Goal"}</span>
          </button>

          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSub}
                className="space-y-4.5 pt-2"
              >
                {/* Text input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Goal description</label>
                  <input
                    id="new-goal-text-input"
                    type="text"
                    required
                    value={goalText}
                    onChange={(e) => setGoalText(e.target.value)}
                    placeholder="e.g. Finish landing wireframes, Read 10 pages..."
                    className="w-full bg-white dark:bg-neutral-900/40 rounded-xl px-3.5 py-3 border border-neutral-300/10 text-xs text-neutral-800 dark:text-white outline-none"
                  />
                </div>

                {/* category select (Daily vs Weekly) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">Milestone Scope</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="scope-daily"
                      onClick={() => setCategory("daily")}
                      className={`py-2 p-1.5 text-center text-xs rounded-xl font-medium cursor-pointer border ${
                        category === "daily"
                          ? "bg-[#DCCBFF]/25 border-[#BFA9FF]/40 text-[#BFA9FF] font-semibold"
                          : "bg-white/40 dark:bg-white/5 border-neutral-200/10"
                      }`}
                    >
                      Daily Aspiration
                    </button>
                    <button
                      type="button"
                      id="scope-weekly"
                      onClick={() => setCategory("weekly")}
                      className={`py-2 p-1.5 text-center text-xs rounded-xl font-medium cursor-pointer border ${
                        category === "weekly"
                          ? "bg-[#DCCBFF]/25 border-[#BFA9FF]/40 text-[#BFA9FF] font-semibold"
                          : "bg-white/40 dark:bg-white/5 border-neutral-200/10"
                      }`}
                    >
                      Weekly Horizon
                    </button>
                  </div>
                </div>

                {/* priority tag selector */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Urgent Priority</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["low", "medium", "high"].map((p) => (
                      <button
                        type="button"
                        key={p}
                        id={`goal-priority-${p}`}
                        onClick={() => setPriority(p as any)}
                        className={`py-2 text-[10px] uppercase font-mono rounded-xl cursor-pointer border transition-all ${
                          priority === p
                            ? "bg-neutral-900 dark:bg-white dark:text-neutral-950 text-white font-bold border-transparent"
                            : "bg-white/30 dark:bg-white/5 border-neutral-200/10"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  id="confirm-add-goal"
                  className="w-full py-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-950 font-bold font-serif text-xs uppercase tracking-wider cursor-pointer"
                >
                  Anchor Goal State
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Aggregate metrics box */}
        <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5 backdrop-blur-xl shadow-xl flex-grow text-center flex flex-col justify-center">
          <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">Completeness Index</p>
          <div className="text-3xl font-serif text-neutral-800 dark:text-white mb-4 italic">
            {completedRatio(goals)}%
          </div>

          <div className="w-full bg-neutral-200/30 dark:bg-[#120F22]/35 rounded-full h-2 overflow-hidden mb-1 leading-none">
            <div
              className="bg-gradient-to-r from-[#BFA9FF] via-[#FFD6E7] to-[#CDEBFF] h-full"
              style={{ width: `${completedRatio(goals)}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-neutral-400">cumulative state target accuracy</span>
        </div>
      </div>

      {/* Goal timelines rendering (Right cols - 8/12) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Daily Goals group block */}
        <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex justify-between items-center mb-4 border-b border-neutral-200/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🌅</span>
              <h4 className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Daily Aspirations ({dailyGoals.length})</h4>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">{completedRatio(dailyGoals)}% complete</span>
          </div>

          <div className="space-y-3">
            {dailyGoals.length > 0 ? (
              dailyGoals.map((g) => (
                <div
                  key={g.id}
                  id={`goal-item-${g.id}`}
                  className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-[#1A1633]/20 border border-white/10 rounded-2xl hover:bg-white/70"
                >
                  <div className="flex items-center space-x-3.5">
                    <button
                      id={`check-goal-${g.id}`}
                      onClick={() => onToggleGoal(g.id)}
                      className="cursor-pointer text-[#BFA9FF] transition-all hover:scale-105"
                    >
                      {g.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                      )}
                    </button>
                    <div>
                      <p className={`text-xs font-medium font-sans ${g.completed ? "line-through text-neutral-400" : "text-neutral-800 dark:text-neutral-200"}`}>
                        {g.text}
                      </p>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono uppercase border mt-1 select-none ${PRIORITY_BADGES[g.priority]}`}>
                        {g.priority} priority
                      </span>
                    </div>
                  </div>

                  <button
                    id={`delete-goal-${g.id}`}
                    onClick={() => onDeleteGoal(g.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-400 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 py-3 text-center">No daily aspirations generated yet.</p>
            )}
          </div>
        </div>

        {/* Weekly Goals group block */}
        <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex justify-between items-center mb-4 border-b border-neutral-200/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🌌</span>
              <h4 className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Weekly Horizons ({weeklyGoals.length})</h4>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">{completedRatio(weeklyGoals)}% complete</span>
          </div>

          <div className="space-y-3">
            {weeklyGoals.length > 0 ? (
              weeklyGoals.map((g) => (
                <div
                  key={g.id}
                  id={`goal-item-${g.id}`}
                  className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-[#1A1633]/20 border border-white/10 rounded-2xl hover:bg-white/70"
                >
                  <div className="flex items-center space-x-3.5">
                    <button
                      id={`check-goal-${g.id}`}
                      onClick={() => onToggleGoal(g.id)}
                      className="cursor-pointer text-[#BFA9FF] transition-all hover:scale-105"
                    >
                      {g.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                      )}
                    </button>
                    <div>
                      <p className={`text-xs font-medium font-sans ${g.completed ? "line-through text-neutral-400" : "text-neutral-800 dark:text-neutral-200"}`}>
                        {g.text}
                      </p>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono uppercase border mt-1 select-none ${PRIORITY_BADGES[g.priority]}`}>
                        {g.priority} priority
                      </span>
                    </div>
                  </div>

                  <button
                    id={`delete-goal-${g.id}`}
                    onClick={() => onDeleteGoal(g.id)}
                    className="p-1 rounded text-neutral-400 hover:text-rose-400 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 py-3 text-center">No weekly horizon milestones formulated yet.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
