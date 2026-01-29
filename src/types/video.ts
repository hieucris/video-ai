export type AspectRatio = '9:16' | '16:9';

export type VideoQuality = '720p' | '1080p';

export interface Video {
  id: string;
  prompt: string;
  thumbnail: string;
  duration: string;
  quality: VideoQuality;
  aspectRatio: AspectRatio;
  videoUrl?: string;
  createdAt: Date;
  status: 'generating' | 'completed' | 'failed';
  progress?: number; // 0-100
  errorMessage?: string;
}

export interface VideoGenerationParams {
  prompt: string;
  imageId?: number | null; // Image ID after upload
  aspectRatio: AspectRatio;
  quality: VideoQuality;
}

