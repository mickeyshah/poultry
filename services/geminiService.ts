
import { GoogleGenAI, Type } from "@google/genai";
import { MarketInsight } from "../types";

export const getMarketAdvice = async (itemName: string, buyPrice: number): Promise<MarketInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide market pricing advice for a trader who bought ${itemName} at $${buyPrice}. 
      Suggest a competitive selling price and explain why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedSellingPrice: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            marketTrend: { 
              type: Type.STRING,
              enum: ['UP', 'DOWN', 'STABLE']
            }
          },
          required: ["suggestedSellingPrice", "reasoning", "marketTrend"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as MarketInsight;
  } catch (error) {
    console.error("Gemini Market Advice Error:", error);
    // Fallback logic
    return {
      suggestedSellingPrice: buyPrice * 1.2,
      reasoning: "Standard 20% markup applied (Market data unavailable).",
      marketTrend: 'STABLE'
    };
  }
};
