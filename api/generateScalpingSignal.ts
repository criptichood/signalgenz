import { GoogleGenAI, Type } from "@google/genai";
import type { CandleStick, Signal, UserParams, Timeframe, OrderBookUpdate, LiveTrade } from "@/types";
import { SCALPING_KNOWLEDGE_CONTEXT } from "./ai-prompts";
import * as exchangeService from '@/services/exchangeService';

// This function will be deployed as a Vercel Serverless Function
export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { params, orderBookData, liveTrades }: { params: UserParams, orderBookData: OrderBookUpdate | null, liveTrades: LiveTrade[] } = req.body;

        // Basic validation to ensure required fields exist
        if (!params || !params.symbol || !params.timeframe || !params.model) {
            return res.status(400).json({ message: 'Missing required parameters: symbol, timeframe, or model' });
        }

        // Validate symbol format (basic check)
        if (!/^[A-Z0-9]{2,10}[A-Z0-9]{3,5}$/.test(params.symbol)) {
            return res.status(400).json({ message: 'Invalid symbol format' });
        }

        // Validate timeframe for scalping (narrower timeframes)
        const validTimeframes: Timeframe[] = ['1m', '3m', '5m', '15m', '30m', '1h'];
        if (!validTimeframes.includes(params.timeframe)) {
            return res.status(400).json({ message: 'Invalid timeframe for scalping' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const allTimeframes: Timeframe[] = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '1d', '1w'];
        const getHtfForScalp = (ltf: Timeframe): Timeframe => {
            const currentIndex = allTimeframes.indexOf(ltf);
            return currentIndex < allTimeframes.length - 1 ? allTimeframes[currentIndex + 1] : allTimeframes[allTimeframes.length - 1];
        };

        const htfTimeframe = getHtfForScalp(params.timeframe as Timeframe);

        const [ltfMarketData, htfMarketData] = await Promise.all([
            exchangeService.fetchData(params.exchange, params.symbol, params.timeframe, 150),
            exchangeService.fetchData(params.exchange, params.symbol, htfTimeframe, 100),
        ]);

        const livePrice = ltfMarketData.length > 0 ? ltfMarketData[ltfMarketData.length - 1].close : 0;
        if (livePrice === 0) {
            throw new Error("Could not determine current price from market data.");
        }

        const prompt = buildScalpingPrompt(params, ltfMarketData, htfMarketData, livePrice, orderBookData, liveTrades);
        const responseSchema = getResponseSchema();

        const response = await ai.models.generateContent({
            model: params.model,
            contents: prompt,
            config: {
                systemInstruction: SCALPING_KNOWLEDGE_CONTEXT,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const textResponse = response.text?.trim();
        if (!textResponse) {
            throw new Error("AI returned an empty response for scalping signal generation.");
        }
        const parsed = JSON.parse(textResponse);

        const signal: Signal = { ...parsed, tradeDuration: parsed.predictedMoveDuration };
        // @ts-ignore
        delete signal.predictedMoveDuration;

        if (!signal.direction || !signal.entryRange || !signal.takeProfit || !signal.stopLoss) {
            throw new Error("Received malformed signal object from AI.");
        }

        res.status(200).json(signal);

    } catch (error: any) {
        console.error("Error in /api/generateScalpingSignal:", error);
        // Don't expose internal error details to the client unless in development
        const errorMessage = process.env.NODE_ENV === 'development'
            ? error.message
            : 'An internal server error occurred.';
        res.status(500).json({ message: errorMessage });
    }
}


function buildScalpingPrompt(params: UserParams, ltfMarketData: CandleStick[], htfMarketData: CandleStick[], livePrice: number, orderBookData: OrderBookUpdate | null, liveTrades: LiveTrade[]): string {
    return `
        Analyze the following market data for a scalping opportunity.

        **HTF Context (Last 100 candles):**
${JSON.stringify(htfMarketData, null, 2)}
        **LTF Execution (Last 150 candles):**
${JSON.stringify(ltfMarketData, null, 2)}
        **Real-Time Data:**
        - Order Book Snapshot:
${orderBookData ? JSON.stringify(orderBookData, null, 2) : 'Not available.'}
        - Recent Trades:
${liveTrades.length > 0 ? JSON.stringify(liveTrades, null, 2) : 'Not available.'}

        **Parameters & Task:**
        - Symbol: ${params.symbol}
        - Price: ${livePrice}
        - Allow High Leverage: ${params.allowHighLeverage}
        ${params.tradingStyle ? `- Preferred Trading Style: ${params.tradingStyle}` : ''}
        - Task: Predict the next immediate price move. Provide a setup in the specified JSON format.
    `;
}

function getResponseSchema() {
    return {
        type: Type.OBJECT,
        properties: {
            direction: { type: Type.STRING }, entryRange: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            takeProfit: { type: Type.ARRAY, items: { type: Type.NUMBER } }, stopLoss: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER }, rrRatio: { type: Type.NUMBER }, leverage: { type: Type.NUMBER },
            predictedMoveDuration: { type: Type.STRING }, reasoning: { type: Type.STRING },
            biasSource: { type: Type.STRING, enum: ["Predictive"] }, predictionMode: { type: Type.BOOLEAN },
            biasSummary: {
                type: Type.OBJECT,
                properties: {
                    shortTerm: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"] },
                    midTerm: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"] },
                    longTerm: { type: Type.STRING, enum: ["Bullish", "Bearish", "Neutral"] },
                },
                required: ["shortTerm", "midTerm", "longTerm"]
            },
        },
        required: ["direction", "entryRange", "takeProfit", "stopLoss", "confidence", "rrRatio", "leverage", "predictedMoveDuration", "reasoning", "biasSource", "predictionMode", "biasSummary"]
    };
}