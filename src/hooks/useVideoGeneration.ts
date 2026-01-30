import { useState, useCallback, useEffect, useRef } from 'react';
import type { Video, VideoGenerationParams, AspectRatio } from '@/types/video';
import { createVideoJob, getVideoJobs, uploadImage, deleteVideoJob } from '@/services/create-video.service';
import type { CreateVideoJobRequest, VideoJob } from '@/services/types/video/request.types';
import { authService } from '@/services/auth.service';
import { USER_INFO_REFRESHED_EVENT } from '@/hooks/useAuth';

/**
 * Convert aspect ratio to API format
 * 9:16 -> portrait
 * 16:9 -> landscape
 * 1:1 -> square
 */
const mapAspectRatioToApi = (aspectRatio: string): 'portrait' | 'landscape' | 'square' => {
  switch (aspectRatio) {
    case '9:16':
      return 'portrait';
    case '16:9':
      return 'landscape';
    case '1:1':
      return 'square';
    default:
      return 'portrait';
  }
};

/**
 * Convert API aspect ratio to UI format
 * portrait -> 9:16
 * landscape -> 16:9
 * square -> 1:1
 */
const mapAspectRatioFromApi = (aspectRatio: string): AspectRatio => {
  switch (aspectRatio) {
    case 'portrait':
      return '9:16';
    case 'landscape':
      return '16:9';
    default:
      return '16:9';
  }
};

/**
 * Convert API VideoJob to UI Video format
 */
const mapVideoJobToVideo = (job: VideoJob): Video => {
  const thumbnail = job.result_thumbnails?.[0] || job.results?.[0]?.result_thumbnail || '';
  const videoUrl = job.merged_video_url || job.result_urls?.[0] || job.results?.[0]?.result_url || undefined;
  
  let status: 'generating' | 'completed' | 'failed';
  if (job.status === 'failed') {
    status = 'failed';
  } else if (job.status === 'done' || (job.progress === 100 && videoUrl)) {
    status = 'completed';
  } else {
    status = 'generating';
  }

  return {
    id: job.id.toString(),
    prompt: job.prompt,
    thumbnail,
    duration: '0:00',
    quality: '1080p',
    aspectRatio: mapAspectRatioFromApi(job.aspect_ratio),
    videoUrl,
    createdAt: new Date(job.created_at),
    status,
    progress: job.progress,
    errorMessage: job.error_message || undefined,
  };
};

const POLLING_INTERVAL = 15000; // 15 seconds

