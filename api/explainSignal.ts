import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { symbol, reasoning }: { symbol: string, reasoning: string } = req.body;

        // Validation
        if (!symbol || !reasoning) {
            return res.status(400).json({ message: 'Missing required parameters: symbol or reasoning' });
        }

        // Validate symbol format (basic check)
        if (!/^[A-Z0-9]{2,10}[A-Z0-9]{3,5}$/.test(symbol)) {
            return res.status(400).json({ message: 'Invalid symbol format' });
        }

        // Validate reasoning length to prevent abuse
        if (reasoning.length > 20000) {
            return res.status(400).json({ message: 'Reasoning is too long' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
            As a trading educator, explain the concepts mentioned in the following trade analysis for ${symbol}.
            Break down terms like Market Structure, Liquidity, Fair Value Gaps, or Order Blocks if they are mentioned.
            Keep the explanation clear, educational, and targeted at an intermediate trader.
            Format your response for readability in a plain text/markdown view using paragraphs and bullet points where appropriate.

            Original Analysis:
            ---
            ${reasoning}
            ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a helpful and insightful trading analyst who excels at explaining complex topics simply.",
            },
        });

        const textResponse = response.text?.trim() || "No explanation available";
        res.status(200).json({ explanation: textResponse });

    } catch (error: any) {
        console.error("Error in /api/explainSignal:", error);
        // Don't expose internal error details to the client unless in development
        const errorMessage = process.env.NODE_ENV === 'development'
            ? error.message
            : 'An internal server error occurred.';
        res.status(500).json({ message: errorMessage });
    }
}
