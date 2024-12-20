import type { FactCheckResult } from '@/types/fact-check';

export interface Tables {
  fact_check_records: {
    Row: {
      id: number;
      title: string;
      original_content: string;
      source_url: string | null;
      fact_check_result: FactCheckResult | null;
      verification_status: string | null;
      created_at: string | null;
      updated_at: string | null;
      category: string | null;
      language: string | null;
      region: string | null;
      impact_score: number | null;
      shares_count: number | null;
    };
    Insert: Omit<Tables['fact_check_records']['Row'], 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Tables['fact_check_records']['Insert']>;
  };
  academic_sources: {
    Row: {
      content: string;
      created_at: string | null;
      id: number;
      keywords: string[] | null;
      publication_date: string | null;
      source: string;
      title: string;
      verified: boolean | null;
    };
    Insert: {
      content: string;
      created_at?: string | null;
      id?: number;
      keywords?: string[] | null;
      publication_date?: string | null;
      source: string;
      title: string;
      verified?: boolean | null;
    };
    Update: {
      content?: string;
      created_at?: string | null;
      id?: number;
      keywords?: string[] | null;
      publication_date?: string | null;
      source?: string;
      title?: string;
      verified?: boolean | null;
    };
  };
  misinformation_logs: {
    Row: {
      content: string;
      flag_status: string | null;
      flagged_at: string | null;
      id: number;
      influencer_id: number | null;
      source: string | null;
    };
    Insert: {
      content: string;
      flag_status?: string | null;
      flagged_at?: string | null;
      id?: number;
      influencer_id?: number | null;
      source?: string | null;
    };
    Update: {
      content?: string;
      flag_status?: string | null;
      flagged_at?: string | null;
      id?: number;
      influencer_id?: number | null;
      source?: string | null;
    };
  };
  influencers: {
    Row: {
      avg_comments: number | null;
      avg_likes: number | null;
      avg_shares: number | null;
      created_at: string | null;
      engagement_rate: number | null;
      flagged_content_count: number | null;
      follower_count: number | null;
      id: number;
      location: string | null;
      name: string;
      platform: string | null;
    };
    Insert: {
      avg_comments?: number | null;
      avg_likes?: number | null;
      avg_shares?: number | null;
      created_at?: string | null;
      engagement_rate?: number | null;
      flagged_content_count?: number | null;
      follower_count?: number | null;
      id?: number;
      location?: string | null;
      name: string;
      platform?: string | null;
    };
    Update: {
      avg_comments?: number | null;
      avg_likes?: number | null;
      avg_shares?: number | null;
      created_at?: string | null;
      engagement_rate?: number | null;
      flagged_content_count?: number | null;
      follower_count?: number | null;
      id?: number;
      location?: string | null;
      name?: string;
      platform?: string | null;
    };
  };
  geographic_distribution: {
    Row: {
      id: number;
      last_updated: string | null;
      misinformation_count: number | null;
      region: string;
    };
    Insert: {
      id?: number;
      last_updated?: string | null;
      misinformation_count?: number | null;
      region: string;
    };
    Update: {
      id?: number;
      last_updated?: string | null;
      misinformation_count?: number | null;
      region?: string;
    };
  };
  misinformation_trends: {
    Row: {
      frequency: number | null;
      id: number;
      sentiment: number | null;
      time_period: string | null;
      topic: string;
    };
    Insert: {
      frequency?: number | null;
      id?: number;
      sentiment?: number | null;
      time_period?: string | null;
      topic: string;
    };
    Update: {
      frequency?: number | null;
      id?: number;
      sentiment?: number | null;
      time_period?: string | null;
      topic?: string;
    };
  };
  user_activity_logs: {
    Row: {
      activity: string;
      id: number;
      timestamp: string | null;
      user_id: number | null;
    };
    Insert: {
      activity: string;
      id?: number;
      timestamp?: string | null;
      user_id?: number | null;
    };
    Update: {
      activity?: string;
      id?: number;
      timestamp?: string | null;
      user_id?: number | null;
    };
  };
  users: {
    Row: {
      created_at: string | null;
      email: string;
      id: number;
      name: string;
      password_hash: string;
      role: string | null;
    };
    Insert: {
      created_at?: string | null;
      email: string;
      id?: number;
      name: string;
      password_hash: string;
      role?: string | null;
    };
    Update: {
      created_at?: string | null;
      email?: string;
      id?: number;
      name?: string;
      password_hash?: string;
      role?: string | null;
    };
  };
  workflow_logs: {
    Row: {
      completed_at: string | null;
      details: Json | null;
      id: number;
      started_at: string | null;
      status: string;
      workflow_type: string;
    };
    Insert: {
      completed_at?: string | null;
      details?: Json | null;
      id?: number;
      started_at?: string | null;
      status: string;
      workflow_type: string;
    };
    Update: {
      completed_at?: string | null;
      details?: Json | null;
      id?: number;
      started_at?: string | null;
      status?: string;
      workflow_type?: string;
    };
  };
}
