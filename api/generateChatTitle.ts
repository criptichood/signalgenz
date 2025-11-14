import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { prompt }: { prompt: string } = req.body;

        // Validation
        if (!prompt) {
            return res.status(400).json({ message: 'Missing required parameter: prompt' });
        }

        // Validate prompt length to prevent abuse
        if (prompt.length > 2000) {
            return res.status(400).json({ message: 'Prompt is too long' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const titlePrompt = `Generate a very short, concise title (max 5 words) for the following user query. Only return the title text, nothing else. Do not use quotes. Query: "${prompt}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: titlePrompt,
        });

        // Clean up response to remove potential quotes or extra text
        const text = response.text?.trim();
        const cleanTitle = text ? text.replace(/^"|"$/g, '') : prompt.length > 30 ? prompt.substring(0, 27) + '...' : prompt;

        res.status(200).json({ title: cleanTitle });

    } catch (error: any) {
        console.error("Error in /api/generateChatTitle:", error);
        // Don't expose internal error details to the client unless in development
        const errorMessage = process.env.NODE_ENV === 'development'
            ? error.message
            : 'An internal server error occurred.';
        res.status(500).json({ message: errorMessage });
    }
}