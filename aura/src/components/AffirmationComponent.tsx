import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Star, ChevronRight, Copy, Check, Feather, MessageCircle, Heart, RefreshCw, Layers } from "lucide-react";
import { Affirmation } from "../types";

interface AffirmationComponentProps {
  onSaveAffirmation: (affirmation: Affirmation) => void;
  savedAffirmations: Affirmation[];
  onDeleteAffirmation: (text: string) => void;
}

const CATEGORIES = [
  { id: "mindfulness", label: "Mindfulness", icon: Feather, bg: "bg-[#FFD6E7]/25", text: "text-[#E693B6]" },
  { id: "productivity", label: "Productive Flow", icon: Sparkles, bg: "bg-[#CDEBFF]/25", text: "text-[#7EA9CD]" },
  { id: "inner-strength", label: "Inner Strength", icon: Heart, bg: "bg-[#DCCBFF]/25", text: "text-[#BFA9FF]" },
  { id: "creativity", label: "Infinite Mind", icon: Layers, bg: "bg-[#FFF8F0]/30", text: "text-neutral-500" }
];

export default function AffirmationComponent({ onSaveAffirmation, savedAffirmations, onDeleteAffirmation }: AffirmationComponentProps) {
  const [activeCategory, setActiveCategory] = useState("mindfulness");
  const [customFocus, setCustomFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewingSaved, setViewingSaved] = useState(false);

  const generateAffirmation = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/affirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: "centered",
          category: activeCategory,
          customFocus: customFocus.trim() || undefined
        }),
      });

      const data = await response.json();
      setCurrentAffirmation(data);
    } catch (error) {
      console.error("Error generating affirmation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!currentAffirmation) return;
    navigator.clipboard.writeText(currentAffirmation.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAlreadySaved = currentAffirmation && savedAffirmations.some(a => a.text === currentAffirmation.text);

  return (
    <div className="w-full">
      
      {/* Tab Switcher (Create vs Saved Favorites list) */}
      <div className="flex justify-center mb-8 border-b border-neutral-300/10 max-w-sm mx-auto">
        <button
          id="affirmation-tab-create"
          onClick={() => setViewingSaved(false)}
          className={`flex-1 pb-3 text-sm font-serif tracking-wide transition-all cursor-pointer ${
            !viewingSaved
              ? "border-b-2 border-[#BFA9FF] text-neutral-800 dark:text-white font-medium"
              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          Generate Affirmation
        </button>
        <button
          id="affirmation-tab-saved"
          onClick={() => setViewingSaved(true)}
          className={`flex-1 pb-3 text-sm font-serif tracking-wide transition-all cursor-pointer ${
            viewingSaved
              ? "border-b-2 border-[#BFA9FF] text-neutral-800 dark:text-white font-medium"
              : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          Loved Reflections ({savedAffirmations.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!viewingSaved ? (
          <motion.div
            key="generation-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Setting Configuration Side Panel (Left 5/12) */}
            <div className="lg:col-span-5 rounded-3xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 p-6 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles className="w-5 h-5 text-[#BFA9FF] animate-spin-slow" />
                <div>
                  <h3 className="text-lg font-serif text-neutral-800 dark:text-white">Intentional tailoring</h3>
                  <p className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">AURA_AI_ENGINE</p>
                </div>
              </div>

              {/* Tag/Category selecting tiles */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Whisper Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        id={`category-btn-${cat.id}`}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col space-y-2 ${
                          activeCategory === cat.id
                            ? `${cat.bg} border-[#BFA9FF]/45 shadow-sm`
                            : "bg-white/30 dark:bg-white/5 border-neutral-200/10 hover:bg-white/60 dark:hover:bg-white/10"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${cat.text}`} />
                        <span className="text-xs font-serif font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Mind Situation text area */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Contextual Anchor (Optional)</label>
                  <span className="text-[9px] font-mono text-neutral-400">e.g., meeting stress</span>
                </div>
                <textarea
                  id="custom-focus-textarea"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder="What is occupying the chambers of your mind?"
                  rows={3}
                  className="w-full bg-white/40 dark:bg-neutral-900/30 rounded-2xl px-4 py-3.5 border border-white/10 text-xs text-neutral-800 dark:text-white outline-none focus:border-[#BFA9FF]/40 placeholder:text-neutral-400 resize-none font-sans"
                />
              </div>

              <button
                type="button"
                id="generate-affirmation-btn"
                onClick={generateAffirmation}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#BFA9FF] via-[#FFD6E7] to-[#CDEBFF] text-neutral-950 font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Summoning Reflection...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Whispered Affirmation</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Output Showcase Card (Right 7/12) */}
            <div className="lg:col-span-7 flex flex-col justify-center min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentAffirmation ? (
                  <motion.div
                    key={currentAffirmation.text}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`rounded-3xl p-6.5 border shadow-xl relative overflow-hidden flex flex-col justify-between h-full bg-gradient-to-tr from-white/70 ${
                      currentAffirmation.accentColor === "pink" ? "to-[#FFD6E7]/30 border-[#FFD6E7]/40 text-[#E693B6]" :
                      currentAffirmation.accentColor === "lavender" ? "to-[#DCCBFF]/30 border-[#DCCBFF]/40 text-[#BFA9FF]" :
                      currentAffirmation.accentColor === "blue" ? "to-[#CDEBFF]/30 border-[#CDEBFF]/40 text-[#7EA9CD]" :
                      "to-[#BFA9FF]/30 border-[#BFA9FF]/40 text-[#7C59E6]"
                    }`}
                  >
                    
                    {/* Header info */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center space-x-2">
                        <Feather className="w-4 h-4" />
                        <span className="text-xs font-serif italic text-neutral-500">{currentAffirmation.subtitle}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          id="copy-affirmation-btn"
                          onClick={handleCopy}
                          className="p-2 rounded-xl bg-white/40 dark:bg-neutral-900/20 hover:bg-white/60 text-neutral-500 dark:hover:text-white cursor-pointer transition-all"
                          title="Copy Affirmation"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          id="save-affirmation-btn"
                          onClick={() => onSaveAffirmation(currentAffirmation)}
                          disabled={isAlreadySaved}
                          className={`p-2 rounded-xl bg-white/40 dark:bg-neutral-900/20 hover:bg-white/60 cursor-pointer transition-all ${
                            isAlreadySaved ? "text-amber-500" : "text-neutral-500 dark:hover:text-white"
                          }`}
                          title={isAlreadySaved ? "Alreayd Saved" : "Save Favorite"}
                        >
                          <Star className={`w-4 h-4 ${isAlreadySaved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Poetic Core Text */}
                    <blockquote className="text-xl md:text-2xl font-serif tracking-wide leading-relaxed italic text-neutral-800 dark:text-white mb-8 border-l-4 border-[#BFA9FF]/35 pl-4">
                      "{currentAffirmation.text}"
                    </blockquote>

                    {/* Somatic Mini suggestions */}
                    <div className="space-y-4 bg-white/50 dark:bg-[#120F22]/30 p-4.5 rounded-2xl border border-white/20 select-none">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">RECOMMENDED PHYSIO_SOMATIC ACTIONS:</p>
                      
                      <div className="space-y-3">
                        {currentAffirmation.wellnessPoints ? currentAffirmation.wellnessPoints.map((pt, i) => (
                          <div key={i} className="flex items-start space-x-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BFA9FF] mt-1.5" />
                            <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">{pt}</p>
                          </div>
                        )) : (
                          <p className="text-xs text-neutral-500">Breathing cycles recommended.</p>
                        )}
                      </div>

                      {currentAffirmation.ritual && (
                        <div className="border-t border-neutral-200/10 pt-3 mt-1 text-[11px] text-[#BFA9FF] dark:text-[#DCCBFF] font-serif italic">
                          <span>🔮 Ritual Anchor — {currentAffirmation.ritual}</span>
                        </div>
                      )}
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-8 bg-dashed border-2 border-neutral-300/20 rounded-3xl text-center text-neutral-400"
                  >
                    <Feather className="w-12 h-12 text-[#DCCBFF]/60 mb-4 animate-pulse" />
                    <h4 className="text-lg font-serif italic text-neutral-500 mb-2">Sound of silence</h4>
                    <p className="text-xs max-w-sm">Select a category on the left, type what is on your mind, and select 'Whispered Affirmation' to summon your reflection.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="saved-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full"
          >
            {savedAffirmations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedAffirmations.map((aff, i) => (
                  <div
                    key={i}
                    id={`saved-aff-${i}`}
                    className="p-6 rounded-2xl bg-white/40 dark:bg-[#120F22]/40 border border-white/20 hover:shadow-lg transition-all relative flex flex-col justify-between"
                  >
                    <blockquote className="text-sm font-serif italic text-neutral-800 dark:text-neutral-300 leading-relaxed mb-6">
                      "{aff.text}"
                    </blockquote>
                    <div className="flex justify-between items-center border-t border-neutral-200/10 pt-3">
                      <span className="text-[10px] font-serif uppercase tracking-wider text-[#BFA9FF]">{aff.subtitle}</span>
                      <button
                        id={`delete-saved-aff-${i}`}
                        onClick={() => onDeleteAffirmation(aff.text)}
                        className="text-[10px] font-mono text-rose-500 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-neutral-400">
                <Star className="w-10 h-10 mx-auto mb-4 animate-bounce" />
                <p className="text-xs">No loved reflections saved yet. Pin your favorites to build your sanctuary book.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
