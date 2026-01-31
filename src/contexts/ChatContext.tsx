"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Conversation, Message } from '@/lib/types';
import { useUser } from './UserContext';
import * as conversationService from '@/lib/services/conversations';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  createConversation: (title?: string, projectId?: string) => Promise<Conversation | null>;
  selectConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Promise<Message | null>;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  clearCurrentConversation: () => void;
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  // Load conversations from Supabase
  const loadConversations = useCallback(async () => {
    if (!user?.id) {
      setConversations([]);
      setCurrentConversation(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const loadedConversations = await conversationService.getConversations(user.id);
      setConversations(loadedConversations);

      // Select the most recent conversation if exists
      if (loadedConversations.length > 0 && !currentConversation) {
        setCurrentConversation(loadedConversations[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const refreshConversations = async () => {
    await loadConversations();
  };

  const createConversation = async (title?: string, projectId?: string): Promise<Conversation | null> => {
    if (!user?.id) return null;

    const newConversation = await conversationService.createConversation(
      user.id,
      title,
      projectId
    );

    if (newConversation) {
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    }

    return newConversation;
  };

  const selectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
    }
  };

  const updateConversation = async (id: string, updates: Partial<Conversation>) => {
    if (!user?.id) return;

    const success = await conversationService.updateConversation(id, user.id, {
      title: updates.title,
      project_id: updates.projectId,
    });

    if (success) {
      setConversations(prev =>
        prev.map(c =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        )
      );

      // Update current conversation if it's the one being updated
      if (currentConversation?.id === id) {
        setCurrentConversation(prev =>
          prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null
        );
      }
    }
  };

  const deleteConversation = async (id: string) => {
    if (!user?.id) return;

    const success = await conversationService.deleteConversation(id, user.id);

    if (success) {
      const updatedConversations = conversations.filter(c => c.id !== id);
      setConversations(updatedConversations);

      // Clear current conversation if it was deleted
      if (currentConversation?.id === id) {
        setCurrentConversation(updatedConversations[0] || null);
      }
    }
  };

  const addMessage = async (
    conversationId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<Message | null> => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return null;

    const newMessage = await conversationService.addMessage(
      conversationId,
      message.role,
      message.content,
      message.citations
    );

    if (newMessage) {
      // Auto-generate title from first user message
      let titleUpdate: string | undefined;
      if (conversation.messages.length === 0 && message.role === 'user') {
        titleUpdate = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
        // Update title in database
        if (user?.id) {
          await conversationService.updateConversation(conversationId, user.id, { title: titleUpdate });
        }
      }

      // Update local state
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, newMessage],
                title: titleUpdate || c.title,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );

      // Update current conversation
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, newMessage],
                title: titleUpdate || prev.title,
                updatedAt: new Date().toISOString(),
              }
            : null
        );
      }
    }

    return newMessage;
  };

  // Local-only update (for streaming state)
  const updateMessage = (conversationId: string, messageId: string, updates: Partial<Message>) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === messageId ? { ...m, ...updates } : m
              ),
            }
          : c
      )
    );

    if (currentConversation?.id === conversationId) {
      setCurrentConversation(prev =>
        prev
          ? {
              ...prev,
              messages: prev.messages.map(m =>
                m.id === messageId ? { ...m, ...updates } : m
              ),
            }
          : null
      );
    }
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
        refreshConversations,
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
