import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2, Play, Download, Eye, Calendar, X, Trash2 } from 'lucide-react';
import type { Video } from '@/types/video';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/utils/format';

interface VideoCardProps {
  video: Video;
  onDelete?: (id: string) => Promise<void>;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete }) => {
  // const isPortrait = video.aspectRatio === '9:16';
  const [isHovered, setIsHovered] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePlayVideo = () => {
    if (video.videoUrl) {
      setShowVideoModal(true);
      // Disable body scroll khi modal mở
      document.body.style.overflow = 'hidden';
    }
  };

  const handleCloseModal = () => {
    setShowVideoModal(false);
    // Enable body scroll khi modal đóng
    document.body.style.overflow = 'unset';
  };

  // Cleanup scroll khi component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleDownload = () => {
    if (video.videoUrl) {
      const link = document.createElement('a');
      link.href = video.videoUrl;
      link.target = '_blank';
      link.download = `video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    console.log('handleDeleteClick', video.id);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(video.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete video';
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
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
              className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden aspect-video"
            >
              {/* Hiển thị thumbnail hoặc video preview */}
              {video.thumbnail && video.thumbnail.trim() !== '' ? (
                <img
                  src={video.thumbnail}
                  alt={video.prompt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : video.videoUrl ? (
                <video
                  src={video.videoUrl}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play className="h-12 w-12 text-gray-400" />
                </div>
              )}

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
                  {video.aspectRatio}
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="px-2.5 py-1 bg-purple-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-lg shadow-lg"
                >
                  {video.quality}
                </motion.span>
              </div>

              {/* Delete Button */}
              {onDelete && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-3 left-3 z-[9999]"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDeleteClick}
                    className="w-9 h-9 cursor-pointer bg-red-600/90 backdrop-blur-md rounded-lg flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                    aria-label="Delete video"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </motion.button>
                </motion.div>
              )}

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
                    onClick={handlePlayVideo}
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
                    onClick={handlePlayVideo}
                    className="flex-1 bg-white/95 backdrop-blur-md text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Xem
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Tải về
                  </motion.button>
                </motion.div>
              )}

              {/* Loading Overlay */}
              {video.status === 'generating' && (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 to-purple-900/80 flex flex-col items-center justify-center backdrop-blur-sm p-4">
                  <div className="text-center w-full">
                    <div className="relative mb-4">
                      <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-3" />
                      <div className="absolute inset-0 h-12 w-12 mx-auto blur-xl bg-white/50 animate-pulse" />
                    </div>
                    <p className="text-white text-base font-semibold mb-1">Đang tạo video...</p>

                    {/* Progress Bar */}
                    {video.progress !== undefined && (
                      <div className="w-full mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-purple-200 text-sm">Tiến độ</p>
                          <p className="text-white text-sm font-semibold">{video.progress}%</p>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${video.progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full shadow-lg"
                          />
                        </div>
                      </div>
                    )}

                    {!video.progress && (
                      <p className="text-purple-200 text-sm mt-2">Vui lòng chờ trong giây lát</p>
                    )}
                  </div>
                </div>
              )}

              {/* Failed Overlay */}
              {video.status === 'failed' && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-pink-900/80 flex items-center justify-center backdrop-blur-sm p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl">✕</span>
                    </div>
                    <p className="text-white text-base font-semibold mb-1">Tạo video thất bại</p>
                    {video.errorMessage && (
                      <p className="text-red-200 text-xs mt-2 line-clamp-2">{video.errorMessage}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt and Info */}
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700 line-clamp-2 font-medium leading-relaxed h-12 overflow-hidden">
                {video.prompt}
              </p>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(video.createdAt)}</span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${video.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : video.status === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                  }`}>
                  {video.status === 'completed'
                    ? '✓ Hoàn thành'
                    : video.status === 'failed'
                      ? '✕ Thất bại'
                      : `⟳ Đang xử lý ${video.progress ? `(${video.progress}%)` : ''}`
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Video Modal - Portal để không ảnh hưởng UI */}
      <AnimatePresence mode="wait">
        {showVideoModal && video.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
            onClick={handleCloseModal}
            style={{ margin: 0, padding: 0, overflow: 'hidden' }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full max-w-6xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseModal}
                className="absolute -top-14 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close video"
              >
                <X className="h-6 w-6" />
              </motion.button>

              {/* Video Player */}
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <video
                  src={video.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[85vh] object-contain"
                  style={{ display: 'block' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-white px-2"
              >
                <h3 className="text-base font-semibold mb-2">{video.prompt}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-white/10 rounded">Quality: {video.quality}</span>
                  <span className="px-2 py-1 bg-white/10 rounded">Ratio: {video.aspectRatio}</span>
                  <span className="px-2 py-1 bg-white/10 rounded">{formatDate(video.createdAt)}</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence mode="wait">
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-7 w-7 text-red-600" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xóa video này?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa video này không? Hành động này không thể hoàn tác.
              </p>

              {/* Video Preview */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  <span className="font-semibold">Prompt:</span> {video.prompt}
                </p>
                <p className="text-xs text-gray-500">
                  Tạo lúc: {formatDate(video.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Xóa</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

