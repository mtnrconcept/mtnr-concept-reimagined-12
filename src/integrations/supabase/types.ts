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
      bookings: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          spot_id: string | null
          start_time: string
          status: string
          total_price: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          spot_id?: string | null
          start_time: string
          status?: string
          total_price: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          spot_id?: string | null
          start_time?: string
          status?: string
          total_price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "parking_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          match_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "profile_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_progress: {
        Row: {
          completed_tasks: number | null
          created_at: string | null
          date: string
          id: string
          productivity_score: number | null
          total_tasks: number | null
          user_id: string
        }
        Insert: {
          completed_tasks?: number | null
          created_at?: string | null
          date: string
          id?: string
          productivity_score?: number | null
          total_tasks?: number | null
          user_id: string
        }
        Update: {
          completed_tasks?: number | null
          created_at?: string | null
          date?: string
          id?: string
          productivity_score?: number | null
          total_tasks?: number | null
          user_id?: string
        }
        Relationships: []
      }
      generated_games: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          prompt: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          prompt: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          prompt?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      job_listings: {
        Row: {
          company: string
          created_at: string | null
          date: string
          description: string
          featured: boolean | null
          id: string
          industry: string | null
          location: string
          logo: string | null
          requirements: string[]
          salary: string | null
          source: string
          source_id: string
          title: string
          type: string
          url: string
        }
        Insert: {
          company: string
          created_at?: string | null
          date?: string
          description: string
          featured?: boolean | null
          id?: string
          industry?: string | null
          location: string
          logo?: string | null
          requirements: string[]
          salary?: string | null
          source: string
          source_id: string
          title: string
          type: string
          url: string
        }
        Update: {
          company?: string
          created_at?: string | null
          date?: string
          description?: string
          featured?: boolean | null
          id?: string
          industry?: string | null
          location?: string
          logo?: string | null
          requirements?: string[]
          salary?: string | null
          source?: string
          source_id?: string
          title?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      karma_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      karma_questions: {
        Row: {
          category_id: string
          created_at: string
          id: string
          options: Json
          question: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          options: Json
          question: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          options?: Json
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "karma_questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "karma_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      karma_results: {
        Row: {
          created_at: string
          daily_score: number | null
          discipline_score: number | null
          environmental_score: number | null
          id: string
          personal_score: number | null
          political_score: number | null
          social_score: number | null
          total_score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          daily_score?: number | null
          discipline_score?: number | null
          environmental_score?: number | null
          id?: string
          personal_score?: number | null
          political_score?: number | null
          social_score?: number | null
          total_score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          daily_score?: number | null
          discipline_score?: number | null
          environmental_score?: number | null
          id?: string
          personal_score?: number | null
          political_score?: number | null
          social_score?: number | null
          total_score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          id: string
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          id?: string
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          id?: string
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parking_spots: {
        Row: {
          address: string
          availability: string[] | null
          city: string
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          latitude: number
          longitude: number
          owner_id: string | null
          photos: string[] | null
          price_per_hour: number
          rating: number | null
          title: string
        }
        Insert: {
          address: string
          availability?: string[] | null
          city: string
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          latitude: number
          longitude: number
          owner_id?: string | null
          photos?: string[] | null
          price_per_hour: number
          rating?: number | null
          title: string
        }
        Update: {
          address?: string
          availability?: string[] | null
          city?: string
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          latitude?: number
          longitude?: number
          owner_id?: string | null
          photos?: string[] | null
          price_per_hour?: number
          rating?: number | null
          title?: string
        }
        Relationships: []
      }
      profile_matches: {
        Row: {
          id: string
          match_percentage: number | null
          matched_at: string | null
          profile_id_1: string | null
          profile_id_2: string | null
        }
        Insert: {
          id?: string
          match_percentage?: number | null
          matched_at?: string | null
          profile_id_1?: string | null
          profile_id_2?: string | null
        }
        Update: {
          id?: string
          match_percentage?: number | null
          matched_at?: string | null
          profile_id_1?: string | null
          profile_id_2?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_matches_profile_id_1_fkey"
            columns: ["profile_id_1"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_matches_profile_id_2_fkey"
            columns: ["profile_id_2"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          level: number | null
          name: string
          points: number | null
          task_completion_rate: number | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id: string
          level?: number | null
          name: string
          points?: number | null
          task_completion_rate?: number | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          level?: number | null
          name?: string
          points?: number | null
          task_completion_rate?: number | null
        }
        Relationships: []
      }
      scraped_jobs: {
        Row: {
          company: string
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          industry: string | null
          location: string
          source: string
          title: string
          type: string | null
          url: string
        }
        Insert: {
          company: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location: string
          source: string
          title: string
          type?: string | null
          url: string
        }
        Update: {
          company?: string
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location?: string
          source?: string
          title?: string
          type?: string | null
          url?: string
        }
        Relationships: []
      }
      subtasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          task_id: string
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          task_id: string
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          task_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string
          completed_date: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          importance: number
          is_recurring: boolean | null
          is_shared_with_friends: boolean | null
          priority: number
          progress: number | null
          recurring_pattern: string | null
          reminder_time: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          importance: number
          is_recurring?: boolean | null
          is_shared_with_friends?: boolean | null
          priority: number
          progress?: number | null
          recurring_pattern?: string | null
          reminder_time?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          importance?: number
          is_recurring?: boolean | null
          is_shared_with_friends?: boolean | null
          priority?: number
          progress?: number | null
          recurring_pattern?: string | null
          reminder_time?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number | null
          created_at: string | null
          cv_url: string | null
          desired_location: string | null
          employment_rate: number | null
          first_name: string | null
          gender: string | null
          home_location: string | null
          id: string
          languages: string[] | null
          last_name: string | null
          required_education: string | null
          required_experience: number | null
          required_languages: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          cv_url?: string | null
          desired_location?: string | null
          employment_rate?: number | null
          first_name?: string | null
          gender?: string | null
          home_location?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          required_education?: string | null
          required_experience?: number | null
          required_languages?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          cv_url?: string | null
          desired_location?: string | null
          employment_rate?: number | null
          first_name?: string | null
          gender?: string | null
          home_location?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          required_education?: string | null
          required_experience?: number | null
          required_languages?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      weekly_schedule: {
        Row: {
          category: string
          created_at: string | null
          day: string
          end_time: string
          id: string
          is_completed: boolean | null
          start_time: string
          task_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          day: string
          end_time: string
          id?: string
          is_completed?: boolean | null
          start_time: string
          task_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          day?: string
          end_time?: string
          id?: string
          is_completed?: boolean | null
          start_time?: string
          task_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_schedule_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_percentage: {
        Args:
          | Record<PropertyKey, never>
          | { profile_id: string; other_profile_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
