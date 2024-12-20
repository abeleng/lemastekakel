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
      }
      fact_check_records: {
        Row: {
          id: number
          title: string
          original_content: string
          source_url: string | null
          fact_check_result: Json | null
          verification_status: string | null
          created_at: string | null
          updated_at: string | null
          category: string | null
          language: string | null
          region: string | null
          impact_score: number | null
          shares_count: number | null
        }
        Insert: {
          id?: number
          title: string
          original_content: string
          source_url?: string | null
          fact_check_result?: Json | null
          verification_status?: string | null
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          language?: string | null
          region?: string | null
          impact_score?: number | null
          shares_count?: number | null
        }
        Update: {
          id?: number
          title?: string
          original_content?: string
          source_url?: string | null
          fact_check_result?: Json | null
          verification_status?: string | null
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          language?: string | null
          region?: string | null
          impact_score?: number | null
          shares_count?: number | null
        }
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
      }
      geographic_distribution: {
        Row: {
          id: number
          last_updated: string | null
          misinformation_count: number | null
          region: string
        }
        Insert: {
          id?: number
          last_updated?: string | null
          misinformation_count?: number | null
          region: string
        }
        Update: {
          id?: number
          last_updated?: string | null
          misinformation_count?: number | null
          region?: string
        }
      }
      misinformation_trends: {
        Row: {
          frequency: number | null
          id: number
          sentiment: number | null
          time_period: string | null
          topic: string
        }
        Insert: {
          frequency?: number | null
          id?: number
          sentiment?: number | null
          time_period?: string | null
          topic: string
        }
        Update: {
          frequency?: number | null
          id?: number
          sentiment?: number | null
          time_period?: string | null
          topic?: string
        }
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
    : never,
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
