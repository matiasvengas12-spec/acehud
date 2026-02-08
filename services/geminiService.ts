
import { GoogleGenAI, Type } from "@google/genai";
import { PlayerStats } from "../types";

export const analyzePlayerWithAI = async (stats: PlayerStats): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this poker player based on their stats and provide a 2-sentence tactical summary on how to exploit them.
    Player: ${stats.Player}
    VPIP: ${stats.VPIP}%
    PFR: ${stats.PFR}%
    3Bet: ${stats["3Bet Total"]}%
    Fold to 3Bet: ${stats["Fold to 3Bet"]}%
    WWSF: ${stats.WWSF}%
    W$SD: ${stats["W$SD"]}%
    Hands: ${stats["Hands Abbr"]}
    
    Format the response as clear, actionable advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Could not analyze player at this moment.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI analysis unavailable. Ensure API key is configured.";
  }
};
