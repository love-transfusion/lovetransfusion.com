export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      facebook_comments: {
        Row: {
          comment_count: number | null
          comment_id: string
          created_time: string
          from_id: string | null
          from_name: string | null
          from_picture_url: string | null
          is_deleted: boolean | null
          is_hidden: boolean | null
          like_count: number | null
          message: string | null
          parent_id: string | null
          permalink_url: string | null
          post_id: string
          raw: Json | null
          updated_at: string | null
        }
        Insert: {
          comment_count?: number | null
          comment_id: string
          created_time: string
          from_id?: string | null
          from_name?: string | null
          from_picture_url?: string | null
          is_deleted?: boolean | null
          is_hidden?: boolean | null
          like_count?: number | null
          message?: string | null
          parent_id?: string | null
          permalink_url?: string | null
          post_id: string
          raw?: Json | null
          updated_at?: string | null
        }
        Update: {
          comment_count?: number | null
          comment_id?: string
          created_time?: string
          from_id?: string | null
          from_name?: string | null
          from_picture_url?: string | null
          is_deleted?: boolean | null
          is_hidden?: boolean | null
          like_count?: number | null
          message?: string | null
          parent_id?: string | null
          permalink_url?: string | null
          post_id?: string
          raw?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facebook_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "facebook_posts"
            referencedColumns: ["post_id"]
          },
        ]
      }
      facebook_insights: {
        Row: {
          ad_id: string
          created_at: string
          insights: Json
          last_synced_at: string
          user_id: string
        }
        Insert: {
          ad_id: string
          created_at?: string
          insights?: Json
          last_synced_at?: string
          user_id: string
        }
        Update: {
          ad_id?: string
          created_at?: string
          insights?: Json
          last_synced_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_pages: {
        Row: {
          connected_by_user_id: string
          created_at: string | null
          page_id: string
          page_name: string | null
        }
        Insert: {
          connected_by_user_id: string
          created_at?: string | null
          page_id: string
          page_name?: string | null
        }
        Update: {
          connected_by_user_id?: string
          created_at?: string | null
          page_id?: string
          page_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facebook_pages_connected_by_user_id_fkey"
            columns: ["connected_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_posts: {
        Row: {
          ad_id: string | null
          created_at: string | null
          last_synced_at: string | null
          page_id: string
          post_id: string
          user_id: string
        }
        Insert: {
          ad_id?: string | null
          created_at?: string | null
          last_synced_at?: string | null
          page_id: string
          post_id: string
          user_id: string
        }
        Update: {
          ad_id?: string | null
          created_at?: string | null
          last_synced_at?: string | null
          page_id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facebook_posts_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "facebook_pages"
            referencedColumns: ["page_id"]
          },
          {
            foreignKeyName: "facebook_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      facebook_webhook_logs: {
        Row: {
          created_at: string | null
          event: Json
          id: string
        }
        Insert: {
          created_at?: string | null
          event: Json
          id?: string
        }
        Update: {
          created_at?: string | null
          event?: Json
          id?: string
        }
        Relationships: []
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
          fb_ad_IDs: Json[]
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
          fb_ad_IDs?: Json[]
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
          fb_ad_IDs?: Json[]
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
      users_data_facebook: {
        Row: {
          comments: Json | null
          id: string
          insights: Json | null
          share_count: number
          updated_at: string
        }
        Insert: {
          comments?: Json | null
          id: string
          insights?: Json | null
          share_count: number
          updated_at?: string
        }
        Update: {
          comments?: Json | null
          id?: string
          insights?: Json | null
          share_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_data_facebook_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
