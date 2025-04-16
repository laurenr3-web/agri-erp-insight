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
      equipment: {
        Row: {
          category: string | null
          created_at: string | null
          farm_id: string | null
          id: number
          image: string | null
          last_wear_update: string | null
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          notes: string | null
          owner_id: string | null
          purchase_date: string | null
          serial_number: string | null
          status: string | null
          type: string | null
          unite_d_usure: string
          updated_at: string | null
          valeur_actuelle: number | null
          year: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          farm_id?: string | null
          id?: number
          image?: string | null
          last_wear_update?: string | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          notes?: string | null
          owner_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          type?: string | null
          unite_d_usure?: string
          updated_at?: string | null
          valeur_actuelle?: number | null
          year?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          farm_id?: string | null
          id?: number
          image?: string | null
          last_wear_update?: string | null
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          type?: string | null
          unite_d_usure?: string
          updated_at?: string | null
          valeur_actuelle?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_documents: {
        Row: {
          content_type: string | null
          equipment_id: string | null
          file_name: string
          file_path: string
          id: string
          metadata: Json | null
          size_bytes: number | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          equipment_id?: string | null
          file_name: string
          file_path: string
          id?: string
          metadata?: Json | null
          size_bytes?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          equipment_id?: string | null
          file_name?: string
          file_path?: string
          id?: string
          metadata?: Json | null
          size_bytes?: number | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      equipment_logs: {
        Row: {
          created_at: string | null
          date: string
          duree: number | null
          employe: string | null
          employe_name: string | null
          equipment_id: number | null
          id: string
          note: string | null
          session_id: number | null
          type_de_tache: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          duree?: number | null
          employe?: string | null
          employe_name?: string | null
          equipment_id?: number | null
          id?: string
          note?: string | null
          session_id?: number | null
          type_de_tache: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          duree?: number | null
          employe?: string | null
          employe_name?: string | null
          equipment_id?: number | null
          id?: string
          note?: string | null
          session_id?: number | null
          type_de_tache?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_logs_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_maintenance_schedule: {
        Row: {
          completed: boolean | null
          completed_date: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          equipment_id: number | null
          id: number
          priority: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: number | null
          id?: number
          priority?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          equipment_id?: number | null
          id?: number
          priority?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_maintenance_schedule_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_qrcodes: {
        Row: {
          active: boolean
          created_at: string
          equipment_id: number
          id: string
          last_scanned: string | null
          qr_code_hash: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          equipment_id: number
          id?: string
          last_scanned?: string | null
          qr_code_hash: string
        }
        Update: {
          active?: boolean
          created_at?: string
          equipment_id?: number
          id?: string
          last_scanned?: string | null
          qr_code_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_qrcodes_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string
          default_currency: string | null
          description: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          owner_id: string
          phone: string | null
          registration_number: string | null
          size: number | null
          size_unit: string | null
          updated_at: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          default_currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          owner_id: string
          phone?: string | null
          registration_number?: string | null
          size?: number | null
          size_unit?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          default_currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          registration_number?: string | null
          size?: number | null
          size_unit?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      interventions: {
        Row: {
          active_since: string | null
          coordinates: Json | null
          created_at: string | null
          current_duration: string | null
          date: string
          description: string | null
          duration: number | null
          equipment: string
          equipment_id: number
          id: number
          location: string
          notes: string | null
          owner_id: string | null
          parts_used: Json | null
          priority: string
          scheduled_duration: number | null
          status: string
          task_type_id: string | null
          technician: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active_since?: string | null
          coordinates?: Json | null
          created_at?: string | null
          current_duration?: string | null
          date: string
          description?: string | null
          duration?: number | null
          equipment: string
          equipment_id: number
          id?: never
          location: string
          notes?: string | null
          owner_id?: string | null
          parts_used?: Json | null
          priority: string
          scheduled_duration?: number | null
          status: string
          task_type_id?: string | null
          technician: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active_since?: string | null
          coordinates?: Json | null
          created_at?: string | null
          current_duration?: string | null
          date?: string
          description?: string | null
          duration?: number | null
          equipment?: string
          equipment_id?: number
          id?: never
          location?: string
          notes?: string | null
          owner_id?: string | null
          parts_used?: Json | null
          priority?: string
          scheduled_duration?: number | null
          status?: string
          task_type_id?: string | null
          technician?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interventions_task_type_id_fkey"
            columns: ["task_type_id"]
            isOneToOne: false
            referencedRelation: "task_types"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_plans: {
        Row: {
          active: boolean
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string | null
          engine_hours: number | null
          equipment_id: number
          equipment_name: string
          frequency: string
          id: number
          interval: number
          last_performed_date: string | null
          next_due_date: string
          priority: string
          title: string
          type: string
          unit: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          engine_hours?: number | null
          equipment_id: number
          equipment_name: string
          frequency: string
          id?: number
          interval: number
          last_performed_date?: string | null
          next_due_date: string
          priority: string
          title: string
          type: string
          unit: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          engine_hours?: number | null
          equipment_id?: number
          equipment_name?: string
          frequency?: string
          id?: number
          interval?: number
          last_performed_date?: string | null
          next_due_date?: string
          priority?: string
          title?: string
          type?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          completed: boolean | null
          cost: number | null
          created_at: string | null
          description: string | null
          hours_at_maintenance: number | null
          id: string
          maintenance_type: string
          performed_at: string | null
          technician_id: string | null
          title: string | null
        }
        Insert: {
          completed?: boolean | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          hours_at_maintenance?: number | null
          id?: string
          maintenance_type: string
          performed_at?: string | null
          technician_id?: string | null
          title?: string | null
        }
        Update: {
          completed?: boolean | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          hours_at_maintenance?: number | null
          id?: string
          maintenance_type?: string
          performed_at?: string | null
          technician_id?: string | null
          title?: string | null
        }
        Relationships: []
      }
      maintenance_tasks: {
        Row: {
          actual_duration: number | null
          assigned_to: string | null
          completed_date: string | null
          created_at: string | null
          due_date: string | null
          equipment: string
          equipment_id: number
          estimated_duration: number | null
          id: number
          notes: string | null
          owner_id: string | null
          priority: string
          status: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          actual_duration?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string | null
          due_date?: string | null
          equipment: string
          equipment_id: number
          estimated_duration?: number | null
          id?: number
          notes?: string | null
          owner_id?: string | null
          priority: string
          status: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          actual_duration?: number | null
          assigned_to?: string | null
          completed_date?: string | null
          created_at?: string | null
          due_date?: string | null
          equipment?: string
          equipment_id?: number
          estimated_duration?: number | null
          id?: number
          notes?: string | null
          owner_id?: string | null
          priority?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          notification_preferences: Json
          push_notifications: boolean
          sms_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          notification_preferences?: Json
          push_notifications?: boolean
          sms_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          notification_preferences?: Json
          push_notifications?: boolean
          sms_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      parts_inventory: {
        Row: {
          category: string | null
          compatible_with: string[] | null
          created_at: string | null
          id: number
          image_url: string | null
          last_ordered: string | null
          location: string | null
          name: string
          owner_id: string | null
          part_number: string | null
          quantity: number
          reorder_threshold: number | null
          supplier: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          compatible_with?: string[] | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          last_ordered?: string | null
          location?: string | null
          name: string
          owner_id?: string | null
          part_number?: string | null
          quantity: number
          reorder_threshold?: number | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          compatible_with?: string[] | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          last_ordered?: string | null
          location?: string | null
          name?: string
          owner_id?: string | null
          part_number?: string | null
          quantity?: number
          reorder_threshold?: number | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      regional_preferences: {
        Row: {
          created_at: string
          currency: string
          date_format: string
          id: string
          language: string
          number_format: string
          time_format: string
          units_system: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          date_format?: string
          id?: string
          language?: string
          number_format?: string
          time_format?: string
          units_system?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          date_format?: string
          id?: string
          language?: string
          number_format?: string
          time_format?: string
          units_system?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_types: {
        Row: {
          affecte_compteur: boolean | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          affecte_compteur?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          affecte_compteur?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string | null
          farm_id: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          farm_id: string
          id?: string
          name: string
          phone?: string | null
          role: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          farm_id?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      time_sessions: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          custom_task_type: string | null
          duration: number | null
          end_time: string | null
          equipment_id: number | null
          id: string
          intervention_id: number | null
          location: string | null
          notes: string | null
          start_time: string
          status: string
          task_type_id: string | null
          technician: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          custom_task_type?: string | null
          duration?: number | null
          end_time?: string | null
          equipment_id?: number | null
          id?: string
          intervention_id?: number | null
          location?: string | null
          notes?: string | null
          start_time?: string
          status?: string
          task_type_id?: string | null
          technician?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          custom_task_type?: string | null
          duration?: number | null
          end_time?: string | null
          equipment_id?: number | null
          id?: string
          intervention_id?: number | null
          location?: string | null
          notes?: string | null
          start_time?: string
          status?: string
          task_type_id?: string | null
          technician?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_sessions_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_sessions_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_sessions_task_type_id_fkey"
            columns: ["task_type_id"]
            isOneToOne: false
            referencedRelation: "task_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          animations_enabled: boolean
          created_at: string
          date_format: string
          default_layout: string
          high_contrast: boolean
          id: string
          language: string
          notification_email: boolean
          notification_push: boolean
          notification_sms: boolean
          theme: string
          time_format: string
          units_system: string
          updated_at: string
          user_id: string
          widget_preferences: Json
        }
        Insert: {
          animations_enabled?: boolean
          created_at?: string
          date_format?: string
          default_layout?: string
          high_contrast?: boolean
          id?: string
          language?: string
          notification_email?: boolean
          notification_push?: boolean
          notification_sms?: boolean
          theme?: string
          time_format?: string
          units_system?: string
          updated_at?: string
          user_id: string
          widget_preferences?: Json
        }
        Update: {
          animations_enabled?: boolean
          created_at?: string
          date_format?: string
          default_layout?: string
          high_contrast?: boolean
          id?: string
          language?: string
          notification_email?: boolean
          notification_push?: boolean
          notification_sms?: boolean
          theme?: string
          time_format?: string
          units_system?: string
          updated_at?: string
          user_id?: string
          widget_preferences?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_db_documentation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_equipment_statistics: {
        Args: { p_equipment_id: string }
        Returns: {
          total_maintenance_cost: number
          maintenance_count: number
          average_days_between_maintenance: number
        }[]
      }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      wear_unit_type: "heures" | "kilometres" | "acres" | "autre"
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
      wear_unit_type: ["heures", "kilometres", "acres", "autre"],
    },
  },
} as const
