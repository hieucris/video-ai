import {
  LayoutDashboard,
  Menu as MenuIcon,
  PlusCircle,
  Video,
  Film,
  FileText,
  DollarSign,
  TrendingUp,
  Music,
  Youtube,
  Instagram,
  Calendar,
  Heart,
  MessageCircle,
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
        id: 'content-manager',
        label: 'Danh mục Content',
        icon: MenuIcon,
        path: '/content-manager',
      },
      {
        id: 'create-content',
        label: 'Tạo content mới',
        icon: PlusCircle,
        path: '/create-content',
      },
      {
        id: 'ai-text-to-video',
        label: 'AI - Text to Video',
        icon: Video,
        path: '/ai-text-to-video',
      },
      {
        id: 'video-editor',
        label: 'Video Editor',
        icon: Film,
        path: '/video-editor',
      },
      {
        id: 'scheduled-content',
        label: 'Content đã thích',
        icon: FileText,
        path: '/scheduled-content',
      },
      {
        id: 'ads-running',
        label: 'Đang chạy Ads',
        icon: DollarSign,
        path: '/ads-running',
      },
      {
        id: 'performance',
        label: 'Đang thịnh hành',
        icon: TrendingUp,
        path: '/performance',
      },
      {
        id: 'douyin-manager',
        label: 'Quản lý Douyin',
        icon: Music,
        path: '/douyin-manager',
      },
      {
        id: 'tiktok-manager',
        label: 'Quản lý Tiktok',
        icon: Music,
        path: '/tiktok-manager',
      },
      {
        id: 'threads-manager',
        label: 'Quản lý Threads',
        icon: MessageCircle,
        path: '/threads-manager',
      },
      {
        id: 'youtube-manager',
        label: 'Quản lý YouTube',
        icon: Youtube,
        path: '/youtube-manager',
      },
      {
        id: 'instagram',
        label: 'Instagram',
        icon: Instagram,
        path: '/instagram',
      },
      {
        id: 'calendar',
        label: 'Lên lịch đăng bài',
        icon: Calendar,
        path: '/calendar',
      },
      {
        id: 'special-reader',
        label: 'Theo dõi đặc biệt',
        icon: Heart,
        path: '/special-reader',
      },
    ],
  },
];

