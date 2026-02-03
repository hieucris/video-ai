import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants';

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File quá lớn! Kích thước tối đa là ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Định dạng file không hợp lệ! Chỉ chấp nhận: JPG, PNG, WebP, GIF',
    };
  }

  return { valid: true };
};

/**
 * Validate prompt text
 */
export const validatePrompt = (prompt: string): { valid: boolean; error?: string } => {
  const trimmedPrompt = prompt.trim();

  if (trimmedPrompt.length === 0) {
    return {
      valid: false,
      error: 'Vui lòng nhập mô tả cho video',
    };
  }

  if (trimmedPrompt.length < 3) {
    return {
      valid: false,
      error: 'Mô tả quá ngắn! Vui lòng nhập ít nhất 3 ký tự',
    };
  }

  return { valid: true };
};

