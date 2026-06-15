import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Feather, Search, FolderHeart, Calendar, Plus, Trash2, ArrowUpDown, Shield } from "lucide-react";
import { JournalEntry } from "../types";

interface JournalComponentProps {
  entries: JournalEntry[];
  onAddEntry: (title: string, content: string, category: JournalEntry["category"]) => void;
  onDeleteEntry: (id: string) => void;
}

const CATEGORIES: JournalEntry["category"][] = ["Gratitude", "Reflection", "Dreams", "Mindfulness", "Brain-dump"];

const CATEGORY_COLORS = {
  Gratitude: "bg-[#FFD6E7]/20 border-[#FFD6E7]/40 text-[#E693B6]",
  Reflection: "bg-[#DCCBFF]/20 border-[#DCCBFF]/40 text-[#BFA9FF]",
  Dreams: "bg-[#CDEBFF]/20 border-[#CDEBFF]/40 text-[#7EA9CD]",
  Mindfulness: "bg-[#FFF8F0]/30 border-neutral-200/40 text-[#7C59E6]",
  "Brain-dump": "bg-neutral-200/40 border-neutral-200/20 text-neutral-500",
};

export default function JournalComponent({ entries, onAddEntry, onDeleteEntry }: JournalComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<JournalEntry["category"]>("Reflection");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddEntry(newTitle.trim(), newContent.trim(), newCategory);
    setNewTitle("");
    setNewContent("");
    setNewCategory("Reflection");
    setIsFormVisible(false);
  };

  // Filter & search processing
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedFilterCategory === "all" || entry.category === selectedFilterCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
      
      {/* Search / Filter & Creator sidebar (Left 5/12) */}
      <div className="lg:col-span-4 flex flex-col gap-6.5">
        
        {/* Creation Toggle Container */}
        <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5.5 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200/10">
            <div className="flex items-center space-x-2">
              <FolderHeart className="w-4 h-4 text-[#FFD6E7]" />
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Sanctuary Diary</span>
            </div>
          </div>

          <button
            id="toggle-journal-form"
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="w-full py-3.5 rounded-xl bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-serif font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Feather className="w-4 h-4" />
            <span>{isFormVisible ? "Close Scroll" : "Write Reflection Note"}</span>
          </button>

          <AnimatePresence>
            {isFormVisible && (
              <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit}
                className="space-y-4 pt-2"
              >
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block">Note Title</label>
                  <input
                    id="journal-title-input"
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., A sudden breeze of peace"
                    className="w-full bg-white dark:bg-neutral-900/40 rounded-xl px-3 py-2.5 border border-neutral-300/10 text-xs text-neutral-800 dark:text-white outline-none"
                  />
                </div>

                {/* Category selectors */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block font-sans">Tag Category</label>
                  <select
                    id="journal-category-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-white dark:bg-neutral-900 rounded-xl px-3 py-2.5 border border-neutral-300/10 text-xs text-neutral-800 dark:text-neutral-200 outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest block">Reflection thoughts</label>
                  <textarea
                    id="journal-content-textarea"
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Begin writing with absolute sincerity. This state of reflection is protected."
                    className="w-full bg-white dark:bg-neutral-900/40 rounded-2xl px-4 py-3 border border-neutral-300/10 text-xs text-neutral-800 dark:text-white outline-none resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  id="submit-journal-entry"
                  className="w-full py-3 rounded-lg bg-[#BFA9FF] text-neutral-950 font-bold text-xs tracking-wider uppercase shadow cursor-pointer hover:opacity-90"
                >
                  Seal Reflection Scroll
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Search and Filters sidebar */}
        <div className="rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-5 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2.5 bg-white/50 dark:bg-neutral-900/30 rounded-xl px-3 py-2 border border-white/10">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              id="journal-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search written scrolls..."
              className="bg-transparent flex-grow outline-none text-xs text-neutral-800 dark:text-white placeholder:text-neutral-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">Filter by categories</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                id="filter-cat-all"
                onClick={() => setSelectedFilterCategory("all")}
                className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wide cursor-pointer transition-all border ${
                  selectedFilterCategory === "all"
                    ? "bg-[#BFA9FF] border-transparent text-neutral-950 font-semibold"
                    : "bg-white/40 dark:bg-neutral-900/20 border-transparent text-neutral-500"
                }`}
              >
                All Scrolls
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  id={`filter-cat-${cat}`}
                  onClick={() => setSelectedFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wide cursor-pointer transition-all border ${
                    selectedFilterCategory === cat
                      ? "bg-[#BFA9FF] border-transparent text-neutral-950 font-semibold"
                      : "bg-white/40 dark:bg-neutral-900/20 border-transparent text-neutral-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Sequential chronological timeline list (Right 7/12) */}
      <div className="lg:col-span-8 flex flex-col gap-6.5">
        
        {/* Timeline headers */}
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center space-x-1.5">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Chronological timeline ({filteredEntries.length} scrolls)</span>
          </span>
          <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full tracking-wider flex items-center space-x-1 uppercase">
            <Shield className="w-3 h-3 fill-current" />
            <span>Client offline private state</span>
          </span>
        </div>

        {/* Timeline logs */}
        <div className="space-y-5.5 relative pl-4 border-l border-neutral-200/15 dark:border-neutral-800/20 py-2.5">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((item) => (
              <div key={item.id} id={`journal-entry-${item.id}`} className="relative">
                
                {/* Visual Bullet on timeline */}
                <div className="absolute left-[-21px] top-4.5 w-2.5 h-2.5 rounded-full bg-white dark:bg-[#120F22] border-2 border-[#BFA9FF]" />

                {/* Elegant Journal Card */}
                <div className="p-5 rounded-2xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 shadow-md backdrop-blur-md ">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-medium border uppercase tracking-wider ${CATEGORY_COLORS[item.category]}`}>
                          {item.category}
                        </span>
                        
                        <span className="text-[9px] font-mono text-neutral-400 flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-neutral-300" />
                          <span>{new Date(item.date).toLocaleDateString("default", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-medium text-neutral-800 dark:text-white leading-normal">{item.title}</h4>
                    </div>

                    <button
                      id={`delete-journal-entry-${item.id}`}
                      onClick={() => onDeleteEntry(item.id)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-400 transition-all cursor-pointer"
                      title="Annihilate Memoir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap select-text selection:bg-[#BFA9FF]/20">
                    {item.content}
                  </p>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-20 text-neutral-400">
              <Feather className="w-10 h-10 mx-auto mb-4 text-[#DCCBFF]/60 animate-bounce" />
              <p className="text-xs">No entries match your filtering parameters. Clear the search bar or create a new memoir scroll above.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
