import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Video } from '@/types/video';
import { motion } from 'framer-motion';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const isPortrait = video.aspectRatio === '9:16';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          {/* Video Thumbnail */}
          <div
            className={`relative w-full bg-gray-100 overflow-hidden ${
              isPortrait ? 'aspect-[9/16]' : 'aspect-video'
            }`}
          >
            <img
              src={video.thumbnail}
              alt={video.prompt}
              className="w-full h-full object-cover"
            />

            {/* Duration and Quality Badge */}
            <div className="absolute top-3 right-3 flex gap-2">
              <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded backdrop-blur-sm">
                {video.duration}
              </span>
              <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded backdrop-blur-sm">
                {video.quality}
              </span>
            </div>

            {/* Loading Overlay */}
            {video.status === 'generating' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 text-white animate-spin mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Đang tạo video...</p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt */}
          <div className="p-4">
            <p className="text-sm text-gray-700 line-clamp-2">{video.prompt}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

