import {
  LayoutDashboard,
  Image,
  Video,
  Music,
  Mic,
  Sparkles,
  Wand2,
  Palette,
  AudioLines,
  Film,
  FileImage,
} from 'lucide-react';
import type { MenuGroup } from '@/types/menu';

export const MENU_GROUPS: MenuGroup[] = [
  {
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        path: '/',
      },
      {
        id: 'text-to-image',
        label: 'Text-to-Image',
        icon: Image,
        path: '/text-to-image',
      },
      {
        id: 'text-to-video',
        label: 'Text-to-Video',
        icon: Video,
        path: '/text-to-video',
      },
      {
        id: 'text-to-animation',
        label: 'Text-to-Animation',
        icon: Sparkles,
        path: '/text-to-animation',
      },
      {
        id: 'text-to-music',
        label: 'Text-to-Music',
        icon: Music,
        path: '/text-to-music',
      },
      {
        id: 'text-to-voice',
        label: 'Text-to-Voice',
        icon: Mic,
        path: '/text-to-voice',
      },
      {
        id: 'text-to-3d',
        label: 'Text-to-3D',
        icon: Wand2,
        path: '/text-to-3d',
      },
      {
        id: 'image-to-video',
        label: 'Image-to-Video',
        icon: Film,
        path: '/image-to-video',
      },
      {
        id: 'audio-enhancement',
        label: 'Audio Enhancement',
        icon: AudioLines,
        path: '/audio-enhancement',
      },
      {
        id: 'style-transfer',
        label: 'Style Transfer',
        icon: Palette,
        path: '/style-transfer',
      },
      {
        id: 'image-upscale',
        label: 'Image Upscale',
        icon: FileImage,
        path: '/image-upscale',
      },
    ],
  },
];

