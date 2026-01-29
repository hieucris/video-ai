import type { Video } from '@/types/video';

export const mockVideos: Video[] = [
  {
    id: '1',
    prompt: 'Một buổi hoàng hôn tuyệt đẹp trên cánh đồng lúa vàng với những tia nắng cuối ngày',
    thumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=450&fit=crop',
    duration: '16:9',
    quality: '1080p',
    aspectRatio: '16:9',
    createdAt: new Date('2026-01-28'),
    status: 'completed',
    videoUrl: '#',
  },
  {
    id: '2',
    prompt: 'Cầu Golden Gate lung linh trong ánh hoàng hôn với bầu trời xanh tuyệt đẹp',
    thumbnail: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=450&h=800&fit=crop',
    duration: '9:16',
    quality: '1080p',
    aspectRatio: '9:16',
    createdAt: new Date('2026-01-29'),
    status: 'completed',
    videoUrl: '#',
  },
];

