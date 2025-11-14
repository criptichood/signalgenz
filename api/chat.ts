import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage, PageContext } from '@/types';
import { SYSTEM_INSTRUCTION, generateSignalFunctionDeclaration, generateScalpingSignalFunctionDeclaration, createStrategyFunctionDeclaration, createPostFunctionDeclaration, summarizeNewsFunctionDeclaration, getLivePnlFunctionDeclaration, setPriceAlertFunctionDeclaration, getTutorialContentFunctionDeclaration } from '@/services/chatService';
import { MOCK_ANALYZED_NEWS } from '@/store/newsStore';
import { tutorialsData } from '@/data/tutorialData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { messages, context, functionCallingEnabled }: { messages: ChatMessage[], context: PageContext, functionCallingEnabled: boolean } = req.body;

    // Basic validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Invalid messages array' });
    }

    // Validate context - check if it has the necessary properties
    if (typeof context !== 'object') {
      return res.status(400).json({ message: 'Invalid context' });
    }

    // Build the full prompt with context if needed
    const geminiHistory = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: functionCallingEnabled
          ? [{ functionDeclarations: [generateSignalFunctionDeclaration, generateScalpingSignalFunctionDeclaration, createStrategyFunctionDeclaration, createPostFunctionDeclaration, summarizeNewsFunctionDeclaration, getLivePnlFunctionDeclaration, setPriceAlertFunctionDeclaration, getTutorialContentFunctionDeclaration] }]
          : undefined,
      },
      history: geminiHistory
    });

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return res.status(400).json({ message: 'Last message must be from user' });
    }

    // Check if we need to add context to the prompt
    let promptContent = lastMessage.content;
    if (context?.contextualChatEnabled && context?.signal && (context.page === 'signal-gen' || context.page === 'scalping')) {
        const contextHeader = `---
CONTEXT: The user is currently viewing the following trading signal on the "${context.page}" page. Use this data to answer their question.
SIGNAL DATA:
${JSON.stringify(context.signal, null, 2)}

USER PARAMETERS USED FOR SIGNAL:
${JSON.stringify(context.params, null, 2)}
---

USER QUESTION:
`;
        promptContent = `${contextHeader}"${lastMessage.content}"`;
    }

    const response = await chat.sendMessage({ message: promptContent });

    // Extract text content
    let textResponse = response.text?.trim() || '';

    // Check if there are function calls in the response
    const functionCalls = response.functionCalls || [];

    if (functionCalls.length > 0) {
      // Process function calls
      const processedFunctionResults: Array<{ name: string, response: any }> = [];

      for (const fc of functionCalls) {
        let result;

        switch (fc.name) {
          case 'summarizeNews':
            const topic = (fc.args?.topic as string) || '';
            const relevantArticles = MOCK_ANALYZED_NEWS.filter(a =>
              (a.title || '').toLowerCase().includes(topic.toLowerCase()) ||
              (a.description || '').toLowerCase().includes(topic.toLowerCase())
            );
            if (relevantArticles.length > 0) {
              const summary = relevantArticles.slice(0, 3)
                .map(a => `- Title: ${a.title}, Source: ${a.source}, URL: ${a.url}`)
                .join('\n');
              result = {
                result: `I found ${relevantArticles.length} articles about ${topic}. Here are the top ones:\n${summary}`
              };
            } else {
              result = { result: `I couldn't find any recent news about ${topic}.` };
            }
            break;

          case 'getLivePnl':
            result = {
              result: "Based on a mock calculation, your current unrealized P/L across all live positions is +$245.80. This feature is for demonstration purposes as I cannot access live account data."
            };
            break;

          case 'setPriceAlert':
            const symbol = fc.args?.symbol as string;
            const price = fc.args?.price as number;
            result = { result: `I've set a price alert for ${symbol} at $${price}.` };
            break;

          case 'getTutorialContent':
            const tutorialTitle = fc.args?.title as string || '';
            let foundTutorial: (typeof tutorialsData)[keyof typeof tutorialsData][0] | null = null;
            // Search through all categories to find the tutorial
            for (const category in tutorialsData) {
              const tutorial = tutorialsData[category as keyof typeof tutorialsData].find(t => t.title === tutorialTitle);
              if (tutorial) {
                foundTutorial = tutorial;
                break;
              }
            }
            if (foundTutorial && foundTutorial.title && foundTutorial.content) {
              result = {
                result: `Here is the content for "${foundTutorial.title}":\n\n${foundTutorial.content}`
              };
            } else {
              result = {
                result: `I could not find a tutorial with the exact title "${tutorialTitle}". I can still try to answer your question from my general knowledge.`
              };
            }
            break;

          default:
            // For function calls that need frontend action (like generateSignal, createStrategy, etc.),
            // return special instructions for the frontend to handle them
            result = {
              result: `ACTION_NEEDED: ${fc.name}`,
              functionArgs: fc.args
            };
        }

        processedFunctionResults.push({
          name: fc.name,
          response: result
        });
      }

      // If there are function results that need to be sent back to Gemini
      if (processedFunctionResults.some(r => r.response.result && !r.response.result.startsWith('ACTION_NEEDED'))) {
        const toolResponse = await chat.sendMessage({
          message: processedFunctionResults.map(result => ({
            functionResponse: {
              name: result.name,
              response: result.response
            }
          }))
        });

        textResponse = toolResponse.text?.trim() || '';
      }
    }

    res.status(200).json({
      response: textResponse,
      functionCalls: processedFunctionResults.filter(r => r.response.result && r.response.result.startsWith('ACTION_NEEDED')).map(r => ({
        name: r.name,
        response: r.response
      }))
    });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    // Don't expose internal error details to the client unless in development
    const errorMessage = process.env.NODE_ENV === 'development'
      ? error.message
      : 'An internal server error occurred.';
    res.status(500).json({ message: errorMessage });
  }
}