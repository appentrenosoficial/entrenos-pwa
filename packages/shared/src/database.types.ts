export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      account_context: {
        Row: {
          active_profile_id: string | null;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          active_profile_id?: string | null;
          user_id: string;
        };
        Update: {
          active_profile_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "account_context_active_profile_id_fkey";
            columns: ["active_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "account_context_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users_private";
            referencedColumns: ["user_id"];
          },
        ];
      };
      connections: {
        Row: {
          profile_a: string;
          profile_b: string;
        };
        ComputedFields: never;
        Insert: {
          profile_a: string;
          profile_b: string;
        };
        Update: {
          profile_a?: string;
          profile_b?: string;
        };
        Relationships: [
          {
            foreignKeyName: "connections_profile_a_fkey";
            columns: ["profile_a"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "connections_profile_b_fkey";
            columns: ["profile_b"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      conversation_members: {
        Row: {
          conversation_id: string;
          profile_id: string;
        };
        ComputedFields: never;
        Insert: {
          conversation_id: string;
          profile_id: string;
        };
        Update: {
          conversation_id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversation_members_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      conversations: {
        Row: {
          created_at: string;
          id: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      couple_invitations: {
        Row: {
          created_at: string;
          expires_at: string;
          id: string;
          invitee_id: string;
          inviter_id: string;
          nickname: string;
          responded_at: string | null;
          status: string;
          username: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          invitee_id: string;
          inviter_id: string;
          nickname: string;
          responded_at?: string | null;
          status?: string;
          username: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string;
          id?: string;
          invitee_id?: string;
          inviter_id?: string;
          nickname?: string;
          responded_at?: string | null;
          status?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "couple_invitations_invitee_id_fkey";
            columns: ["invitee_id"];
            isOneToOne: false;
            referencedRelation: "users_private";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "couple_invitations_inviter_id_fkey";
            columns: ["inviter_id"];
            isOneToOne: false;
            referencedRelation: "users_private";
            referencedColumns: ["user_id"];
          },
        ];
      };
      messages: {
        Row: {
          body: string;
          conversation_id: string;
          created_at: string;
          id: string;
          sender_profile_id: string;
        };
        ComputedFields: never;
        Insert: {
          body: string;
          conversation_id: string;
          created_at?: string;
          id?: string;
          sender_profile_id: string;
        };
        Update: {
          body?: string;
          conversation_id?: string;
          created_at?: string;
          id?: string;
          sender_profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_profile_id_fkey";
            columns: ["sender_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profile_members: {
        Row: {
          consented_at: string;
          profile_id: string;
          profile_type: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          consented_at?: string;
          profile_id: string;
          profile_type: string;
          user_id: string;
        };
        Update: {
          consented_at?: string;
          profile_id?: string;
          profile_type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_members_profile_id_profile_type_fkey";
            columns: ["profile_id", "profile_type"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id", "type"];
          },
          {
            foreignKeyName: "profile_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_private";
            referencedColumns: ["user_id"];
          },
        ];
      };
      profile_visibility: {
        Row: {
          audience: string;
          profile_id: string;
        };
        ComputedFields: never;
        Insert: {
          audience?: string;
          profile_id: string;
        };
        Update: {
          audience?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_visibility_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_path: string | null;
          bio: string;
          city: string;
          connection_preferences: string[];
          created_at: string;
          id: string;
          interests: string[];
          nickname: string;
          state: string;
          type: string;
          username: string;
        };
        ComputedFields: never;
        Insert: {
          avatar_path?: string | null;
          bio?: string;
          city: string;
          connection_preferences?: string[];
          created_at?: string;
          id?: string;
          interests?: string[];
          nickname: string;
          state: string;
          type: string;
          username: string;
        };
        Update: {
          avatar_path?: string | null;
          bio?: string;
          city?: string;
          connection_preferences?: string[];
          created_at?: string;
          id?: string;
          interests?: string[];
          nickname?: string;
          state?: string;
          type?: string;
          username?: string;
        };
        Relationships: [];
      };
      users_private: {
        Row: {
          adulthood_confirmed_at: string;
          birth_date: string;
          created_at: string;
          legal_name: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          adulthood_confirmed_at?: string;
          birth_date: string;
          created_at?: string;
          legal_name: string;
          user_id: string;
        };
        Update: {
          adulthood_confirmed_at?: string;
          birth_date?: string;
          created_at?: string;
          legal_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      cancel_couple_invitation: {
        Args: { p_invitation_id: string };
        Returns: undefined;
      };
      complete_onboarding: {
        Args: {
          p_adult_confirmed: boolean;
          p_bio?: string;
          p_birth_date: string;
          p_city: string;
          p_interests?: string[];
          p_legal_name: string;
          p_nickname: string;
          p_preferences?: string[];
          p_state: string;
          p_username: string;
        };
        Returns: string;
      };
      get_profile: {
        Args: { p_profile_id: string };
        Returns: {
          avatar_path: string | null;
          bio: string;
          city: string;
          connection_preferences: string[];
          created_at: string;
          id: string;
          interests: string[];
          nickname: string;
          state: string;
          type: string;
          username: string;
        }[];
        SetofOptions: {
          from: "*";
          to: "profiles";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      invitation_partners: {
        Args: { p_invitation_id: string };
        Returns: {
          city: string;
          invitee_username: string;
          inviter_username: string;
          state: string;
        }[];
      };
      invite_couple: {
        Args: {
          p_nickname: string;
          p_partner_username: string;
          p_username: string;
        };
        Returns: string;
      };
      leave_couple: { Args: { p_profile_id: string }; Returns: undefined };
      respond_couple_invitation: {
        Args: { p_accept: boolean; p_invitation_id: string };
        Returns: string;
      };
      set_active_profile: {
        Args: { p_profile_id: string };
        Returns: undefined;
      };
      set_profile_avatar: {
        Args: { p_path: string; p_profile_id: string };
        Returns: undefined;
      };
      update_profile: {
        Args: {
          p_audience: string;
          p_bio: string;
          p_city: string;
          p_interests: string[];
          p_nickname: string;
          p_preferences: string[];
          p_profile_id: string;
          p_state: string;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
