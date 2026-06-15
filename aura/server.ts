import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const isApiKeyConfigured = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

let ai: GoogleGenAI | null = null;
if (isApiKeyConfigured) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Aura AI Gemini Client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY detected. Aura will run in elegant offline curated mode.");
}

// Fallback high-fidelity affirmations for offline or unconfigured API state
const FALLBACK_AFFIRMATIONS = [
  {
    text: "Your mind is a sanctuary. In this very moment, there is nowhere else you need to be, nothing else you need to do. Only breathe, and recognize your innate wholeness.",
    subtitle: "A silent whisper of peace",
    accentColor: "lavender",
    wellnessPoints: [
      "Inhale fully, expanding your chest, and release the breath with a soft sigh.",
      "Softly drop your shoulders away from your ears and let go of any tension in your forehead.",
      "Take a slow sip of of cool or warm water, tasting it with undivided attention."
    ],
    ritual: "The Space Between Breaths: Gently pause at the end of your next exhale for three golden seconds of stillness."
  },
  {
    text: "True productivity is not a race of exhaustion; it is an elegant flow of aligned actions. Protect your energy, focus with conviction, and honor your pace.",
    subtitle: "Alignment over speed",
    accentColor: "blue",
    wellnessPoints: [
      "Close all browsers tabs that do not serve your current singular task.",
      "Stand up, stretch your hands to the sky, and gently look at the furthest visible point out a window.",
      "Write down exactly one single goal for the next 25 minutes. Let everything else fade."
    ],
    ritual: "The Singular Eye: Commit to doing just one task with undivided luxury of absolute presence."
  },
  {
    text: "Your creativity is an endless ocean awaiting the quiet mind. Do not force the waves; rest in the depths where original thoughts reside.",
    subtitle: "Inspired deep water",
    accentColor: "pink",
    wellnessPoints: [
      "Doodle freeform on a scratch piece of paper for two minutes without judging any line.",
      "Listen to an instrumental piece of ambient music with your eyes fully closed.",
      "Notice three distinct colors in your immediate surroundings that you typically ignore."
    ],
    ritual: "The Blank Page Gift: Allow yourself five draft minutes to make mistake-rich, delightful, unchecked ideas."
  },
  {
    text: "Strength isn't about rigid resistance; it is the supple reed that bends, flows, and stands tall after the storm. You are resilient, adaptive, and fully capable.",
    subtitle: "Gentle rooted resilience",
    accentColor: "purple",
    wellnessPoints: [
      "Place your hands over your heart and feel its steady, silent work on your behalf.",
      "Recall one challenge you overcame this past year. Breathe in that quiet competence.",
      "Stretch your spine high, feeling your feet firm and flat on the ground. You are anchored."
    ],
    ritual: "The Rooting Touch: Touch any physical object with attention, focusing solely on the pure texture and weight of it."
  }
];

// Server-side AI Affirmation endpoint
app.post("/api/affirmation", async (req, res) => {
  const { mood, category, customFocus } = req.body;

  if (!ai) {
    // If Gemini is unconfigured, return a random beautiful fallback, customized by category if possible
    let fallback = FALLBACK_AFFIRMATIONS[0];
    if (category === "productivity") fallback = FALLBACK_AFFIRMATIONS[1];
    else if (category === "creativity") fallback = FALLBACK_AFFIRMATIONS[2];
    else if (mood === "anxious" || mood === "tired") fallback = FALLBACK_AFFIRMATIONS[3];
    else {
      fallback = FALLBACK_AFFIRMATIONS[Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length)];
    }

    if (customFocus) {
      // Intelligently brand it with their custom focus for a highly personalized fallback feel
      return res.json({
        ...fallback,
        text: `As you focus on "${customFocus}": ${fallback.text}`,
        subtitle: `Customized for your aspiration`
      });
    }
    return res.json(fallback);
  }

  try {
    const prompt = `Generate a modern, luxurious, deeply calming, and poetic mindfulness affirmation for our user:
Mood: ${mood || "neutral"}
Focus Category: ${category || "general wellness"}
${customFocus ? `Specific Intended focus / challenge: "${customFocus}"` : ""}

Please tailor the affirmation specifically to their state. Do not use cliché sentences or overly commercial mindfulness jargon. Make it sound like a premium quote from a world-class luxury wellness guide (like Headspace or Apple Wellness).

You MUST return a JSON object containing exactly these fields (strictly conforming to the specified format):
{
  "text": "A poetic, deeply resonant and beautiful affirmation of 2-3 sentences. It should feel deeply personal and highly encouraging.",
  "subtitle": "A short, poetic subtitle (3-6 words) describing this state of mind.",
  "accentColor": "One of: 'pink', 'purple', 'blue', 'lavender', or 'cream' that visually matches this mood/theme.",
  "wellnessPoints": [
    "A physical, sensory wellness micro-recommendation (e.g. drop shoulders, stretch, close eyes)",
    "An environment-focused wellness action (e.g. tidy desk, listen to wind, look at distant green)",
    "A mindful awareness task (e.g. scan body for tight spots, note current sounds)"
  ],
  "ritual": "A structured 1-minute sensory ritual with a poetic name."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Direct poetic affirmation text." },
            subtitle: { type: Type.STRING, description: "A elegant short phrase/caption." },
            accentColor: { type: Type.STRING, description: "One of: pink, purple, blue, lavender, cream." },
            wellnessPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 distinct, highly descriptive, actionable mindfulness or physical micro-tasks."
            },
            ritual: { type: Type.STRING, description: "A simple, beautifully named 1-minute mindfulness ritual description." }
          },
          required: ["text", "subtitle", "accentColor", "wellnessPoints", "ritual"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error) {
    console.error("Gemini affirmation generation error:", error);
    // Return high-quality fallback on error rather than a raw message to maintain luxurious user experience
    const defaultFallback = FALLBACK_AFFIRMATIONS[Math.floor(Math.random() * FALLBACK_AFFIRMATIONS.length)];
    return res.json(defaultFallback);
  }
});

// Setup development or production build flows
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for real-time asset compilation
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aura Server beautifully broadcasting live on port ${PORT}`);
  });
}

startServer();
