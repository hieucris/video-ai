export interface CreateVideoJobRequest {
  prompt: string;
  style_prompt?: string | null; // phong cách
  selected_images?: unknown; // Danh sách ảnh tham chiếu ["base64_image_1", "base64_image_2"]
  output_count: number; // Số video muốn AI xuất ra
  aspect_ratio: string; // Tỷ lệ khung hình 9:16 16:9 1:1
  enable_long: boolean; // Có cho phép video dài hơn mức mặc định không
  auto_merge: boolean; // Khi có nhiều scene → tự ghép thành 1 video
  scene_count?: number | null; // Số lượng cảnh mong muốn.
  character_name?: string | null; // Tên nhân vật cố định
  character_description?: string | null; // Mô tả chi tiết để giữ nhân vật ổn định giữa nhiều lần gen
  scenes?: unknown; // Dùng khi muốn chia kịch bản thành nhiều cảnh
  scene_images?: unknown; // Ảnh riêng cho từng scene
  enable_character_consistency: boolean; // Giữ nhân vật giống nhau giữa nhiều lần generate
  mode: string; // short || long
}
