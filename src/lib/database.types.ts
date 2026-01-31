export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          role: 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker' | null
          organization: string | null
          avatar_url: string | null
          specializations: string[] | null
          onboarding_complete: boolean
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          role?: 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker' | null
          organization?: string | null
          avatar_url?: string | null
          specializations?: string[] | null
          onboarding_complete?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          role?: 'vergunningverlener' | 'toezichthouder' | 'jurist' | 'beleidsmedewerker' | null
          organization?: string | null
          avatar_url?: string | null
          specializations?: string[] | null
          onboarding_complete?: boolean
          created_at?: string
        }
      }
      gemeenten: {
        Row: {
          id: string
          name: string
          active_fielders: number
          contributions: number
          description: string | null
        }
        Insert: {
          id: string
          name: string
          active_fielders?: number
          contributions?: number
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          active_fielders?: number
          contributions?: number
          description?: string | null
        }
      }
      gemeente_content: {
        Row: {
          id: string
          gemeente_id: string
          type: 'process' | 'template' | 'handboek' | 'contact' | 'tip'
          title: string
          content: Json
          created_at: string
        }
        Insert: {
          id?: string
          gemeente_id: string
          type: 'process' | 'template' | 'handboek' | 'contact' | 'tip'
          title: string
          content: Json
          created_at?: string
        }
        Update: {
          id?: string
          gemeente_id?: string
          type?: 'process' | 'template' | 'handboek' | 'contact' | 'tip'
          title?: string
          content?: Json
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          summary: string | null
          content: string | null
          category: string | null
          tags: string[] | null
          source: string | null
          read_time: number | null
          last_updated: string | null
          embedding: number[] | null
        }
        Insert: {
          id: string
          title: string
          summary?: string | null
          content?: string | null
          category?: string | null
          tags?: string[] | null
          source?: string | null
          read_time?: number | null
          last_updated?: string | null
          embedding?: number[] | null
        }
        Update: {
          id?: string
          title?: string
          summary?: string | null
          content?: string | null
          category?: string | null
          tags?: string[] | null
          source?: string | null
          read_time?: number | null
          last_updated?: string | null
          embedding?: number[] | null
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          project_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          project_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          project_id?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          citations: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          citations?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          citations?: Json | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'actief' | 'afgerond' | 'gepauzeerd'
          color: string | null
          article_ids: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'actief' | 'afgerond' | 'gepauzeerd'
          color?: string | null
          article_ids?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'actief' | 'afgerond' | 'gepauzeerd'
          color?: string | null
          article_ids?: string[] | null
          created_at?: string
        }
      }
      project_notes: {
        Row: {
          id: string
          project_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          content?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_articles: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          title: string
          summary: string
          content: string
          category: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Gemeente = Database['public']['Tables']['gemeenten']['Row']
export type GemeenteContent = Database['public']['Tables']['gemeente_content']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectNote = Database['public']['Tables']['project_notes']['Row']
