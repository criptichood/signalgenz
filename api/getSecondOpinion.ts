import { GoogleGenAI, Type } from "@google/genai";
import type { TradeIdea, AIFeedback, CandleStick } from "@/types";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { tradeIdea, marketData }: { tradeIdea: TradeIdea, marketData: CandleStick[] } = req.body;

        // Validation
        if (!tradeIdea || !marketData) {
            return res.status(400).json({ message: 'Missing required parameters: tradeIdea or marketData' });
        }

        // Validate tradeIdea fields
        if (!tradeIdea.symbol || !tradeIdea.timeframe || !tradeIdea.direction ||
            tradeIdea.entry === undefined || tradeIdea.takeProfit === undefined ||
            tradeIdea.stopLoss === undefined) {
            return res.status(400).json({ message: 'Trade idea is missing required fields' });
        }

        // Validate symbol format (basic check)
        if (!/^[A-Z0-9]{2,10}[A-Z0-9]{3,5}$/.test(tradeIdea.symbol)) {
            return res.status(400).json({ message: 'Invalid symbol format' });
        }

        // Validate marketData array length to prevent abuse
        if (marketData.length > 200) {
            return res.status(400).json({ message: 'Market data array is too large' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const systemInstruction = `You are an AI trading co-pilot. Your task is to analyze a user-provided trade idea against the current market data. You must provide a confidence score, a balanced rationale (pros and cons), and optionally, suggest refinements. Be objective and focus on risk and probability. Do not generate a new trade idea; only analyze the one provided.`;

        const prompt = `
            Please analyze the following user-defined trade idea for ${tradeIdea.symbol} on the ${tradeIdea.timeframe} timeframe.

            **User's Trade Idea:**
            - Direction: ${tradeIdea.direction}
            - Entry Price: ${tradeIdea.entry}
            - Take Profit: ${tradeIdea.takeProfit}
            - Stop Loss: ${tradeIdea.stopLoss}

            **Current Market Data (Last 150 candles on ${tradeIdea.timeframe}):**
            ${JSON.stringify(marketData.slice(-150), null, 2)}

            **Your Task:**
            Based on the market data, provide your analysis of the user's idea in the specified JSON format.
        `;

        const secondOpinionSchema = {
            type: Type.OBJECT,
            properties: {
                confidence: { type: Type.NUMBER, description: "Your confidence score (0-100) in the user's provided trade idea." },
                rationale: { type: Type.STRING, description: "A concise analysis of the user's trade idea (pros and cons)." },
                refinements: { type: Type.STRING, description: "Optional: Suggest one or two specific, actionable improvements." }
            },
            required: ["confidence", "rationale"]
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: secondOpinionSchema,
            },
        });

        const textResponse = response.text?.trim();
        if (!textResponse) {
            throw new Error("AI returned an empty response for second opinion.");
        }
        const parsed = JSON.parse(textResponse) as AIFeedback;

        if (typeof parsed.confidence !== 'number' || !parsed.rationale) {
            throw new Error("Received malformed second opinion from AI.");
        }

        res.status(200).json(parsed);

    } catch (error: any) {
        console.error("Error in /api/getSecondOpinion:", error);
        // Don't expose internal error details to the client unless in development
        const errorMessage = process.env.NODE_ENV === 'development'
            ? error.message
            : 'An internal server error occurred.';
        res.status(500).json({ message: errorMessage });
    }
}
