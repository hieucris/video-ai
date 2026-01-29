/**
 * Login Request Types
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CustomerRole {
  [key: string]: number;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  facebook_id: string | null;
  activation_date: string;
  status: number;
  created_at: string;
  updated_at: string;
  date_expired: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  max_per_day: number;
  total_posts_today: number;
  total_posts_left_today: number;
  max_render_video_per_day: number;
  total_render_today: number;
  total_render_left_today: number;
  max_ai_video_per_day: number;
  total_ai_render_today: number;
  total_ai_render_left_today: number;
  max_video_ai_per_day: number;
  total_video_ai_render_today: number;
  total_video_ai_render_left_today: number;
  can_connect_personal_facebook: boolean;
  max_personal_facebook_groups: number;
  access_token: string | null;
  customer_role: CustomerRole;
  fb_name: string | null;
  threads_id: string | null;
  threads_access_token: string | null;
  tiktok_access_token: string | null;
  is_affiliate_partner: boolean;
  affiliate_code: string | null;
  affiliate_commission_rate: string | null;
  affiliate_partner: string | null;
}

export interface LoginResponse {
  success: boolean;
  access_token: string;
  token_type: string;
  data: UserData;
  message?: string;
  error?: string;
}

