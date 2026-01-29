// Upload Image Response
export interface UploadedImage {
  id: number;
  image_url: string;
  createdAt: string;
}

export interface CreateVideoJobRequest {
  prompt: string;
  style_prompt: string | null; // phong cách
  selected_images: number[] | null; // Danh sách ID ảnh đã upload [2183, 2184]
  output_count: number; // Số video muốn AI xuất ra
  aspect_ratio: 'portrait' | 'landscape' | 'square'; // portrait = 9:16, landscape = 16:9, square = 1:1
  enable_long: boolean; // Có cho phép video dài hơn mức mặc định không
  auto_merge: boolean; // Khi có nhiều scene → tự ghép thành 1 video
  scene_count: number | null; // Số lượng cảnh mong muốn.
  character_name: string | null; // Tên nhân vật cố định
  character_description: string | null; // Mô tả chi tiết để giữ nhân vật ổn định giữa nhiều lần gen
  scenes: unknown | null; // Dùng khi muốn chia kịch bản thành nhiều cảnh
  scene_images: unknown | null; // Ảnh riêng cho từng scene
  enable_character_consistency: boolean; // Giữ nhân vật giống nhau giữa nhiều lần generate
  mode: 'short' | 'long'; // short || long
}

export interface CreateVideoJobResponse {
  success: boolean;
  message?: string;
  data?: {
    job_id: string;
    status: string;
    [key: string]: unknown;
  };
}

// Video Job Status Types
export type VideoJobStatus = 'queued' | 'processing' | 'merging' | 'completed' | 'failed' | 'done';

export interface VideoJobResult {
  id: number;
  video_ai_job_id: number;
  provider_job_id: string;
  profile_key: string;
  result_url: string | null;
  result_thumbnail: string | null;
  scene_index: number;
  scene_prompt: string;
  scene_image: string | null;
  status: VideoJobStatus;
  order: number;
  error_message: string | null;
  retry_count: number;
  last_retry_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoJob {
  id: number;
  user_id: number;
  mode: 'short' | 'long';
  prompt: string;
  style_prompt: string | null;
  output_count: number;
  aspect_ratio: 'portrait' | 'landscape' | 'square';
  enable_long: boolean;
  auto_merge: boolean;
  scene_count: number | null;
  character_name: string | null;
  character_description: string | null;
  character_images: unknown | null;
  scenes: unknown | null;
  scene_images: unknown | null;
  parts: unknown | null;
  status: VideoJobStatus;
  progress: number; // 0-100
  result_urls: string[];
  result_thumbnails: string[];
  provider_job_ids: string[];
  profile_key: string | null;
  error_message: string | null;
  retry_count: number;
  last_retry_at: string | null;
  created_at: string;
  updated_at: string;
  has_final: boolean;
  results: VideoJobResult[];
  merged_video_url: string | null;
  segment_video_urls: string[];
  is_merged: boolean;
}

export interface GetVideoJobsResponse {
  current_page: number;
  data: VideoJob[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
