import { getSupabaseClient } from '@/lib/supabase';
import type { Conversation as DBConversation, Message as DBMessage, Json } from '@/lib/database.types';
import type { Conversation, Message, Citation } from '@/lib/types';

// Get all conversations for current user
export async function getConversations(userId: string): Promise<Conversation[]> {
  const supabase = getSupabaseClient();

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  // Get messages for each conversation
  const conversationIds = conversations?.map(c => c.id) || [];
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .in('conversation_id', conversationIds)
    .order('created_at', { ascending: true });

  const messagesMap = new Map<string, Message[]>();
  messages?.forEach(msg => {
    const convMessages = messagesMap.get(msg.conversation_id) || [];
    convMessages.push(transformMessage(msg));
    messagesMap.set(msg.conversation_id, convMessages);
  });

  return (conversations || []).map(c => transformConversation(c, messagesMap.get(c.id) || []));
}

// Get single conversation with messages
export async function getConversationById(
  conversationId: string,
  userId: string
): Promise<Conversation | null> {
  const supabase = getSupabaseClient();

  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (error || !conversation) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  return transformConversation(conversation, (messages || []).map(transformMessage));
}

// Create new conversation
export async function createConversation(
  userId: string,
  title?: string,
  projectId?: string
): Promise<Conversation | null> {
  const supabase = getSupabaseClient();

  const { data: conversation, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title: title || 'Nieuw gesprek',
      project_id: projectId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return transformConversation(conversation, []);
}

// Update conversation
export async function updateConversation(
  conversationId: string,
  userId: string,
  updates: { title?: string; project_id?: string | null }
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating conversation:', error);
    return false;
  }

  return true;
}

// Delete conversation
export async function deleteConversation(conversationId: string, userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }

  return true;
}

// Add message to conversation
export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  citations?: Citation[]
): Promise<Message | null> {
  const supabase = getSupabaseClient();

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      citations: citations as unknown as Json,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding message:', error);
    return null;
  }

  return transformMessage(message);
}

// Get messages for a conversation
export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = getSupabaseClient();

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return (messages || []).map(transformMessage);
}

// Transform functions
function transformConversation(conversation: DBConversation, messages: Message[]): Conversation {
  return {
    id: conversation.id,
    title: conversation.title || 'Nieuw gesprek',
    messages,
    projectId: conversation.project_id || undefined,
    createdAt: conversation.created_at,
    updatedAt: conversation.created_at,
  };
}

function transformMessage(message: DBMessage): Message {
  const citations = message.citations as Citation[] | null;

  return {
    id: message.id,
    role: message.role as 'user' | 'assistant',
    content: message.content,
    timestamp: message.created_at,
    citations: citations || undefined,
  };
}
