import React, { useState, useMemo } from 'react';
import { VideoCard } from './VideoCard';
import type { Video } from '@/types/video';
import { motion } from 'framer-motion';
import { Film, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoListProps {
  videos: Video[];
  onDeleteVideo?: (id: string) => Promise<void>;
}

const VIDEOS_PER_PAGE = 6;

export const VideoList: React.FC<VideoListProps> = ({ videos, onDeleteVideo }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const startIndex = (currentPage - 1) * VIDEOS_PER_PAGE;
  const endIndex = startIndex + VIDEOS_PER_PAGE;
  const currentVideos = useMemo(() => videos.slice(startIndex, endIndex), [videos, startIndex, endIndex]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center min-h-[500px]"
      >
        <div className="text-center max-w-md">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg"
          >
            <Film className="h-12 w-12 text-violet-600" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Chưa có video nào
          </h3>
          <p className="text-gray-600 mb-2">
            Bắt đầu tạo video đầu tiên của bạn bằng AI
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Tải ảnh lên và nhập mô tả để bắt đầu
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Video đã tạo
              </h2>
              <p className="text-sm text-gray-600">
                {videos.length} video • Trang {currentPage}/{totalPages}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-violet-600">{videos.length}</p>
              <p className="text-xs text-gray-500">Tổng số</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {videos.filter(v => v.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500">Hoàn thành</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video Grid */}
      <motion.div
        key={currentPage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {currentVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <VideoCard video={video} onDelete={onDeleteVideo} />
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-2"
        >
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-violet-50 hover:text-violet-600 border border-gray-200 shadow-sm'
              }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trước</span>
          </motion.button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              const showEllipsis =
                (page === currentPage - 2 && currentPage > 3) ||
                (page === currentPage + 2 && currentPage < totalPages - 2);

              if (showEllipsis) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }

              if (!showPage) return null;

              return (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white text-gray-700 hover:bg-violet-50 hover:text-violet-600 border border-gray-200'
                    }`}
                >
                  {page}
                </motion.button>
              );
            })}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-violet-50 hover:text-violet-600 border border-gray-200 shadow-sm'
              }`}
          >
            <span className="hidden sm:inline">Sau</span>
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

