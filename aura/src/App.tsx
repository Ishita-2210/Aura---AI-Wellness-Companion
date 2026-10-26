import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Compass, Clock, Target, Feather, Sparkles, BookOpen, 
  Settings, LogOut, Moon, Sun, AlertCircle, Compass as NavigationIcon, ChevronRight
} from "lucide-react";

// Sub-components
import AuroraBackground from "./components/AuroraBackground";
import LandingPage from "./components/LandingPage";
import MoodTrackerComponent from "./components/MoodTrackerComponent";
import AffirmationComponent from "./components/AffirmationComponent";
import FocusTimerComponent from "./components/FocusTimerComponent";
import HabitComponent from "./components/HabitComponent";
import JournalComponent from "./components/JournalComponent";
import GoalsComponent from "./components/GoalsComponent";
import InspirationComponent from "./components/InspirationComponent";
import AnalyticsComponent from "./components/AnalyticsComponent";

// Types
import { MoodEntry, Habit, JournalEntry, Goal, Affirmation } from "./types";

const DEFAULT_HABITS: Habit[] = [
  { id: "hab-1", name: "60-sec Deep Diaphragmatic Breath", streak: 3, history: [], icon: "🌿", frequency: "daily" },
  { id: "hab-2", name: "Sip 200ml clean water mindfully", streak: 5, history: [], icon: "💧", frequency: "daily" },
  { id: "hab-3", name: "Focus timer 25 minutes session", streak: 2, history: [], icon: "🧘", frequency: "daily" },
];

const DEFAULT_JOURNALS: JournalEntry[] = [
  { 
    id: "j-1", 
    title: "The morning stillness in perspective", 
    content: "Woke up 10 minutes before the alarm. The room was blanketed in a heavy slate fog. Rather than grabbing my phone immediately, I stared at a shadow on the wall for two slow minutes. My chest felt empty, but peaceful. I am realizing that anxiety is just creative energy looking for a place to flow.", 
    date: new Date(Date.now() - 3600000 * 24).toISOString(), 
    category: "Reflection" 
  },
  { 
    id: "j-2", 
    title: "Small micro-revelations with jasmine tea", 
    content: "Gratitude note: Extremely thankful for the delicate floral aroma of jasmine tea this afternoon. Tasting the subtle heat and sweet background of the tea leaves. Total attention to a hot ceramic mug can completely ground an overactive day.", 
    date: new Date(Date.now() - 3600000 * 48).toISOString(), 
    category: "Gratitude" 
  }
];

const DEFAULT_GOALS: Goal[] = [
  { id: "g-1", text: "Seal design drafts for the wellness layout", category: "daily", completed: false, priority: "high" },
  { id: "g-2", text: "Walk 5,000 steps without listening to headphones", category: "daily", completed: true, priority: "low" },
  { id: "g-3", text: "Submit 2 chronicle journals reflecting on weekly alignment", category: "weekly", completed: false, priority: "medium" },
];

const DEFAULT_MOODS: MoodEntry[] = [
  { id: "m-1", date: new Date(Date.now() - 3600000 * 24 * 3).toISOString().split("T")[0], rating: 4, note: "Feeling radiant and creatively flowing", tags: ["Productive", "Mindful"] },
  { id: "m-2", date: new Date(Date.now() - 3600000 * 24 * 2).toISOString().split("T")[0], rating: 3, note: "Standard centered mental space", tags: ["Somatic"] },
  { id: "m-3", date: new Date(Date.now() - 3600000 * 24).toISOString().split("T")[0], rating: 2, note: "Unbalanced sensory fog this afternoon", tags: ["Overwhelmed"] },
];

