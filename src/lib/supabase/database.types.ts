
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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          intent: 'job_hunt' | 'freelance' | 'founder' | 'personal_branding' | null
          created_at: string
          onboarded: boolean
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          intent?: 'job_hunt' | 'freelance' | 'founder' | 'personal_branding' | null
          created_at?: string
          onboarded?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          intent?: 'job_hunt' | 'freelance' | 'founder' | 'personal_branding' | null
          created_at?: string
          onboarded?: boolean
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          source_type: 'upload' | 'linkedin' | 'qna' | null
          original_file_url: string | null
          extracted_data: Json | null
          final_cv_text: string | null
          version_number: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_type?: 'upload' | 'linkedin' | 'qna' | null
          original_file_url?: string | null
          extracted_data?: Json | null
          final_cv_text?: string | null
          version_number?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_type?: 'upload' | 'linkedin' | 'qna' | null
          original_file_url?: string | null
          extracted_data?: Json | null
          final_cv_text?: string | null
          version_number?: number
          created_at?: string
        }
      }
      cover_letters: {
        Row: {
          id: string
          user_id: string
          job_title: string | null
          company: string | null
          input_jd_text: string | null
          final_letter_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_title?: string | null
          company?: string | null
          input_jd_text?: string | null
          final_letter_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_title?: string | null
          company?: string | null
          input_jd_text?: string | null
          final_letter_text?: string | null
          created_at?: string
        }
      }
      portfolio_sites: {
        Row: {
          id: string
          user_id: string
          theme: 'dev' | 'pm' | 'marketer' | 'founder' | 'business' | null
          final_html_url: string | null
          editable_copy: Json | null
          subdomain: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'dev' | 'pm' | 'marketer' | 'founder' | 'business' | null
          final_html_url?: string | null
          editable_copy?: Json | null
          subdomain?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'dev' | 'pm' | 'marketer' | 'founder' | 'business' | null
          final_html_url?: string | null
          editable_copy?: Json | null
          subdomain?: string | null
          created_at?: string
        }
      }
    }
  }
}
