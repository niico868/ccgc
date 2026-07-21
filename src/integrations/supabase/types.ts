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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      discount_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          percent: number
          redeemed_at: string | null
          source: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          percent?: number
          redeemed_at?: string | null
          source?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          percent?: number
          redeemed_at?: string | null
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_note: string | null
          created_at: string
          customer_name: string | null
          delivery_address: string | null
          delivery_fee: number
          discount_amount: number
          discount_code: string | null
          email: string | null
          fulfillment: string | null
          id: string
          idempotency_key: string | null
          items: Json
          notes: string | null
          order_ref: string
          payment_method: string | null
          phone: string | null
          pickup_location: string | null
          status: string
          status_updated_at: string
          subtotal: number
          total: number
          used_whatsapp_doublecheck: boolean
          user_id: string | null
          whatsapp_doublecheck_at: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          customer_name?: string | null
          delivery_address?: string | null
          delivery_fee?: number
          discount_amount?: number
          discount_code?: string | null
          email?: string | null
          fulfillment?: string | null
          id?: string
          idempotency_key?: string | null
          items?: Json
          notes?: string | null
          order_ref: string
          payment_method?: string | null
          phone?: string | null
          pickup_location?: string | null
          status?: string
          status_updated_at?: string
          subtotal?: number
          total?: number
          used_whatsapp_doublecheck?: boolean
          user_id?: string | null
          whatsapp_doublecheck_at?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          customer_name?: string | null
          delivery_address?: string | null
          delivery_fee?: number
          discount_amount?: number
          discount_code?: string | null
          email?: string | null
          fulfillment?: string | null
          id?: string
          idempotency_key?: string | null
          items?: Json
          notes?: string | null
          order_ref?: string
          payment_method?: string | null
          phone?: string | null
          pickup_location?: string | null
          status?: string
          status_updated_at?: string
          subtotal?: number
          total?: number
          used_whatsapp_doublecheck?: boolean
          user_id?: string | null
          whatsapp_doublecheck_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          default_address: string | null
          default_delivery_zone: string | null
          default_payment_method: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          marketing_opt_in: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_address?: string | null
          default_delivery_zone?: string | null
          default_payment_method?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          marketing_opt_in?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_address?: string | null
          default_delivery_zone?: string | null
          default_payment_method?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          marketing_opt_in?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          id: string
          rating: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          id?: string
          rating: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          rating?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_order_status: {
        Args: { _order_ref: string; _phone_last4: string }
        Returns: {
          admin_note: string
          created_at: string
          customer_name: string
          delivery_address: string
          delivery_fee: number
          discount_amount: number
          fulfillment: string
          items: Json
          order_ref: string
          pickup_location: string
          status: string
          status_updated_at: string
          subtotal: number
          total: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_order_whatsapp_doublecheck: {
        Args: { _idem: string; _order_ref: string }
        Returns: boolean
      }
      submit_order: {
        Args: { _idem: string; _payload: Json }
        Returns: {
          is_new: boolean
          order_ref: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
