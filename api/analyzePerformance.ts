import { GoogleGenAI } from "@google/genai";
import type { PerpTrade, SpotTrade } from "@/types";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { perpTrades, spotTrades }: { perpTrades: PerpTrade[], spotTrades: SpotTrade[] } = req.body;

        // Validation - perpTrades and spotTrades should be arrays
        if (!Array.isArray(perpTrades) || !Array.isArray(spotTrades)) {
            return res.status(400).json({ message: 'perpTrades and spotTrades must be arrays' });
        }

        // Validate array lengths to prevent abuse
        if (perpTrades.length > 1000 || spotTrades.length > 1000) {
            return res.status(400).json({ message: 'Trade arrays are too large' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const recentPerpTrades = perpTrades.filter(t => t.status === 'Closed').slice(0, 50);
        const recentSpotTrades = spotTrades.slice(0, 50);

        const prompt = `
            You are a professional trading coach. Analyze the provided trading history to identify patterns, strengths, and weaknesses. Provide actionable advice for improvement.

            **User's Perpetual Futures Trades (last 50 closed):**
            ${JSON.stringify(recentPerpTrades, ['symbol', 'side', 'pnl', 'pnlPercentage', 'entryDate', 'exitDate'], 2)}

            **User's Spot Trades (last 50):**
            ${JSON.stringify(recentSpotTrades, ['symbol', 'side', 'price', 'quantity', 'total', 'date'], 2)}

            **Your Task:**
            Provide a concise performance review in markdown format with sections: "Overall Summary", "Strengths", "Areas for Improvement", and "Actionable Advice". Be constructive and encouraging.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a helpful and insightful trading coach who provides clear, structured analysis of a user's trade history.",
            },
        });

        const textResponse = response.text?.trim() || "No analysis available";
        res.status(200).json({ analysis: textResponse });

    } catch (error: any) {
        console.error("Error in /api/analyzePerformance:", error);
        // Don't expose internal error details to the client unless in development
        const errorMessage = process.env.NODE_ENV === 'development'
            ? error.message
            : 'An internal server error occurred.';
        res.status(500).json({ message: errorMessage });
    }
}