export default function App() {
  const [isPending, startTransition] = useTransition();

  // App Theme Switch state
  const [isDark, setIsDark] = useState<boolean>(() => {
    // default to true for premium dark aesthetic, but check client preferences
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("aura_dark_theme");
      return savedTheme === null ? true : savedTheme === "true";
    }
    return true;
  });

  // Authenticated State hooks
  const [visitorName, setVisitorName] = useState<string>(() => {
    return localStorage.getItem("aura_visitor_name") || "";
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("aura_is_logged_in") === "true";
  });

  // Core Sanctuary state ledgers
  const [moods, setMoods] = useState<MoodEntry[]>(() => {
    const raw = localStorage.getItem("aura_mood_entries");
    return raw ? JSON.parse(raw) : DEFAULT_MOODS;
  });
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const raw = localStorage.getItem("aura_habits");
    return raw ? JSON.parse(raw) : DEFAULT_HABITS;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const raw = localStorage.getItem("aura_journals");
    return raw ? JSON.parse(raw) : DEFAULT_JOURNALS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const raw = localStorage.getItem("aura_goals");
    return raw ? JSON.parse(raw) : DEFAULT_GOALS;
  });

  const [savedAffirmations, setSavedAffirmations] = useState<Affirmation[]>(() => {
    const raw = localStorage.getItem("aura_saved_affirmations");
    return raw ? JSON.parse(raw) : [];
  });

  // Navigation tab state indicator
  const [activeTab, setActiveTab] = useState<"centroid" | "affirmations" | "timer" | "disciplines" | "scrolls" | "goals" | "wisdom">("centroid");

  // Real-time clock for status sidebar
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme configuration effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("aura_dark_theme", isDark.toString());
  }, [isDark]);

  // Persists core states as they are modified
  useEffect(() => {
    localStorage.setItem("aura_mood_entries", JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem("aura_habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("aura_journals", JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem("aura_goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("aura_saved_affirmations", JSON.stringify(savedAffirmations));
  }, [savedAffirmations]);

  // Authenticate visitor name checkin
  const handleEnterApp = (name?: string) => {
    startTransition(() => {
      const finalName = name?.trim() || "Aura Seeker";
      setVisitorName(finalName);
      setIsLoggedIn(true);
      localStorage.setItem("aura_visitor_name", finalName);
      localStorage.setItem("aura_is_logged_in", "true");
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("aura_is_logged_in", "false");
  };

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  // State modification Handlers

  // 1. Mood
  const handleAddMood = (rating: number, note: string, tags: string[]) => {
    const newEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      rating,
      note,
      tags
    };
    setMoods([newEntry, ...moods]);
  };

  // 2. Affirmation
  const handleSaveAffirmation = (aff: Affirmation) => {
    if (!savedAffirmations.some(a => a.text === aff.text)) {
      setSavedAffirmations([aff, ...savedAffirmations]);
    }
  };

  const handleDeleteAffirmation = (text: string) => {
    setSavedAffirmations(savedAffirmations.filter(a => a.text !== text));
  };

  // 3. Focus Timer
  const handleLogFocusSession = (minutes: number, type: "work" | "meditate" | "breath") => {
    // Creating focus achievement trigger log
    const goalName = `Auto: Completed ${minutes} min ${type} Focus Interval`;
    const newG: Goal = {
      id: `g-${Date.now()}`,
      text: goalName,
      category: "daily",
      completed: true,
      priority: "low"
    };
    setGoals([newG, ...goals]);
  };

  // 4. Habits
  const handleAddHabit = (name: string, icon: string) => {
    const newH: Habit = {
      id: `h-c-${Date.now()}`,
      name,
      streak: 0,
      history: [],
      icon,
      frequency: "daily"
    };
    setHabits([...habits, newH]);
  };

  const handleToggleHabit = (id: string, date: string) => {
    setHabits(habits.map((h) => {
      if (h.id === id) {
        const completed = h.history.includes(date);
        let nextHistory = [...h.history];
        let nextStreak = h.streak;

        if (completed) {
          nextHistory = nextHistory.filter((d) => d !== date);
          nextStreak = Math.max(0, nextStreak - 1);
        } else {
          nextHistory.push(date);
          nextStreak += 1;
        }
        return { ...h, history: nextHistory, streak: nextStreak };
      }
      return h;
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter((h) => h.id !== id));
  };

  // 5. Journal entries
  const handleAddJournal = (title: string, content: string, category: JournalEntry["category"]) => {
    const newJ: JournalEntry = {
      id: `j-${Date.now()}`,
      title,
      content,
      category,
      date: new Date().toISOString()
    };
    setJournals([newJ, ...journals]);
  };

  const handleDeleteJournal = (id: string) => {
    setJournals(journals.filter((j) => j.id !== id));
  };

  // 6. Goals
  const handleAddGoal = (text: string, category: "daily" | "weekly", priority: "low" | "medium" | "high") => {
    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      text,
      category,
      completed: false,
      priority
    };
    setGoals([newGoal, ...goals]);
  };

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map((g) => {
      if (g.id === id) {
        return { ...g, completed: !g.completed };
      }
      return g;
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  return (
    <div className="relative isolate min-h-screen text-neutral-800 dark:text-neutral-100 transition-colors duration-500 overflow-x-hidden">
      
      {/* Background Layer with mouse glow movement */}
      <AuroraBackground />

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          /* Landing Screen Experience */
          <motion.div
            key="landing-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LandingPage
              onEnterApp={handleEnterApp}
              isDark={isDark}
              toggleTheme={handleToggleTheme}
            />
          </motion.div>
        ) : (
          /* Authenticated Luxury Workspace */
          <motion.div
            key="dashboard-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row min-h-screen gap-6 p-4 lg:p-6"
          >
            
            {/* 1. SPATIAL FLOATING GLASS NAVIGATION BAR */}
            <aside id="dashboard-sidebar" className="w-full lg:w-72 glass-panel rounded-3xl p-6 flex flex-col justify-between shrink-0 shadow-2xl transition-all duration-300 lg:h-[calc(100vh-3rem)] lg:sticky lg:top-6 overflow-y-auto">
              
              {/* Header Profile Info section */}
              <div>
                <div className="flex items-center space-x-3.5 mb-8 border-b border-white/10 dark:border-white/5 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFD6E7] via-[#DCCBFF] to-[#CDEBFF] p-[1.5px] flex items-center justify-center shadow-lg pointer-events-none select-none">
                    <div className="w-full h-full bg-white dark:bg-[#120F22] rounded-2xl flex items-center justify-center text-xs font-serif text-[#BFA9FF] dark:text-[#DCCBFF] tracking-wider uppercase font-bold">
                      {visitorName.substring(0, 2)}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-white flex items-center space-x-1.5">
                      <span>{visitorName}</span>
                    </h2>
                    <span className="text-[8.5px] font-mono tracking-widest text-[#BFA9FF] uppercase block mt-0.5">
                      AURA_SEEKER_MODE
                    </span>
                  </div>
                </div>

                {/* Persistent Dynamic Clock status display */}
                <div className="mb-6 p-4 rounded-2xl bg-white/20 dark:bg-[#120F22]/20 border border-white/10 dark:border-white/5 shadow-sm text-center">
                  <span className="text-2xl font-mono text-neutral-800 dark:text-white font-bold block tracking-tight">
                    {timeStr || "00:00:00"}
                  </span>
                  <span className="text-[7.5px] font-mono uppercase tracking-widest text-neutral-400 block mt-1">UTC TIME CHROMOS</span>
                </div>

                {/* Navigation selections */}
                <nav className="space-y-1.5">
                  {[
                    { id: "centroid", label: "Sanctuary Centroid", icon: Compass },
                    { id: "affirmations", label: "AI Whispered Cards", icon: Sparkles },
                    { id: "timer", label: "Anchor Focus Timer", icon: Clock },
                    { id: "disciplines", label: "Consistent Disciplines", icon: Target },
                    { id: "scrolls", label: "Reflection Scrolls", icon: Feather },
                    { id: "goals", label: "Sacred Goals Map", icon: BookOpen },
                    { id: "wisdom", label: "Curated Wisdom", icon: NavigationIcon }
                  ].map((nav) => {
                    const Icon = nav.icon;
                    const isActive = activeTab === nav.id;
                    return (
                      <button
                        key={nav.id}
                        id={`sidebar-nav-${nav.id}`}
                        onClick={() => setActiveTab(nav.id as any)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left border transition-all cursor-pointer text-xs uppercase tracking-wider font-mono font-bold ${
                          isActive
                            ? "bg-white/80 dark:bg-[#120F22]/80 border-white/20 dark:border-white/5 text-neutral-900 dark:text-white scale-[1.02] shadow-md !text-purple-600 dark:!text-[#DCCBFF]"
                            : "bg-transparent border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-purple-600 dark:text-[#BFA9FF]" : "text-neutral-400"}`} />
                          <span className="font-serif tracking-wide capitalize text-xs">{nav.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-purple-600 dark:text-[#BFA9FF]" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer triggers (Theme switch, system logout) */}
              <div className="space-y-4 pt-6 mt-6 border-t border-white/10 dark:border-white/5 lg:sticky lg:bottom-0">
                
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Toggle view</span>
                  <button
                    id="sidebar-theme-toggle"
                    onClick={handleToggleTheme}
                    className="p-2.5 rounded-xl bg-white/40 dark:bg-[#120F22]/40 border border-white/10 dark:border-white/5 text-neutral-500 hover:text-neutral-850 dark:hover:text-white transition-all cursor-pointer shadow-sm hover-glow"
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#BFA9FF]" />}
                  </button>
                </div>

                <button
                  id="sidebar-logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-dashed border-rose-500/20 hover:border-rose-500/40 rounded-xl text-[10px] font-mono uppercase tracking-wider text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Exit Sanctuary</span>
                </button>

              </div>

            </aside>

            {/* 2. MAIN CORE STAGE FIELD (75% on desktop) */}
            <main id="dashboard-stage" className="flex-grow p-6.5 lg:p-10 max-w-7xl mx-auto flex flex-col gap-8 select-none">
              
              {/* Dynamic Header Badge greeting */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-220/10 pb-6 mb-2">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif text-neutral-800 dark:text-white leading-normal">
                    {activeTab === "centroid" && "Self-Study Sanctuary Center"}
                    {activeTab === "affirmations" && "Curated AI Reflections"}
                    {activeTab === "timer" && "Ambient Focus Anchor"}
                    {activeTab === "disciplines" && "Daily Micro-Disciplines"}
                    {activeTab === "scrolls" && "Personal Reflection Scrolls"}
                    {activeTab === "goals" && "Aspiration & Milestone Map"}
                    {activeTab === "wisdom" && "Daily Wisdom Suggestions"}
                  </h1>
                  <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-1">
                    {activeTab === "centroid" && "Aggregate emotional indices and trend forecasts"}
                    {activeTab === "affirmations" && "Reflections from a configured model or clearly labelled curated text"}
                    {activeTab === "timer" && "Deep concentration clock with pranayama breathing cues"}
                    {activeTab === "disciplines" && "Check completion metrics to build consecutive strengths"}
                    {activeTab === "scrolls" && "Secure private chronicles summarizing inner learnings"}
                    {activeTab === "goals" && "Anchor your daily priorities and weekly timelines"}
                    {activeTab === "wisdom" && "Sensory wellness prompts and inspirational seeds"}
                  </p>
                </div>

                {/* Aesthetic Status marker */}
                <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/15 text-emerald-500 px-3 py-1.5 rounded-full select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono tracking-widest uppercase font-semibold">Active Sanctuary Status</span>
                </div>
              </div>

              {/* Render Selected Stage Module view */}
              <div className="w-full">
                {activeTab === "centroid" && (
                  <div className="space-y-10">
                    {/* Mood Tracker Row (Incorporates Emoji input, Monthly dots map & Weekly trend chart) */}
                    <MoodTrackerComponent
                      entries={moods}
                      onAddEntry={handleAddMood}
                      isDark={isDark}
                    />
                    
                    {/* Centralized metrics widgets section */}
                    <div className="border-t border-neutral-220/10 pt-8">
                      <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6">Alignment & Consistency map</h4>
                      <AnalyticsComponent
                        moods={moods}
                        habits={habits}
                        journals={journals}
                        goals={goals}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "affirmations" && (
                  <AffirmationComponent
                    onSaveAffirmation={handleSaveAffirmation}
                    savedAffirmations={savedAffirmations}
                    onDeleteAffirmation={handleDeleteAffirmation}
                  />
                )}

                {activeTab === "timer" && (
                  <FocusTimerComponent
                    onLogFocusSession={handleLogFocusSession}
                  />
                )}

                {activeTab === "disciplines" && (
                  <HabitComponent
                    habits={habits}
                    onAddHabit={handleAddHabit}
                    onToggleHabit={handleToggleHabit}
                    onDeleteHabit={handleDeleteHabit}
                  />
                )}

                {activeTab === "scrolls" && (
                  <JournalComponent
                    entries={journals}
                    onAddEntry={handleAddJournal}
                    onDeleteEntry={handleDeleteJournal}
                  />
                )}

                {activeTab === "goals" && (
                  <GoalsComponent
                    goals={goals}
                    onAddGoal={handleAddGoal}
                    onToggleGoal={handleToggleGoal}
                    onDeleteGoal={handleDeleteGoal}
                  />
                )}

                {activeTab === "wisdom" && (
                  <InspirationComponent />
                )}
              </div>

            </main>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
