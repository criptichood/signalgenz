import type { Signal, UserParams, PerpTrade, SpotTrade, TradeIdea, AIFeedback, OrderBookUpdate, LiveTrade, ScreenerResult, CandleStick, Timeframe } from "@/types";

/**
 * Generates a swing trading signal by calling the backend API route.
 */
export async function generateSignal(params: UserParams): Promise<Signal> {
    const response = await fetch('/api/generateSignal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate signal');
    }

    const signal: Signal = await response.json();
    return signal;
}

/**
 * Generates a scalping signal by calling the backend API route.
 */
export async function generateScalpingSignal(params: UserParams, _: CandleStick[], __: CandleStick[], orderBookData: OrderBookUpdate | null, liveTrades: LiveTrade[]): Promise<Signal> {
    const response = await fetch('/api/generateScalpingSignal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ params, orderBookData, liveTrades }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate scalping signal');
    }

    const signal: Signal = await response.json();
    return signal;
}

/**
 * Gets a second opinion on a trade idea from the backend API route.
 */
export async function getSecondOpinion(tradeIdea: TradeIdea, marketData: CandleStick[]): Promise<AIFeedback> {
    const response = await fetch('/api/getSecondOpinion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tradeIdea, marketData }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get second opinion');
    }

    const feedback: AIFeedback = await response.json();
    return feedback;
}

/**
 * Generates an explanation for a signal from the backend API route.
 */
export async function explainSignal(symbol: string, reasoning: string): Promise<string> {
    const response = await fetch('/api/explainSignal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, reasoning }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to explain signal');
    }

    const data = await response.json();
    return data.explanation || "No explanation available";
}

/**
 * Analyzes trading performance using the backend API route.
 */
export async function analyzeTradingPerformance(perpTrades: PerpTrade[], spotTrades: SpotTrade[]): Promise<string> {
    const response = await fetch('/api/analyzePerformance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ perpTrades, spotTrades }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze performance');
    }

    const data = await response.json();
    return data.analysis || "No analysis available";
}

/**
 * Runs the market screener using the backend API route.
 */
export async function runMarketScreener(query: string): Promise<ScreenerResult[]> {
    const response = await fetch('/api/runScreener', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to run market screener');
    }

    const results: ScreenerResult[] = await response.json();
    return results;
}