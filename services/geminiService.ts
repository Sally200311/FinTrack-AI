import { GoogleGenAI } from "@google/genai";
import { Stock } from "../types";

const initGemini = () => {
  // Use process.env.API_KEY as per Google GenAI SDK guidelines.
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const fetchLatestStockPrices = async (stocks: Stock[]): Promise<Partial<Stock>[]> => {
  const ai = initGemini();
  if (stocks.length === 0) return [];

  const symbols = stocks.map(s => s.symbol).join(", ");
  
  // Prompt engineering to get JSON output via Search Grounding
  const prompt = `
    I need the latest market price for the following stock symbols: ${symbols}.
    
    Please use Google Search to find the most recent closing price or real-time price.
    
    Return the data strictly as a JSON array inside a markdown code block (\`\`\`json ... \`\`\`).
    The JSON objects should have these properties:
    - "symbol": string (the symbol requested)
    - "price": number (the numeric price value only)
    - "currency": string (e.g., "TWD", "USD")
    
    Do not include any other text outside the code block.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType is NOT allowed with googleSearch, so we rely on prompt engineering
      },
    });

    const text = response.text;
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (sources) {
        console.log("Stock data sources:", sources);
    }

    const jsonMatch = text?.match(/```json\n([\s\S]*?)\n```/) || text?.match(/```\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsedData = JSON.parse(jsonMatch[1]);
      
      return parsedData.map((item: any) => ({
        symbol: item.symbol,
        currentPrice: item.price,
        currency: item.currency, 
      }));
    } else {
        try {
            const rawParse = JSON.parse(text || "[]");
            if (Array.isArray(rawParse)) return rawParse;
        } catch (e) {
            console.warn("Could not parse Gemini response as JSON", text);
        }
    }
    
    return [];

  } catch (error) {
    console.error("Error fetching stock prices with Gemini:", error);
    return [];
  }
};