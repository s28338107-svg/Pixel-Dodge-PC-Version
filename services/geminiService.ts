
import { GoogleGenAI, Type } from "@google/genai";
import { Quest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchHourlyQuests(): Promise<Quest[]> {
  const currentHour = new Date().getHours();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 unique pixel game quests for the current hour (${currentHour}:00).
      Types available: 'score' (achieve score), 'survival' (survive seconds), 'games_played' (count).
      Keep descriptions short, funny, and arcade-style.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              target: { type: Type.NUMBER },
              type: { type: Type.STRING, description: "score, survival, or games_played" },
            },
            required: ["id", "title", "description", "target", "type"]
          }
        }
      }
    });

    const quests = JSON.parse(response.text) as any[];
    return quests.map(q => ({
      ...q,
      current: 0,
      completed: false,
      reward: 1
    }));
  } catch (error: any) {
    // If we hit a rate limit, log a cleaner message instead of the full error stack
    if (error?.status === 429 || error?.message?.includes('429')) {
      console.warn("Gemini API rate limit reached (429). Using offline quest pool.");
    } else {
      console.error("Gemini fetch failed:", error);
    }
    
    // Expanded local fallback pool to keep the game fresh
    const fallbackPool: Quest[] = [
      { id: `fb-1-${currentHour}`, title: "Dodge Pro", description: "Score 2,500 points", target: 2500, current: 0, type: "score", reward: 1, completed: false },
      { id: `fb-2-${currentHour}`, title: "Time Warp", description: "Survive for 45 seconds", target: 45, current: 0, type: "survival", reward: 1, completed: false },
      { id: `fb-3-${currentHour}`, title: "Frequent Flyer", description: "Play 3 more games", target: 3, current: 0, type: "games_played", reward: 1, completed: false },
      { id: `fb-4-${currentHour}`, title: "Spike Hater", description: "Score 5,000 points", target: 5000, current: 0, type: "score", reward: 1, completed: false },
      { id: `fb-5-${currentHour}`, title: "Iron Will", description: "Survive 60 seconds", target: 60, current: 0, type: "survival", reward: 1, completed: false }
    ];

    // Pick 3 random quests from the fallback pool for this hour
    return fallbackPool.sort(() => 0.5 - Math.random()).slice(0, 3);
  }
}
