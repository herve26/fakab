export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _permissionTorole: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_permissionTorole_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_permissionTorole_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          }
        ]
      }
      _roleTouser: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_roleTouser_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_roleTouser_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      connection: {
        Row: {
          created_at: string
          id: string
          provider_name: string
          providerid: string
          updated_at: string
          userid: string
        }
        Insert: {
          created_at?: string
          id: string
          provider_name: string
          providerid: string
          updated_at: string
          userid: string
        }
        Update: {
          created_at?: string
          id?: string
          provider_name?: string
          providerid?: string
          updated_at?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      customer_connection: {
        Row: {
          area: string
          assignement_date: string
          completion_date: string | null
          connection_type: string
          customer_address: string
          customer_contact: string
          customer_details: string
          geo_localization: string
          has_mdu: boolean
          path: Json | null
          so: string
          teamid: number | null
        }
        Insert: {
          area: string
          assignement_date?: string
          completion_date?: string | null
          connection_type: string
          customer_address: string
          customer_contact: string
          customer_details: string
          geo_localization: string
          has_mdu?: boolean
          path?: Json | null
          so: string
          teamid?: number | null
        }
        Update: {
          area?: string
          assignement_date?: string
          completion_date?: string | null
          connection_type?: string
          customer_address?: string
          customer_contact?: string
          customer_details?: string
          geo_localization?: string
          has_mdu?: boolean
          path?: Json | null
          so?: string
          teamid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_connection_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          }
        ]
      }
      document_resource: {
        Row: {
          content_type: string | null
          created_at: string
          customerid: string | null
          document_templateid: number | null
          id: number
          name: string
          path: string
          size: number | null
          tag: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          customerid?: string | null
          document_templateid?: number | null
          id?: number
          name: string
          path: string
          size?: number | null
          tag?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          customerid?: string | null
          document_templateid?: number | null
          id?: number
          name?: string
          path?: string
          size?: number | null
          tag?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_resource_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customer_connection"
            referencedColumns: ["so"]
          },
          {
            foreignKeyName: "document_resource_document_templateid_fkey"
            columns: ["document_templateid"]
            isOneToOne: false
            referencedRelation: "document_template"
            referencedColumns: ["documentid"]
          }
        ]
      }
      document_template: {
        Row: {
          created_at: string
          document_code: string
          document_desc: string | null
          document_name: string
          document_type: string | null
          documentid: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_code: string
          document_desc?: string | null
          document_name: string
          document_type?: string | null
          documentid?: number
          updated_at: string
        }
        Update: {
          created_at?: string
          document_code?: string
          document_desc?: string | null
          document_name?: string
          document_type?: string | null
          documentid?: number
          updated_at?: string
        }
        Relationships: []
      }
      employee: {
        Row: {
          email: string
          employeeid: number
          end_date: string | null
          first_name: string
          inchargeofid: number | null
          last_name: string
          start_date: string
          teamid: number | null
        }
        Insert: {
          email: string
          employeeid?: number
          end_date?: string | null
          first_name: string
          inchargeofid?: number | null
          last_name: string
          start_date: string
          teamid?: number | null
        }
        Update: {
          email?: string
          employeeid?: number
          end_date?: string | null
          first_name?: string
          inchargeofid?: number | null
          last_name?: string
          start_date?: string
          teamid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_inchargeofid_fkey"
            columns: ["inchargeofid"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          }
        ]
      }
      material: {
        Row: {
          material_code: string
          material_desc: string | null
          material_name: string
          material_unit_code: string
          materialid: number
        }
        Insert: {
          material_code: string
          material_desc?: string | null
          material_name: string
          material_unit_code: string
          materialid?: number
        }
        Update: {
          material_code?: string
          material_desc?: string | null
          material_name?: string
          material_unit_code?: string
          materialid?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_material_unit_code_fkey"
            columns: ["material_unit_code"]
            isOneToOne: false
            referencedRelation: "material_unit"
            referencedColumns: ["unit_code"]
          }
        ]
      }
      material_unit: {
        Row: {
          unit_code: string
          unit_name: string
        }
        Insert: {
          unit_code: string
          unit_name: string
        }
        Update: {
          unit_code?: string
          unit_name?: string
        }
        Relationships: []
      }
      material_used: {
        Row: {
          customerid: string
          materialid: number
          quantity: number
        }
        Insert: {
          customerid: string
          materialid: number
          quantity: number
        }
        Update: {
          customerid?: string
          materialid?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_used_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customer_connection"
            referencedColumns: ["so"]
          },
          {
            foreignKeyName: "material_used_materialid_fkey"
            columns: ["materialid"]
            isOneToOne: false
            referencedRelation: "material"
            referencedColumns: ["materialid"]
          },
          {
            foreignKeyName: "material_used_materialid_fkey"
            columns: ["materialid"]
            isOneToOne: false
            referencedRelation: "material_inventory"
            referencedColumns: ["materialid"]
          }
        ]
      }
      note: {
        Row: {
          content: string
          created_at: string
          id: string
          ownerid: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id: string
          ownerid: string
          title: string
          updated_at: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          ownerid?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_ownerid_fkey"
            columns: ["ownerid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      note_image: {
        Row: {
          alt_text: string | null
          blob: string
          content_type: string
          created_at: string
          id: string
          noteid: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          blob: string
          content_type: string
          created_at?: string
          id: string
          noteid: string
          updated_at: string
        }
        Update: {
          alt_text?: string | null
          blob?: string
          content_type?: string
          created_at?: string
          id?: string
          noteid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_image_noteid_fkey"
            columns: ["noteid"]
            isOneToOne: false
            referencedRelation: "note"
            referencedColumns: ["id"]
          }
        ]
      }
      order: {
        Row: {
          order_date: string
          orderid: number
          status: Database["public"]["Enums"]["order_status"]
          supplierid: number | null
        }
        Insert: {
          order_date: string
          orderid?: number
          status?: Database["public"]["Enums"]["order_status"]
          supplierid?: number | null
        }
        Update: {
          order_date?: string
          orderid?: number
          status?: Database["public"]["Enums"]["order_status"]
          supplierid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_supplierid_fkey"
            columns: ["supplierid"]
            isOneToOne: false
            referencedRelation: "supplier"
            referencedColumns: ["supplierid"]
          }
        ]
      }
      order_detail: {
        Row: {
          materialid: number
          order_detailid: number
          order_quantity: number
          orderid: number
          received_date: string | null
          unit_price: number | null
        }
        Insert: {
          materialid: number
          order_detailid?: number
          order_quantity: number
          orderid: number
          received_date?: string | null
          unit_price?: number | null
        }
        Update: {
          materialid?: number
          order_detailid?: number
          order_quantity?: number
          orderid?: number
          received_date?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_detail_materialid_fkey"
            columns: ["materialid"]
            isOneToOne: false
            referencedRelation: "material"
            referencedColumns: ["materialid"]
          },
          {
            foreignKeyName: "order_detail_materialid_fkey"
            columns: ["materialid"]
            isOneToOne: false
            referencedRelation: "material_inventory"
            referencedColumns: ["materialid"]
          },
          {
            foreignKeyName: "order_detail_orderid_fkey"
            columns: ["orderid"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["orderid"]
          },
          {
            foreignKeyName: "order_detail_orderid_fkey"
            columns: ["orderid"]
            isOneToOne: false
            referencedRelation: "order_summary"
            referencedColumns: ["orderid"]
          }
        ]
      }
      password: {
        Row: {
          hash: string
          userid: string
        }
        Insert: {
          hash: string
          userid: string
        }
        Update: {
          hash?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      permission: {
        Row: {
          access: string
          action: string
          created_at: string
          description: string
          entity: string
          id: string
          updated_at: string
        }
        Insert: {
          access: string
          action: string
          created_at?: string
          description?: string
          entity: string
          id: string
          updated_at: string
        }
        Update: {
          access?: string
          action?: string
          created_at?: string
          description?: string
          entity?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      role: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id: string
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      session: {
        Row: {
          created_at: string
          expiration_date: string
          id: string
          updated_at: string
          userid: string
        }
        Insert: {
          created_at?: string
          expiration_date: string
          id: string
          updated_at: string
          userid: string
        }
        Update: {
          created_at?: string
          expiration_date?: string
          id?: string
          updated_at?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      supplier: {
        Row: {
          address: string | null
          contact_person: string | null
          email: string | null
          phonenumber: string | null
          supplier_name: string
          supplier_type: Database["public"]["Enums"]["supplier_type"]
          supplierid: number
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          email?: string | null
          phonenumber?: string | null
          supplier_name: string
          supplier_type?: Database["public"]["Enums"]["supplier_type"]
          supplierid?: number
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          email?: string | null
          phonenumber?: string | null
          supplier_name?: string
          supplier_type?: Database["public"]["Enums"]["supplier_type"]
          supplierid?: number
        }
        Relationships: []
      }
      team: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      team_material: {
        Row: {
          materialid: number
          quantity: number
          teamid: number
        }
        Insert: {
          materialid: number
          quantity: number
          teamid: number
        }
        Update: {
          materialid?: number
          quantity?: number
          teamid?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_material_materialid_fkey"
            columns: ["materialid"]
            isOneToOne: false
            referencedRelation: "material"
            referencedColumns: ["materialid"]
          },
          {
            foreignKeyName: "team_material_materialid_fkey"
            columns: ["materialid"]
            isOneToOne: false
            referencedRelation: "material_inventory"
            referencedColumns: ["materialid"]
          },
          {
            foreignKeyName: "team_material_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          }
        ]
      }
      user: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string | null
          updatedAt: string
          username: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          name?: string | null
          updatedAt: string
          username: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          updatedAt?: string
          username?: string
        }
        Relationships: []
      }
      user_image: {
        Row: {
          alt_text: string | null
          blob: string
          content_type: string
          created_at: string
          id: string
          updated_at: string
          userid: string
        }
        Insert: {
          alt_text?: string | null
          blob: string
          content_type: string
          created_at?: string
          id: string
          updated_at: string
          userid: string
        }
        Update: {
          alt_text?: string | null
          blob?: string
          content_type?: string
          created_at?: string
          id?: string
          updated_at?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_image_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
      verification: {
        Row: {
          algorithm: string
          charset: string
          created_at: string
          digits: number
          expires_at: string | null
          id: string
          period: number
          secret: string
          target: string
          type: string
        }
        Insert: {
          algorithm: string
          charset: string
          created_at?: string
          digits: number
          expires_at?: string | null
          id: string
          period: number
          secret: string
          target: string
          type: string
        }
        Update: {
          algorithm?: string
          charset?: string
          created_at?: string
          digits?: number
          expires_at?: string | null
          id?: string
          period?: number
          secret?: string
          target?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      material_inventory: {
        Row: {
          instock: number | null
          material_code: string | null
          material_desc: string | null
          material_name: string | null
          materialid: number | null
          materialunit: string | null
          total: number | null
          totalused: number | null
        }
        Relationships: []
      }
      order_summary: {
        Row: {
          order_date: string | null
          order_details_count: number | null
          orderid: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          supplier_name: string | null
          supplierid: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_supplierid_fkey"
            columns: ["supplierid"]
            isOneToOne: false
            referencedRelation: "supplier"
            referencedColumns: ["supplierid"]
          }
        ]
      }
      team_summary: {
        Row: {
          incharge_first_name: string | null
          incharge_last_name: string | null
          member_count: number | null
          team_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_order: {
        Args: {
          order_date: string
          status: Database["public"]["Enums"]["order_status"]
          supplierid: number
          order_details_data: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      order_status: "PENDING" | "FULFILLED" | "CANCELLED"
      supplier_type: "MERCHANT" | "REFILL"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
