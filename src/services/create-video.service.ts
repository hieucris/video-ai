import axios from 'axios';
import type { 
  CreateVideoJobRequest, 
  CreateVideoJobResponse,
  GetVideoJobsResponse,
  VideoJobStatus,
  UploadedImage
} from './types/video/request.types';

// Use proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // Proxy through Vite dev server
  : 'https://system.kingcontent.pro/api/v1';  // Direct URL in production

/**
 * Upload image to server
 * @param file - Image file to upload
 * @param token - Authentication token
 * @returns Promise with uploaded image data including ID
 */
export const uploadImage = async (
  file: File,
  token: string
): Promise<UploadedImage> => {
  try {
    const formData = new FormData();
    formData.append('image', file); // ← Field name is 'image' not 'images'

    console.log('📤 Uploading image:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const response = await axios.post<UploadedImage>(
      `${API_BASE_URL}/user/video-ai/images`,
      formData,
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `Bearer ${token}`,
          // Let axios set Content-Type with boundary automatically
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }
    );
    
    console.log('✅ Upload response:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data;
      console.error('❌ Upload error:', errorDetails || errorMessage);
      throw new Error(`Failed to upload image: ${errorMessage}`);
    }
    throw error;
  }
};

/**
 * Create a video generation job
 * @param data - Video generation parameters
 * @param token - Authentication token
 * @returns Promise with the API response
 */
export const createVideoJob = async (
  data: CreateVideoJobRequest,
  token: string
): Promise<CreateVideoJobResponse> => {
  try {
    const response = await axios.post<CreateVideoJobResponse>(
      `${API_BASE_URL}/user/video-ai/jobs`,
      data,
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

/**
 * Get video jobs by status
 * @param token - Authentication token
 * @param statuses - Array of job statuses to filter
 * @param page - Page number (default: 1)
 * @param perPage - Number of items per page (default: 12)
 * @param withResults - Include results data (default: true)
 * @returns Promise with paginated video jobs
 */
export const getVideoJobs = async (
  token: string,
  statuses: VideoJobStatus[] = ['queued', 'processing', 'merging'],
  page: number = 1,
  perPage: number = 100,
  withResults: boolean = true
): Promise<GetVideoJobsResponse> => {
  try {
    const statusParam = statuses.join(',');
    const response = await axios.get<GetVideoJobsResponse>(
      `${API_BASE_URL}/user/video-ai/jobs`,
      {
        params: {
          status: statusParam,
          page,
          per_page: perPage,
          with_results: withResults,
        },
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

/**
 * Delete a video job
 * @param jobId - ID of the video job to delete
 * @param token - Authentication token
 * @returns Promise with the API response
 */
export const deleteVideoJob = async (
  jobId: string,
  token: string
): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/user/video-ai/jobs/${jobId}`,
      {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      }
    );
    
    console.log(`✅ Video job ${jobId} deleted successfully`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to delete video: ${errorMessage}`);
    }
    throw error;
  }
};