export const useVideoGeneration = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Fetch all videos (done + processing) để hiển thị đầy đủ
   */
  const fetchAllVideos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await getVideoJobs(
        token, 
        ['done', 'processing'], 
        1,
        100,
        true
      );
      
      if (response.data && response.data.length > 0) {
        const allVideos = response.data.map(mapVideoJobToVideo);
        setVideos(allVideos);
        console.log(`📹 Fetched ${allVideos.length} videos (done + processing)`);
      } else {
        console.log('📹 No videos found');
      }
    } catch (error) {
      console.error('Error fetching all videos:', error);
    }
  }, []);

  /**
   * Fetch and update video jobs status (đang xử lý)
   */
  const fetchVideoJobsInProgress = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found');
        return false;
      }

      console.log('🔄 Polling: Fetching videos in progress...');
      
      const response = await getVideoJobs(
        token, 
        ['queued', 'processing', 'merging', 'failed'],
        1,
        100,
        true
      );
      
      console.log(`📊 Response: total=${response.total}, data.length=${response.data?.length || 0}`);
      
      if (response.total === 0) {
        console.log('✅ total = 0 → No videos in progress! Stopping polling...');
        console.log('🔄 Fetching completed videos...');
        await fetchAllVideos();
        return true;
      }
      
      // Filter chỉ lấy video có status "processing" hoặc "queued"
      const filteredJobs = response.data.filter(
        job => job.status === 'processing' || job.status === 'queued'
      );
      
      console.log(`🔍 Filtered: ${filteredJobs.length} videos (processing/queued) from ${response.data.length} total`);
      
      if (filteredJobs.length === 0) {
        console.log('✅ No videos with status processing/queued! Stopping polling...');
        console.log('🔄 Fetching completed videos...');
        await fetchAllVideos();
        return true;
      }
      
      const apiVideos = filteredJobs.map(mapVideoJobToVideo);
      console.log(`✅ Mapped ${apiVideos.length} videos:`, apiVideos.map(v => `ID:${v.id} Status:${v.status} Progress:${v.progress}%`));
      
      setVideos(prev => {
        const updatedVideos = [...prev];
        
        apiVideos.forEach(apiVideo => {
          const existingIndex = updatedVideos.findIndex(v => v.id === apiVideo.id);
          if (existingIndex !== -1) {
            updatedVideos[existingIndex] = {
              ...updatedVideos[existingIndex],
              ...apiVideo,
            };
          } else {
            updatedVideos.unshift(apiVideo);
          }
        });
        
        return updatedVideos;
      });
      
      console.log('⏳ Continue polling in 15s...');
      return false;
    } catch (error) {
      console.error('Error fetching video jobs:', error);
      return false;
    }
  }, [fetchAllVideos]);

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  /**
   * Start polling for video job updates
   */
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    fetchVideoJobsInProgress().then(shouldStop => {
      if (shouldStop) {
        stopPolling();
        return;
      }
    });

    pollingIntervalRef.current = setInterval(async () => {
      const shouldStop = await fetchVideoJobsInProgress();
      if (shouldStop) {
        stopPolling();
      }
    }, POLLING_INTERVAL);
  }, [fetchVideoJobsInProgress, stopPolling]);

  /**
   * Initialize: Load all videos và start polling on mount
   */
  useEffect(() => {
    console.log('🚀 Initializing video generation hook...');
    fetchAllVideos();
    startPolling();

    return () => {
      console.log('🛑 Cleaning up polling...');
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Upload image and return image ID
   */
  const handleImageUpload = useCallback(async (file: File): Promise<number> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log('📤 Uploading image...');
      const uploadedImage = await uploadImage(file, token);
      
      if (uploadedImage && uploadedImage.id) {
        const imageId = uploadedImage.id;
        console.log('✅ Image uploaded successfully, ID:', imageId);
        return imageId;
      }
      
      throw new Error('No image ID returned from server');
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  }, []);

  const generateVideo = useCallback(async (params: VideoGenerationParams) => {
    setIsGenerating(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const selectedImageIds: number[] | null = params.imageId ? [params.imageId] : null;

      const requestData: CreateVideoJobRequest = {
        prompt: params.prompt,
        style_prompt: null,
        selected_images: selectedImageIds,
        output_count: 1,
        aspect_ratio: mapAspectRatioToApi(params.aspectRatio),
        enable_long: false,
        auto_merge: true,
        scene_count: null,
        character_name: null,
        character_description: null,
        scenes: null,
        scene_images: null,
        enable_character_consistency: false,
        mode: 'short',
      };

      console.log('🎬 Creating video job with data:', requestData);

      const response = await createVideoJob(requestData, token);

      console.log('✅ Video job created successfully:', response);
      
      // Refresh user info to get updated stats (video count, etc.)
      console.log('🔄 Refreshing user info...');
      try {
        await authService.getUserInfo();
        console.log('✅ User info refreshed');
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event(USER_INFO_REFRESHED_EVENT));
      } catch (error) {
        console.error('❌ Failed to refresh user info:', error);
      }
      
      console.log('🔄 Restarting polling for new video...');
      startPolling();

      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating video:', error);
      
      setIsGenerating(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate video';
      alert(errorMessage);
    }
  }, [startPolling]);

  const deleteVideo = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      console.log(`🗑️ Deleting video job ${id}...`);
      await deleteVideoJob(id, token);
      
      // Remove from local state after successful deletion
      setVideos(prev => prev.filter(v => v.id !== id));
      
      console.log(`✅ Video ${id} deleted successfully`);
      
      // Refresh user info to update stats
      try {
        await authService.getUserInfo();
        window.dispatchEvent(new Event(USER_INFO_REFRESHED_EVENT));
      } catch (error) {
        console.error('❌ Failed to refresh user info:', error);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete video';
      throw new Error(errorMessage);
    }
  }, []);

  return {
    videos,
    isGenerating,
    generateVideo,
    deleteVideo,
    handleImageUpload,
  };
};

