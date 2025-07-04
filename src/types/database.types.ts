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
      fb_adwise_insights: {
        Row: {
          ad_id: string
          ad_name: string | null
          adset_id: string | null
          adset_name: string | null
          campaign_id: string | null
          campaign_name: string | null
          cl_city: string | null
          cl_country: string | null
          cl_country_code: string | null
          cl_heart_reactions: number
          cl_hug_reactions: number
          cl_impressions: number
          cl_like_reactions: number
          cl_reach: number
          cl_region: string | null
          cl_total_reactions: number
          fetched_at: string
          id: string
        }
        Insert: {
          ad_id: string
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          cl_city?: string | null
          cl_country?: string | null
          cl_country_code?: string | null
          cl_heart_reactions?: number
          cl_hug_reactions?: number
          cl_impressions?: number
          cl_like_reactions?: number
          cl_reach?: number
          cl_region?: string | null
          cl_total_reactions?: number
          fetched_at?: string
          id?: string
        }
        Update: {
          ad_id?: string
          ad_name?: string | null
          adset_id?: string | null
          adset_name?: string | null
          campaign_id?: string | null
          campaign_name?: string | null
          cl_city?: string | null
          cl_country?: string | null
          cl_country_code?: string | null
          cl_heart_reactions?: number
          cl_hug_reactions?: number
          cl_impressions?: number
          cl_like_reactions?: number
          cl_reach?: number
          cl_region?: string | null
          cl_total_reactions?: number
          fetched_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fb_adwise_insights_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["fb_ad_id"]
          },
        ]
      }
      profile_pictures: {
        Row: {
          blur_data_url: string | null
          bucket_name: string
          created_at: string
          storage_path: string
          user_id: string
        }
        Insert: {
          blur_data_url?: string | null
          bucket_name: string
          created_at?: string
          storage_path: string
          user_id: string
        }
        Update: {
          blur_data_url?: string | null
          bucket_name?: string
          created_at?: string
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_pictures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      receipients_deleted_messages: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          recipient_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipients_deleted_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users_data_website"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipients_deleted_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tooltips: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_active: boolean
          order_index: number
          page: string | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          order_index?: number
          page?: string | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean
          order_index?: number
          page?: string | null
          title?: string
        }
        Relationships: []
      }
      tooltips_user_status: {
        Row: {
          dismissed: boolean | null
          dismissed_at: string | null
          id: string
          seen: boolean | null
          seen_at: string | null
          tooltip_id: string
          user_id: string | null
        }
        Insert: {
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          seen?: boolean | null
          seen_at?: string | null
          tooltip_id: string
          user_id?: string | null
        }
        Update: {
          dismissed?: boolean | null
          dismissed_at?: string | null
          id?: string
          seen?: boolean | null
          seen_at?: string | null
          tooltip_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tooltips_user_status_tooltip_id_fkey"
            columns: ["tooltip_id"]
            isOneToOne: false
            referencedRelation: "tooltips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tooltips_user_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          birthday: string | null
          created_at: string
          display_name: string | null
          email: string
          fb_ad_id: string | null
          first_name: string | null
          id: string
          last_name: string | null
          parent_name: string | null
          recipient_id: string | null
          recipient_name: string | null
          role: Database["public"]["Enums"]["role"]
        }
        Insert: {
          avatar?: string | null
          birthday?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          fb_ad_id?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          parent_name?: string | null
          recipient_id?: string | null
          recipient_name?: string | null
          role?: Database["public"]["Enums"]["role"]
        }
        Update: {
          avatar?: string | null
          birthday?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          fb_ad_id?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          parent_name?: string | null
          recipient_id?: string | null
          recipient_name?: string | null
          role?: Database["public"]["Enums"]["role"]
        }
        Relationships: []
      }
      users_data_website: {
        Row: {
          created_at: string
          id: string
          profile_picture: Json | null
          recipient: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id: string
          profile_picture?: Json | null
          recipient: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          profile_picture?: Json | null
          recipient?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_data_website_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      role: "admin" | "basic" | "manager"
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
    Enums: {
      role: ["admin", "basic", "manager"],
    },
  },
} as const
