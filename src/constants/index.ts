import type { VideoQuality, AspectRatio } from '@/types/video';

export const VIDEO_QUALITIES: { value: VideoQuality; label: string }[] = [
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' },
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '9:16', label: '9:16', icon: 'smartphone' },
  { value: '16:9', label: '16:9', icon: 'monitor' },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const VIDEO_GENERATION_TIMEOUT = 60000; // 60 seconds

export const APP_CONFIG = {
  name: 'Video AI Generator',
  description: 'Tạo video từ ảnh và prompt với AI',
  version: '1.0.0',
};

