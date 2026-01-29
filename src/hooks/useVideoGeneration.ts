import { useState, useCallback } from 'react';
import type { Video, VideoGenerationParams } from '@/types/video';
import { mockVideos } from '@/data/mockVideos';

export const useVideoGeneration = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateVideo = useCallback(async (params: VideoGenerationParams) => {
    setIsGenerating(true);

    try {
      // Simulate API call - replace with actual API integration
      const newVideo: Video = {
        id: Date.now().toString(),
        prompt: params.prompt,
        thumbnail: params.image ? URL.createObjectURL(params.image) : 'https://via.placeholder.com/400x600',
        duration: params.aspectRatio === '16:9' ? '16:9' : '9:16',
        quality: params.quality,
        aspectRatio: params.aspectRatio,
        createdAt: new Date(),
        status: 'generating',
      };

      setVideos(prev => [newVideo, ...prev]);

      // Simulate video generation
      setTimeout(() => {
        setVideos(prev =>
          prev.map(v =>
            v.id === newVideo.id
              ? { ...v, status: 'completed' as const, videoUrl: '#' }
              : v
          )
        );
        setIsGenerating(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating video:', error);
      setIsGenerating(false);
    }
  }, []);

  const deleteVideo = useCallback((id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  }, []);

  return {
    videos,
    isGenerating,
    generateVideo,
    deleteVideo,
  };
};

