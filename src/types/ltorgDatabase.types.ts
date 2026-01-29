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
    PostgrestVersion: "12.0.2 (a4e00ff)"
  }
  public: {
    Tables: {
      admin_gallery: {
        Row: {
          blurDataURL: string | null
          created_at: string
          fullPath: string | null
          id: string
          owner_id: string | null
          path: string | null
        }
        Insert: {
          blurDataURL?: string | null
          created_at?: string
          fullPath?: string | null
          id: string
          owner_id?: string | null
          path?: string | null
        }
        Update: {
          blurDataURL?: string | null
          created_at?: string
          fullPath?: string | null
          id?: string
          owner_id?: string | null
          path?: string | null
        }
        Relationships: []
      }
      categories_adult: {
        Row: {
          created_at: string
          id: string
          name: string
          subCategory: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          subCategory?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subCategory?: Json
        }
        Relationships: []
      }
      categories_child: {
        Row: {
          created_at: string
          id: string
          name: string
          subCategory: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          subCategory?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subCategory?: Json
        }
        Relationships: []
      }
      categories_family: {
        Row: {
          created_at: string
          id: string
          name: string
          subCategory: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          subCategory?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subCategory?: Json
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          conversation_status: string | null
          created_at: string
          has_unread: string | null
          id: string
          last_message_id: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          conversation_status?: string | null
          created_at?: string
          has_unread?: string | null
          id: string
          last_message_id?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          conversation_status?: string | null
          created_at?: string
          has_unread?: string | null
          id?: string
          last_message_id?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_2_conversation_status_fkey"
            columns: ["conversation_status"]
            isOneToOne: false
            referencedRelation: "chat_conversations_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_2_last_message_id_fkey"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_2_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_2_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_has_unread_fkey"
            columns: ["has_unread"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations_status: {
        Row: {
          created_at: string
          id: string
          made_by: string | null
          made_to: string | null
          status: Database["public"]["Enums"]["chat_conversation_status"] | null
        }
        Insert: {
          created_at?: string
          id?: string
          made_by?: string | null
          made_to?: string | null
          status?:
            | Database["public"]["Enums"]["chat_conversation_status"]
            | null
        }
        Update: {
          created_at?: string
          id?: string
          made_by?: string | null
          made_to?: string | null
          status?:
            | Database["public"]["Enums"]["chat_conversation_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_status_made_by_fkey"
            columns: ["made_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_status_made_to_fkey"
            columns: ["made_to"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          is_edit: boolean
          receiver_id: string
          sender_id: string
          status: Database["public"]["Enums"]["chat_message_status"] | null
          text: string
          type: Database["public"]["Enums"]["chat_message_type"]
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_edit?: boolean
          receiver_id: string
          sender_id?: string
          status?: Database["public"]["Enums"]["chat_message_status"] | null
          text: string
          type?: Database["public"]["Enums"]["chat_message_type"]
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_edit?: boolean
          receiver_id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["chat_message_status"] | null
          text?: string
          type?: Database["public"]["Enums"]["chat_message_type"]
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_2_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_2_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_2_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          comment: string | null
          created_at: string
          email: string | null
          id: string
          location: Json | null
          name: string | null
          owner_id: string | null
          post_id: string
          status: Database["public"]["Enums"]["post_status"]
        }
        Insert: {
          comment?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: Json | null
          name?: string | null
          owner_id?: string | null
          post_id: string
          status?: Database["public"]["Enums"]["post_status"]
        }
        Update: {
          comment?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: Json | null
          name?: string | null
          owner_id?: string | null
          post_id?: string
          status?: Database["public"]["Enums"]["post_status"]
        }
        Relationships: [
          {
            foreignKeyName: "comments_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_comments_lvl1: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          likesCount: number | null
          owner_id: string | null
          post_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          likesCount?: number | null
          owner_id?: string | null
          post_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          likesCount?: number | null
          owner_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_lvl1_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community-post-comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community-posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_comments_lvl2: {
        Row: {
          comment: string | null
          comment_id: string
          created_at: string
          id: string
          likesCount: number | null
          owner_id: string | null
          post_id: string
        }
        Insert: {
          comment?: string | null
          comment_id: string
          created_at?: string
          id?: string
          likesCount?: number | null
          owner_id?: string | null
          post_id: string
        }
        Update: {
          comment?: string | null
          comment_id?: string
          created_at?: string
          id?: string
          likesCount?: number | null
          owner_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_lvl2_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community-post-comments-lvl2_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_post_comments_lvl1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community-post-comments-lvl2_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community-posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          created_at: string
          id: string
          owner_id: string | null
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id?: string | null
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community-posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes_for_comments_lvl1: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          owner_id: string
          post_id: string | null
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          owner_id?: string
          post_id?: string | null
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          owner_id?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_for_comments_lvl1_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_post_comments_lvl1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_likes_for_comments_lvl1_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_likes_for_comments_lvl1_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community-posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes_for_comments_lvl2: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          owner_id: string
          post_id: string | null
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          owner_id?: string
          post_id?: string | null
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          owner_id?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_for_comments_lvl2_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_post_comments_lvl2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_likes_for_comments_lvl2_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_likes_for_comments_lvl2_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community-posts"
            referencedColumns: ["id"]
          },
        ]
      }
      "community-posts": {
        Row: {
          created_at: string
          description: Json | null
          id: string
          owner_id: string | null
          path_url: string | null
          post_type: Database["public"]["Enums"]["post_type"]
          status: string | null
          tags: Json
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: Json | null
          id?: string
          owner_id?: string | null
          path_url?: string | null
          post_type?: Database["public"]["Enums"]["post_type"]
          status?: string | null
          tags?: Json
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: Json | null
          id?: string
          owner_id?: string | null
          path_url?: string | null
          post_type?: Database["public"]["Enums"]["post_type"]
          status?: string | null
          tags?: Json
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community-posts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount_cents: number
          created_at: string | null
          donor_email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          payment_intent_id: string | null
          recipient: string | null
          recipient_id: string | null
          source: string | null
          test_status: boolean
        }
        Insert: {
          amount_cents: number
          created_at?: string | null
          donor_email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          payment_intent_id?: string | null
          recipient?: string | null
          recipient_id?: string | null
          source?: string | null
          test_status?: boolean
        }
        Update: {
          amount_cents?: number
          created_at?: string | null
          donor_email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          payment_intent_id?: string | null
          recipient?: string | null
          recipient_id?: string | null
          source?: string | null
          test_status?: boolean
        }
        Relationships: []
      }
      hugs: {
        Row: {
          created_at: string
          id: string
          location: Json | null
          owner_id: string | null
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: Json | null
          owner_id?: string | null
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: Json | null
          owner_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hugs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hugs_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      new_comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "new_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "new_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      new_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "new_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "new_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "new_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      new_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "new_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "new_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      new_posts: {
        Row: {
          author_id: string
          content: Json | null
          created_at: string
          id: string
          path_url: string
          post_status: Database["public"]["Enums"]["post_status"]
          post_type: Database["public"]["Enums"]["post_type"]
          tags: Json
          title: string
          total_comments: number
          total_likes: number
          total_popularity: number | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content?: Json | null
          created_at?: string
          id?: string
          path_url: string
          post_status?: Database["public"]["Enums"]["post_status"]
          post_type?: Database["public"]["Enums"]["post_type"]
          tags?: Json
          title: string
          total_comments?: number
          total_likes?: number
          total_popularity?: number | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: Json | null
          created_at?: string
          id?: string
          path_url?: string
          post_status?: Database["public"]["Enums"]["post_status"]
          post_type?: Database["public"]["Enums"]["post_type"]
          tags?: Json
          title?: string
          total_comments?: number
          total_likes?: number
          total_popularity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "new_posts_author_id_fkey1"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_read: boolean
          owner_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json
          id?: string
          is_read?: boolean
          owner_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_read?: boolean
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      oldRecipients: {
        Row: {
          comment: Json | null
          created_at: string
          first_name: string | null
          hugs: number | null
          id: string
          path_url: string | null
        }
        Insert: {
          comment?: Json | null
          created_at?: string
          first_name?: string | null
          hugs?: number | null
          id?: string
          path_url?: string | null
        }
        Update: {
          comment?: Json | null
          created_at?: string
          first_name?: string | null
          hugs?: number | null
          id?: string
          path_url?: string | null
        }
        Relationships: []
      }
      prayer_recipients_prays: {
        Row: {
          created_at: string
          id: string
          location: Json | null
          owner_id: string | null
          post_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: Json | null
          owner_id?: string | null
          post_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: Json | null
          owner_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_recipients_prays_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_recipients_prays_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      public_gallery: {
        Row: {
          blurDataURL: string | null
          created_at: string
          fullPath: string | null
          id: string
          owner_id: string | null
          path: string | null
        }
        Insert: {
          blurDataURL?: string | null
          created_at?: string
          fullPath?: string | null
          id: string
          owner_id?: string | null
          path?: string | null
        }
        Update: {
          blurDataURL?: string | null
          created_at?: string
          fullPath?: string | null
          id?: string
          owner_id?: string | null
          path?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["role"] | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["role"] | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recipient_counters: {
        Row: {
          created_at: string
          id: string
          shares: number
        }
        Insert: {
          created_at?: string
          id: string
          shares?: number
        }
        Update: {
          created_at?: string
          id?: string
          shares?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipients_share_count_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      recipient_layout: {
        Row: {
          created_at: string
          recipient_id: string
          title_section_bg: Database["public"]["Enums"]["title_section_bg"]
        }
        Insert: {
          created_at?: string
          recipient_id: string
          title_section_bg?: Database["public"]["Enums"]["title_section_bg"]
        }
        Update: {
          created_at?: string
          recipient_id?: string
          title_section_bg?: Database["public"]["Enums"]["title_section_bg"]
        }
        Relationships: [
          {
            foreignKeyName: "recipient_layout_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: true
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      recipients: {
        Row: {
          according_to_paragraph: string | null
          according_to_paragraph_2: Json | null
          age: number
          category: string
          church_city: string | null
          church_contact_name: string | null
          church_email: string | null
          church_name: string | null
          church_state: string | null
          condition: string | null
          created_at: string
          email: string
          end_of_campaign: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          in_memoriam: boolean
          is_archived: boolean
          is_private: boolean
          is_upgrade_complete: boolean
          journey_updates: Json
          journey_updates_2: Json | null
          last_name: string | null
          last_updated: string
          learn_more_text: string | null
          learn_more_url: string | null
          location: Json | null
          more_ways_to_support: Json | null
          more_ways_to_support____: Json | null
          opengraph: Json | null
          otherCategories: Json
          otherPages: string | null
          package_image: Json | null
          page_status: Database["public"]["Enums"]["page_status"]
          parent_name: string | null
          path_url: string | null
          poster_image: Json | null
          profile_picture: Json | null
          recipient_template: Database["public"]["Enums"]["recipient_template"]
          recipientInterests: string | null
          recipientSituation: string | null
          relationship: string
          sec_one_paragraph: Json | null
          soc_post_facebook: string | null
          soc_post_instagram: string | null
          soc_post_pinterest: string | null
          soc_post_twitter: string | null
          sub_title: string | null
          type: Database["public"]["Enums"]["recipient_type"]
          what_is: string | null
          first_name_parent_name_id_email: string | null
        }
        Insert: {
          according_to_paragraph?: string | null
          according_to_paragraph_2?: Json | null
          age?: number
          category?: string
          church_city?: string | null
          church_contact_name?: string | null
          church_email?: string | null
          church_name?: string | null
          church_state?: string | null
          condition?: string | null
          created_at?: string
          email: string
          end_of_campaign?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          in_memoriam?: boolean
          is_archived?: boolean
          is_private?: boolean
          is_upgrade_complete?: boolean
          journey_updates?: Json
          journey_updates_2?: Json | null
          last_name?: string | null
          last_updated?: string
          learn_more_text?: string | null
          learn_more_url?: string | null
          location?: Json | null
          more_ways_to_support?: Json | null
          more_ways_to_support____?: Json | null
          opengraph?: Json | null
          otherCategories?: Json
          otherPages?: string | null
          package_image?: Json | null
          page_status?: Database["public"]["Enums"]["page_status"]
          parent_name?: string | null
          path_url?: string | null
          poster_image?: Json | null
          profile_picture?: Json | null
          recipient_template?: Database["public"]["Enums"]["recipient_template"]
          recipientInterests?: string | null
          recipientSituation?: string | null
          relationship: string
          sec_one_paragraph?: Json | null
          soc_post_facebook?: string | null
          soc_post_instagram?: string | null
          soc_post_pinterest?: string | null
          soc_post_twitter?: string | null
          sub_title?: string | null
          type?: Database["public"]["Enums"]["recipient_type"]
          what_is?: string | null
        }
        Update: {
          according_to_paragraph?: string | null
          according_to_paragraph_2?: Json | null
          age?: number
          category?: string
          church_city?: string | null
          church_contact_name?: string | null
          church_email?: string | null
          church_name?: string | null
          church_state?: string | null
          condition?: string | null
          created_at?: string
          email?: string
          end_of_campaign?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          in_memoriam?: boolean
          is_archived?: boolean
          is_private?: boolean
          is_upgrade_complete?: boolean
          journey_updates?: Json
          journey_updates_2?: Json | null
          last_name?: string | null
          last_updated?: string
          learn_more_text?: string | null
          learn_more_url?: string | null
          location?: Json | null
          more_ways_to_support?: Json | null
          more_ways_to_support____?: Json | null
          opengraph?: Json | null
          otherCategories?: Json
          otherPages?: string | null
          package_image?: Json | null
          page_status?: Database["public"]["Enums"]["page_status"]
          parent_name?: string | null
          path_url?: string | null
          poster_image?: Json | null
          profile_picture?: Json | null
          recipient_template?: Database["public"]["Enums"]["recipient_template"]
          recipientInterests?: string | null
          recipientSituation?: string | null
          relationship?: string
          sec_one_paragraph?: Json | null
          soc_post_facebook?: string | null
          soc_post_instagram?: string | null
          soc_post_pinterest?: string | null
          soc_post_twitter?: string | null
          sub_title?: string | null
          type?: Database["public"]["Enums"]["recipient_type"]
          what_is?: string | null
        }
        Relationships: []
      }
      recipients_profile_pictures: {
        Row: {
          blur_data_url: string
          bucket_name: string
          created_at: string | null
          id: string
          storage_path: string
        }
        Insert: {
          blur_data_url: string
          bucket_name?: string
          created_at?: string | null
          id: string
          storage_path: string
        }
        Update: {
          blur_data_url?: string
          bucket_name?: string
          created_at?: string | null
          id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipients_profile_pictures_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      split_testing_segmented: {
        Row: {
          assigned_variant: string
          conversion_date: string | null
          conversion_status: Database["public"]["Enums"]["conversion_status"]
          created_at: string
          email: string | null
          id: string
          landing_page_url: string
          referrer: string | null
        }
        Insert: {
          assigned_variant: string
          conversion_date?: string | null
          conversion_status?: Database["public"]["Enums"]["conversion_status"]
          created_at?: string
          email?: string | null
          id?: string
          landing_page_url: string
          referrer?: string | null
        }
        Update: {
          assigned_variant?: string
          conversion_date?: string | null
          conversion_status?: Database["public"]["Enums"]["conversion_status"]
          created_at?: string
          email?: string | null
          id?: string
          landing_page_url?: string
          referrer?: string | null
        }
        Relationships: []
      }
      user_countdown_timer: {
        Row: {
          last_sent_at: string | null
          user_id: string
        }
        Insert: {
          last_sent_at?: string | null
          user_id: string
        }
        Update: {
          last_sent_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          role: Database["public"]["Enums"]["role"]
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          role?: Database["public"]["Enums"]["role"]
        }
        Update: {
          avatar?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["role"]
        }
        Relationships: []
      }
      users_profile_pictures: {
        Row: {
          blur_data_url: string | null
          bucket_name: string | null
          created_at: string | null
          id: string
          storage_path: string | null
        }
        Insert: {
          blur_data_url?: string | null
          bucket_name?: string | null
          created_at?: string | null
          id: string
          storage_path?: string | null
        }
        Update: {
          blur_data_url?: string | null
          bucket_name?: string | null
          created_at?: string | null
          id?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_profile_pictures_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_profile_pictures_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_stripe_data: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_stripe_data_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_stripe_data_test: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_stripe_data_test_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_stripe_subscriptions: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          owner_email: string
          owner_id: string | null
          price_id: string
          subscription_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          owner_email: string
          owner_id?: string | null
          price_id: string
          subscription_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          owner_email?: string
          owner_id?: string | null
          price_id?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_stripe_subscriptions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_stripe_subscriptions_test: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          owner_email: string
          owner_id: string | null
          price_id: string
          subscription_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          owner_email: string
          owner_id?: string | null
          price_id: string
          subscription_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          owner_email?: string
          owner_id?: string | null
          price_id?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_stripe_subscriptions_test_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_utilities: {
        Row: {
          date_seen: string
          has_seen_welcome_message: boolean
          id: string
        }
        Insert: {
          date_seen?: string
          has_seen_welcome_message?: boolean
          id?: string
        }
        Update: {
          date_seen?: string
          has_seen_welcome_message?: boolean
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_utilities_id_fkey"
            columns: ["id"]
            isOneToOne: true
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
      decrement_likes_count: {
        Args: { comment_id: string }
        Returns: undefined
      }
      first_name_parent_name_id_email: {
        Args: { "": Database["public"]["Tables"]["recipients"]["Row"] }
        Returns: {
          error: true
        } & "the function public.first_name_parent_name_id_email with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache"
      }
      get_all_nested_comments: {
        Args: { input_path_url: string; input_user_id: string }
        Returns: {
          author_id: string
          content: string
          created_at: string
          id: string
          level: number
          liked_by_current_user: boolean
          likes_count: number
          parent_id: string
          post_id: string
          public_profiles: Json
          updated_at: string
        }[]
      }
      get_user_id_by_email: { Args: { email_input: string }; Returns: string }
      increment_likes_count: {
        Args: { comment_id: string }
        Returns: undefined
      }
    }
    Enums: {
      chat_conversation_status: "blocked" | "accepted" | "waiting"
      chat_message_status: "sent" | "delivered" | "read"
      chat_message_type: "text" | "image" | "file"
      conversion_status: "converted" | "initiated" | "abandoned"
      gender: "male" | "female" | "other"
      page_status: "draft" | "published"
      post_status: "approved" | "rejected" | "pending"
      post_type: "recipient-support" | "community-support-request"
      recipient_template: "original" | "church"
      recipient_type: "child" | "adult" | "family"
      role: "admin" | "super_admin" | "user" | "moderator"
      title_section_bg: "gradient" | "hearts"
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
      chat_conversation_status: ["blocked", "accepted", "waiting"],
      chat_message_status: ["sent", "delivered", "read"],
      chat_message_type: ["text", "image", "file"],
      conversion_status: ["converted", "initiated", "abandoned"],
      gender: ["male", "female", "other"],
      page_status: ["draft", "published"],
      post_status: ["approved", "rejected", "pending"],
      post_type: ["recipient-support", "community-support-request"],
      recipient_template: ["original", "church"],
      recipient_type: ["child", "adult", "family"],
      role: ["admin", "super_admin", "user", "moderator"],
      title_section_bg: ["gradient", "hearts"],
    },
  },
} as const
