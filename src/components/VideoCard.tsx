import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Play, Download, Eye, Calendar } from 'lucide-react';
import type { Video } from '@/types/video';
import { motion } from 'framer-motion';
import { formatDate } from '@/utils/format';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const isPortrait = video.aspectRatio === '9:16';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-200/80 bg-white group">
        <div className="relative">
          {/* Video Thumbnail */}
          <div
            className={`relative w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ${
              isPortrait ? 'aspect-[9/16]' : 'aspect-video'
            }`}
          >
            <img
              src={video.thumbnail}
              alt={video.prompt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay on Hover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            />

            {/* Duration and Quality Badge */}
            <div className="absolute top-3 right-3 flex gap-2">
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="px-2.5 py-1 bg-violet-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-lg"
              >
                {video.duration}
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.1 }}
                className="px-2.5 py-1 bg-purple-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-lg"
              >
                {video.quality}
              </motion.span>
            </div>

            {/* Play Button Overlay */}
            {video.status === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-colors"
                  aria-label="Play video"
                >
                  <Play className="h-7 w-7 text-violet-600 ml-1" fill="currentColor" />
                </motion.button>
              </motion.div>
            )}

            {/* Action Buttons on Hover */}
            {video.status === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 20
                }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-3 left-3 right-3 flex gap-2"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-white/95 backdrop-blur-md text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Xem
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Tải về
                </motion.button>
              </motion.div>
            )}

            {/* Loading Overlay */}
            {video.status === 'generating' && (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 to-purple-900/80 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-3" />
                    <div className="absolute inset-0 h-12 w-12 mx-auto blur-xl bg-white/50 animate-pulse" />
                  </div>
                  <p className="text-white text-base font-semibold mb-1">Đang tạo video...</p>
                  <p className="text-purple-200 text-sm">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt and Info */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-700 line-clamp-2 font-medium leading-relaxed">
              {video.prompt}
            </p>
            
            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(video.createdAt)}</span>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                video.status === 'completed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {video.status === 'completed' ? '✓ Hoàn thành' : '⟳ Đang xử lý'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

