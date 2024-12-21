export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_sources: {
        Row: {
          content: string
          created_at: string | null
          id: number
          keywords: string[] | null
          publication_date: string | null
          source: string
          title: string
          verified: boolean | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          keywords?: string[] | null
          publication_date?: string | null
          source: string
          title: string
          verified?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          keywords?: string[] | null
          publication_date?: string | null
          source?: string
          title?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      content_analysis: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          content_id: number | null
          created_at: string | null
          id: number
          result: Json
        }
        Insert: {
          analysis_type: string
          confidence_score?: number | null
          content_id?: number | null
          created_at?: string | null
          id?: number
          result: Json
        }
        Update: {
          analysis_type?: string
          confidence_score?: number | null
          content_id?: number | null
          created_at?: string | null
          id?: number
          result?: Json
        }
        Relationships: [
          {
            foreignKeyName: "content_analysis_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "misinformation_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      fact_check_records: {
        Row: {
          category: string | null
          created_at: string | null
          fact_check_result: Json | null
          id: number
          impact_score: number | null
          language: string | null
          original_content: string
          region: string | null
          shares_count: number | null
          source_url: string | null
          title: string
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          fact_check_result?: Json | null
          id?: number
          impact_score?: number | null
          language?: string | null
          original_content: string
          region?: string | null
          shares_count?: number | null
          source_url?: string | null
          title: string
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          fact_check_result?: Json | null
          id?: number
          impact_score?: number | null
          language?: string | null
          original_content?: string
          region?: string | null
          shares_count?: number | null
          source_url?: string | null
          title?: string
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      geographic_distribution: {
        Row: {
          ai_insights: Json | null
          id: number
          last_updated: string | null
          misinformation_count: number | null
          region: string
        }
        Insert: {
          ai_insights?: Json | null
          id?: number
          last_updated?: string | null
          misinformation_count?: number | null
          region: string
        }
        Update: {
          ai_insights?: Json | null
          id?: number
          last_updated?: string | null
          misinformation_count?: number | null
          region?: string
        }
        Relationships: []
      }
      influencers: {
        Row: {
          avg_comments: number | null
          avg_likes: number | null
          avg_shares: number | null
          created_at: string | null
          engagement_rate: number | null
          flagged_content_count: number | null
          follower_count: number | null
          id: number
          location: string | null
          name: string
          platform: string | null
        }
        Insert: {
          avg_comments?: number | null
          avg_likes?: number | null
          avg_shares?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          flagged_content_count?: number | null
          follower_count?: number | null
          id?: number
          location?: string | null
          name: string
          platform?: string | null
        }
        Update: {
          avg_comments?: number | null
          avg_likes?: number | null
          avg_shares?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          flagged_content_count?: number | null
          follower_count?: number | null
          id?: number
          location?: string | null
          name?: string
          platform?: string | null
        }
        Relationships: []
      }
      misinformation_logs: {
        Row: {
          content: string
          flag_status: string | null
          flagged_at: string | null
          id: number
          influencer_id: number | null
          source: string | null
        }
        Insert: {
          content: string
          flag_status?: string | null
          flagged_at?: string | null
          id?: number
          influencer_id?: number | null
          source?: string | null
        }
        Update: {
          content?: string
          flag_status?: string | null
          flagged_at?: string | null
          id?: number
          influencer_id?: number | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "misinformation_logs_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      misinformation_trends: {
        Row: {
          ai_analysis: Json | null
          frequency: number | null
          id: number
          sentiment: number | null
          time_period: string | null
          topic: string
        }
        Insert: {
          ai_analysis?: Json | null
          frequency?: number | null
          id?: number
          sentiment?: number | null
          time_period?: string | null
          topic: string
        }
        Update: {
          ai_analysis?: Json | null
          frequency?: number | null
          id?: number
          sentiment?: number | null
          time_period?: string | null
          topic?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity: string
          id: number
          timestamp: string | null
          user_id: number | null
        }
        Insert: {
          activity: string
          id?: number
          timestamp?: string | null
          user_id?: number | null
        }
        Update: {
          activity?: string
          id?: number
          timestamp?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string
          password_hash: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          name: string
          password_hash: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          password_hash?: string
          role?: string | null
        }
        Relationships: []
      }
      workflow_logs: {
        Row: {
          completed_at: string | null
          details: Json | null
          id: number
          started_at: string | null
          status: string
          workflow_type: string
        }
        Insert: {
          completed_at?: string | null
          details?: Json | null
          id?: number
          started_at?: string | null
          status: string
          workflow_type: string
        }
        Update: {
          completed_at?: string | null
          details?: Json | null
          id?: number
          started_at?: string | null
          status?: string
          workflow_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
