export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          role: 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker' | null;
          organization: string | null;
          avatar_url: string | null;
          specializations: string[] | null;
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          role?: 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker' | null;
          organization?: string | null;
          avatar_url?: string | null;
          specializations?: string[] | null;
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          role?: 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker' | null;
          organization?: string | null;
          avatar_url?: string | null;
          specializations?: string[] | null;
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      gemeenten: {
        Row: {
          id: string;
          name: string;
          active_fielders: number;
          contributions: number;
          description: string | null;
        };
        Insert: {
          id: string;
          name: string;
          active_fielders?: number;
          contributions?: number;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          active_fielders?: number;
          contributions?: number;
          description?: string | null;
        };
      };
      gemeente_content: {
        Row: {
          id: string;
          gemeente_id: string;
          type: 'process' | 'template' | 'handboek' | 'contact' | 'tip';
          title: string;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          gemeente_id: string;
          type: 'process' | 'template' | 'handboek' | 'contact' | 'tip';
          title: string;
          content: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          gemeente_id?: string;
          type?: 'process' | 'template' | 'handboek' | 'contact' | 'tip';
          title?: string;
          content?: Json;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          summary: string | null;
          content: string | null;
          category: string | null;
          tags: string[] | null;
          source: string | null;
          read_time: number | null;
          last_updated: string | null;
          embedding: number[] | null;
        };
        Insert: {
          id: string;
          title: string;
          summary?: string | null;
          content?: string | null;
          category?: string | null;
          tags?: string[] | null;
          source?: string | null;
          read_time?: number | null;
          last_updated?: string | null;
          embedding?: number[] | null;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string | null;
          content?: string | null;
          category?: string | null;
          tags?: string[] | null;
          source?: string | null;
          read_time?: number | null;
          last_updated?: string | null;
          embedding?: number[] | null;
        };
      };
      document_chunks: {
        Row: {
          id: string;
          document_id: string;
          document_type: string;
          gemeente_id: string | null;
          title: string;
          content: string;
          chunk_index: number;
          embedding: number[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          document_type: string;
          gemeente_id?: string | null;
          title: string;
          content: string;
          chunk_index: number;
          embedding?: number[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          document_type?: string;
          gemeente_id?: string | null;
          title?: string;
          content?: string;
          chunk_index?: number;
          embedding?: number[] | null;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          project_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          citations: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: 'user' | 'assistant';
          content: string;
          citations?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          citations?: Json | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: 'actief' | 'afgerond' | 'gepauzeerd';
          color: string | null;
          article_ids: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: 'actief' | 'afgerond' | 'gepauzeerd';
          color?: string | null;
          article_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: 'actief' | 'afgerond' | 'gepauzeerd';
          color?: string | null;
          article_ids?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_notes: {
        Row: {
          id: string;
          project_id: string;
          content: string;
          article_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          content: string;
          article_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          content?: string;
          article_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_articles: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          title: string;
          summary: string;
          content: string;
          category: string;
          similarity: number;
        }[];
      };
      match_document_chunks: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
          filter_gemeente_id?: string;
        };
        Returns: {
          id: string;
          document_id: string;
          title: string;
          content: string;
          gemeente_id: string | null;
          similarity: number;
        }[];
      };
    };
    Enums: {
      user_role: 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker';
      project_status: 'actief' | 'afgerond' | 'gepauzeerd';
      content_type: 'process' | 'template' | 'handboek' | 'contact' | 'tip';
      message_role: 'user' | 'assistant';
    };
  };
}

// Helper types voor makkelijk gebruik
export type Tables = Database['public']['Tables'];
export type Enums = Database['public']['Enums'];
export type Functions = Database['public']['Functions'];

// Row types
export type Profile = Tables['profiles']['Row'];
export type Gemeente = Tables['gemeenten']['Row'];
export type GemeenteContent = Tables['gemeente_content']['Row'];
export type Article = Tables['articles']['Row'];
export type DocumentChunk = Tables['document_chunks']['Row'];
export type Conversation = Tables['conversations']['Row'];
export type Message = Tables['messages']['Row'];
export type Project = Tables['projects']['Row'];
export type ProjectNote = Tables['project_notes']['Row'];

// Insert types
export type ProfileInsert = Tables['profiles']['Insert'];
export type ConversationInsert = Tables['conversations']['Insert'];
export type MessageInsert = Tables['messages']['Insert'];
export type ProjectInsert = Tables['projects']['Insert'];
export type ProjectNoteInsert = Tables['project_notes']['Insert'];

// Update types
export type ProfileUpdate = Tables['profiles']['Update'];
export type ConversationUpdate = Tables['conversations']['Update'];
export type ProjectUpdate = Tables['projects']['Update'];
export type ProjectNoteUpdate = Tables['project_notes']['Update'];

// Enum types
export type UserRole = Enums['user_role'];
export type ProjectStatus = Enums['project_status'];
export type ContentType = Enums['content_type'];
export type MessageRole = Enums['message_role'];

// Function return types
export type MatchArticlesResult = Functions['match_articles']['Returns'][number];
export type MatchDocumentChunksResult = Functions['match_document_chunks']['Returns'][number];
