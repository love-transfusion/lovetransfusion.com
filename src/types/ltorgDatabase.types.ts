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
          name: string | null
          subCategory: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          subCategory?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          subCategory?: Json | null
        }
        Relationships: []
      }
      categories_child: {
        Row: {
          created_at: string
          id: string
          name: string | null
          subCategory: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          subCategory?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          subCategory?: Json | null
        }
        Relationships: []
      }
      categories_family: {
        Row: {
          created_at: string
          id: string
          name: string | null
          subCategory: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          subCategory?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          subCategory?: Json | null
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
          post_type: string | null
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
          post_type?: string | null
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
          post_type?: string | null
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
          amount: number | null
          created_at: string | null
          donor_email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          metadata: Json | null
          payment_intent_id: string | null
          recipient: string | null
          source: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          donor_email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          payment_intent_id?: string | null
          recipient?: string | null
          source?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          donor_email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          metadata?: Json | null
          payment_intent_id?: string | null
          recipient?: string | null
          source?: string | null
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
          profile_picture: Json | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          profile_picture?: Json | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          profile_picture?: Json | null
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
      recipients: {
        Row: {
          according_to_paragraph: string | null
          according_to_paragraph_2: Json | null
          category: string
          condition: string | null
          created_at: string
          email: string
          end_of_campaign: string | null
          first_name: string | null
          gender: string | null
          id: string
          journey_updates: Json | null
          learn_more_text: string | null
          learn_more_url: string | null
          more_ways_to_support: Json | null
          more_ways_to_support____: Json | null
          opengraph: Json | null
          otherCategories: Json | null
          otherPages: string | null
          package_image: Json | null
          page_status: string | null
          parent_name: string | null
          path_url: string | null
          poster_image: Json | null
          profile_picture: Json | null
          recipientInterests: string | null
          recipientSituation: string | null
          relationship: string | null
          sec_one_paragraph: string | null
          sec_one_paragraph_2: Json | null
          sub_title: string | null
          type: Database["public"]["Enums"]["recipient_type"]
          what_is: string | null
          first_name_parent_name_id_email: string | null
        }
        Insert: {
          according_to_paragraph?: string | null
          according_to_paragraph_2?: Json | null
          category?: string
          condition?: string | null
          created_at?: string
          email: string
          end_of_campaign?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          journey_updates?: Json | null
          learn_more_text?: string | null
          learn_more_url?: string | null
          more_ways_to_support?: Json | null
          more_ways_to_support____?: Json | null
          opengraph?: Json | null
          otherCategories?: Json | null
          otherPages?: string | null
          package_image?: Json | null
          page_status?: string | null
          parent_name?: string | null
          path_url?: string | null
          poster_image?: Json | null
          profile_picture?: Json | null
          recipientInterests?: string | null
          recipientSituation?: string | null
          relationship?: string | null
          sec_one_paragraph?: string | null
          sec_one_paragraph_2?: Json | null
          sub_title?: string | null
          type?: Database["public"]["Enums"]["recipient_type"]
          what_is?: string | null
        }
        Update: {
          according_to_paragraph?: string | null
          according_to_paragraph_2?: Json | null
          category?: string
          condition?: string | null
          created_at?: string
          email?: string
          end_of_campaign?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          journey_updates?: Json | null
          learn_more_text?: string | null
          learn_more_url?: string | null
          more_ways_to_support?: Json | null
          more_ways_to_support____?: Json | null
          opengraph?: Json | null
          otherCategories?: Json | null
          otherPages?: string | null
          package_image?: Json | null
          page_status?: string | null
          parent_name?: string | null
          path_url?: string | null
          poster_image?: Json | null
          profile_picture?: Json | null
          recipientInterests?: string | null
          recipientSituation?: string | null
          relationship?: string | null
          sec_one_paragraph?: string | null
          sec_one_paragraph_2?: Json | null
          sub_title?: string | null
          type?: Database["public"]["Enums"]["recipient_type"]
          what_is?: string | null
        }
        Relationships: []
      }
      user_profile_pictures: {
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
        Relationships: [
          {
            foreignKeyName: "user_profile_pictures_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
        }
        Relationships: []
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
          customer_id: string | null
          id: string
          owner_email: string
          owner_id: string | null
          price_id: string | null
          product_id: string | null
          subscription_id: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          owner_email: string
          owner_id?: string | null
          price_id?: string | null
          product_id?: string | null
          subscription_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          owner_email?: string
          owner_id?: string | null
          price_id?: string | null
          product_id?: string | null
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
          customer_id: string | null
          id: string
          owner_email: string
          owner_id: string | null
          price_id: string | null
          product_id: string | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          owner_email: string
          owner_id?: string | null
          price_id?: string | null
          product_id?: string | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          owner_email?: string
          owner_id?: string | null
          price_id?: string | null
          product_id?: string | null
          subscription_id?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_likes_count: {
        Args: {
          comment_id: string
        }
        Returns: undefined
      }
      first_name_parent_name_id_email: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      get_user_id_by_email: {
        Args: {
          email_input: string
        }
        Returns: string
      }
      increment_likes_count: {
        Args: {
          comment_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      chat_conversation_status: "blocked" | "accepted" | "waiting"
      chat_message_status: "sent" | "delivered" | "read"
      chat_message_type: "text" | "image" | "file"
      recipient_type: "child" | "adult" | "family"
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
