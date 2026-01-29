import type { Video } from '@/types/video';

export const mockVideos: Video[] = [
  {
    id: '1',
    prompt: 'i2312312412124ad',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=600&fit=crop',
    duration: '16:9',
    quality: '1080p',
    aspectRatio: '16:9',
    createdAt: new Date('2024-01-20'),
    status: 'completed',
    videoUrl: '#',
  },
  {
    id: '2',
    prompt: '123123124124',
    thumbnail: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=700&fit=crop',
    duration: '9:16',
    quality: '1080p',
    aspectRatio: '9:16',
    createdAt: new Date('2024-01-20'),
    status: 'completed',
    videoUrl: '#',
  },
];

