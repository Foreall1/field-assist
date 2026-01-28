"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Conversation, Message } from '@/lib/types';
import { conversationsStorage, generateId } from '@/lib/storage';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  createConversation: (title?: string, projectId?: string) => Conversation;
  selectConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  clearCurrentConversation: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const storedConversations = conversationsStorage.getAll();
    setConversations(storedConversations);

    // Select the most recent conversation if exists
    if (storedConversations.length > 0) {
      setCurrentConversation(storedConversations[0]);
    }

    setIsLoading(false);
  }, []);

  const createConversation = (title?: string, projectId?: string): Conversation => {
    const newConversation: Conversation = {
      id: generateId('conv'),
      title: title || 'Nieuw gesprek',
      messages: [],
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversation(newConversation);
    conversationsStorage.set(updatedConversations);

    return newConversation;
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    const updatedConversations = conversations.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    );
    setConversations(updatedConversations);
    conversationsStorage.set(updatedConversations);

    // Update current conversation if it's the one being updated
    if (currentConversation?.id === id) {
      const updated = updatedConversations.find((c) => c.id === id);
      if (updated) {
        setCurrentConversation(updated);
      }
    }
  };

  const deleteConversation = (id: string) => {
    const updatedConversations = conversations.filter((c) => c.id !== id);
    setConversations(updatedConversations);
    conversationsStorage.set(updatedConversations);

    // Clear current conversation if it was deleted
    if (currentConversation?.id === id) {
      setCurrentConversation(updatedConversations[0] || null);
    }
  };

  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>): Message => {
    const newMessage: Message = {
      ...message,
      id: generateId('msg'),
      timestamp: new Date().toISOString(),
    };

    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Update conversation title based on first user message
    const updates: Partial<Conversation> = {
      messages: [...conversation.messages, newMessage],
    };

    // Auto-generate title from first user message
    if (conversation.messages.length === 0 && message.role === 'user') {
      updates.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
    }

    updateConversation(conversationId, updates);

    return newMessage;
  };

  const updateMessage = (conversationId: string, messageId: string, updates: Partial<Message>) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    const updatedMessages = conversation.messages.map((m) =>
      m.id === messageId ? { ...m, ...updates } : m
    );

    updateConversation(conversationId, { messages: updatedMessages });
  };

  const clearCurrentConversation = () => {
    setCurrentConversation(null);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        isLoading,
        createConversation,
        selectConversation,
        updateConversation,
        deleteConversation,
        addMessage,
        updateMessage,
        clearCurrentConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
