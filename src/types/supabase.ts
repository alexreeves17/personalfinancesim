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
      profiles: {
        Row: {
          id: string
          financial_profile: Json
          allocation: Json
          updated_at: string
        }
        Insert: {
          id: string
          financial_profile?: Json
          allocation?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          financial_profile?: Json
          allocation?: Json
          updated_at?: string
        }
      }
    }
  }
}