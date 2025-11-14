import { useState, useEffect, useCallback, useRef } from 'react';
import type { PageContext } from '@/types';
import type { ChatConversation, ChatMessage, UserParams, Strategy, UserPost } from '@/types';
import { useChatStore } from '@/store/chatStore';
import { generateChatTitle, generateSignalFunctionDeclaration, generateScalpingSignalFunctionDeclaration, createStrategyFunctionDeclaration, createPostFunctionDeclaration, SYSTEM_INSTRUCTION, summarizeNewsFunctionDeclaration, getLivePnlFunctionDeclaration, setPriceAlertFunctionDeclaration, getTutorialContentFunctionDeclaration } from '@/services/chatService';
import { MOCK_ANALYZED_NEWS } from '@/store/newsStore';
import { tutorialsData } from '@/data/tutorialData';

export function useChat(
  context: PageContext,
  triggerSignalGeneration: (params: Partial<UserParams>) => void,
  triggerScalpGeneration: (params: Partial<UserParams>) => void,
  createStrategy: (strategyData: Omit<Strategy, 'id' | 'createdAt' | 'authorUsername'>) => void,
  createPost: (postData: Omit<UserPost, 'id' | 'createdAt' | 'likedBy' | 'repostedBy' | 'commentCount' | 'comments' | 'author' | 'attachedSignalId' | 'attachedTradeIdea'>) => void,
  setToast: (toast: { message: string; variant: 'success' | 'warning' | 'error' } | null) => void
) {
  const {
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    clearAllConversations,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(false);

  const startNewConversation = useCallback(() => {
    const newConvo: ChatConversation = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setConversations(prev => [newConvo, ...prev]);
    setCurrentConversationId(newConvo.id);
  }, [setConversations, setCurrentConversationId]);

  // Auto-select a conversation or create a new one
  useEffect(() => {
    if (!currentConversationId && conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    } else if (conversations.length === 0) {
      startNewConversation();
    }
  }, [conversations, currentConversationId, setCurrentConversationId, startNewConversation]);

  const currentConversation = conversations.find(c => c.id === currentConversationId) || null;


  const updateConversation = useCallback((id: string, updates: Partial<ChatConversation> | ((c: ChatConversation) => Partial<ChatConversation>)) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === id) {
          const newUpdates = typeof updates === 'function' ? updates(c) : updates;
          return { ...c, ...newUpdates };
        }
        return c;
      })
    );
  }, [setConversations]);
  
  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, [setCurrentConversationId]);

  const renameConversation = useCallback((id: string, newTitle: string) => {
      if (newTitle.trim()) {
          updateConversation(id, { title: newTitle.trim() });
      }
  }, [updateConversation]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const newConversations = prev.filter(c => c.id !== id);
      if (currentConversationId === id) {
        setCurrentConversationId(newConversations[0]?.id || null);
      }
      return newConversations;
    });
  }, [setConversations, currentConversationId, setCurrentConversationId]);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!currentConversationId) return;

    let fullPrompt = prompt;
    if (context.contextualChatEnabled && context.signal && (context.page === 'signal-gen' || context.page === 'scalping')) {
        const contextHeader = `---
CONTEXT: The user is currently viewing the following trading signal on the "${context.page}" page. Use this data to answer their question.
SIGNAL DATA:
${JSON.stringify(context.signal, null, 2)}

USER PARAMETERS USED FOR SIGNAL:
${JSON.stringify(context.params, null, 2)}
---

USER QUESTION:
`;
        fullPrompt = `${contextHeader}"${prompt}"`;
    }

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const placeholderModelMessage: ChatMessage = { role: 'model', content: '...' };
    const isFirstUserMessage = currentConversation?.messages.length === 0;

    updateConversation(currentConversationId, c => ({ messages: [...c.messages, userMessage, placeholderModelMessage] }));
    setIsLoading(true);

    try {
      // Prepare the messages to send to the backend
      // Include the current conversation history plus the new user message
      const messagesToSend = [...(currentConversation?.messages || []), userMessage];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend,
          context,
          functionCallingEnabled: context.functionCallingEnabled,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get chat response');
      }

      const data = await response.json();
      const { response: aiResponse, functionCalls } = data;

      // Update the placeholder message with the AI response
      updateConversation(currentConversationId, c => {
        const newMessages = [...c.messages];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].content = aiResponse;
        }
        return { messages: newMessages };
      });

      // Handle any function calls that require frontend actions
      if (functionCalls && functionCalls.length > 0) {
        for (const funcCall of functionCalls) {
          const { name, response } = funcCall;
          // Extract the actual function name from "ACTION_NEEDED: functionName" format
          const actualFunctionName = name.replace('ACTION_NEEDED: ', '');
          const functionArgs = response.functionArgs;

          switch (actualFunctionName) {
            case 'generateSignal':
              triggerSignalGeneration(functionArgs as Partial<UserParams>);
              break;
            case 'generateScalpingSignal':
              triggerScalpGeneration(functionArgs as Partial<UserParams>);
              break;
            case 'createStrategy':
              createStrategy(functionArgs as Omit<Strategy, 'id' | 'createdAt' | 'authorUsername'>);
              break;
            case 'createPost':
              createPost(functionArgs as Pick<UserPost, 'content'>);
              break;
            case 'setPriceAlert':
              const { symbol, price } = functionArgs;
              setToast({ message: `Price alert set for ${symbol} at $${price}`, variant: 'success' });
              break;
          }
        }
      }

      if (isFirstUserMessage) {
        generateChatTitle(prompt).then(newTitle => {
          if (newTitle) updateConversation(currentConversationId, { title: newTitle });
        });
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      let friendlyMessage = "Sorry, an unexpected error occurred. Please try again later.";
      const errorMessage = error.message?.toLowerCase() || '';

      if (errorMessage.includes('api_key')) {
        friendlyMessage = "There seems to be an issue with the API configuration. Please ensure everything is set up correctly.";
      } else if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
        friendlyMessage = "The response was blocked due to safety settings. Please try rephrasing your prompt.";
      } else if (errorMessage.includes('network') || errorMessage.includes('failed to fetch')) {
        friendlyMessage = "It seems I'm having trouble connecting to the network. Please check your connection and try again.";
      } else if (error.status >= 500) {
        friendlyMessage = "The AI service is currently unavailable. Please try again in a few moments.";
      } else if (error.status >= 400) {
         friendlyMessage = "The AI model couldn't process that request. Please try again or rephrase your question.";
      }

      updateConversation(currentConversationId, c => {
        const newMessages = [...c.messages];
        if (newMessages.length > 0) {
          newMessages[newMessages.length - 1].content = friendlyMessage;
        }
        return { messages: newMessages };
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, currentConversation, updateConversation, triggerSignalGeneration, triggerScalpGeneration, createStrategy, createPost, context, setToast]);
  

  const editMessageAndResend = useCallback(async (messageIndex: number, newContent: string) => {
    if (!currentConversationId || !currentConversation) return;

    const userMessageToEdit = currentConversation.messages[messageIndex];
    if (userMessageToEdit?.role !== 'user') return;

    const historyToResend = currentConversation.messages.slice(0, messageIndex);
    const updatedUserMessage: ChatMessage = { ...userMessageToEdit, content: newContent };
    
    const newConvo: ChatConversation = {
      id: crypto.randomUUID(),
      title: 'Edited Chat',
      messages: [...historyToResend, updatedUserMessage],
      createdAt: Date.now(),
    };
    
    setConversations(prev => [newConvo, ...prev]);
    setCurrentConversationId(newConvo.id);

    setTimeout(() => {
        sendMessage(newContent);
    }, 100);

  }, [currentConversationId, currentConversation, setConversations, setCurrentConversationId, sendMessage]);
  

  return {
    conversations,
    currentConversation,
    isLoading,
    selectConversation,
    startNewConversation,
    sendMessage,
    renameConversation,
    deleteConversation,
    editMessageAndResend,
    clearAllConversations,
  };
}