export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  rating: number; // 1 to 5 (1: Deeply Fatigued/Anxious, 2: Unbalanced, 3: Centered, 4: Radiant, 5: Ecstatic/Grounded)
  note: string;
  tags: string[];
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  history: string[]; // dates of completion YYYY-MM-DD
  icon: string; // Lucide icon name
  frequency: "daily" | "weekly";
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date
  category: "Gratitude" | "Reflection" | "Dreams" | "Mindfulness" | "Brain-dump";
  moodRating?: number;
}

export interface Goal {
  id: string;
  text: string;
  category: "daily" | "weekly";
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export interface Affirmation {
  text: string;
  subtitle: string;
  accentColor: string; // pink, purple, blue, lavender, cream
  wellnessPoints: string[];
  ritual: string;
}

export interface Quote {
  text: string;
  author: string;
  category: string;
}

export interface FocusSession {
  id: string;
  date: string;
  durationMinutes: number;
  type: "work" | "meditate" | "breath";
  completed: boolean;
}
