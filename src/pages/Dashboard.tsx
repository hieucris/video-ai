import React from 'react';
import { Sparkles } from 'lucide-react';
import { VideoGenerator } from '@/components/VideoGenerator';
import { VideoList } from '@/components/VideoList';
import { UserStatsCard } from '@/components/UserStatsCard';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { videos, isGenerating, generateVideo, handleImageUpload } = useVideoGeneration();

  return (
    <div className="space-y-8">
      {/* Page Header with Gradient Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 shadow-xl"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/30 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">AI - Text to Video</h1>
            <p className="text-purple-100 text-base">Tạo video từ ảnh và mô tả văn bản bằng AI - Nhanh chóng, dễ dàng, chuyên nghiệp</p>
          </div>
        </div>
      </motion.div>

      {/* User Stats */}
      <UserStatsCard />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar - Video Generator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-[380px] flex-shrink-0"
        >
          <VideoGenerator
            onGenerate={generateVideo}
            onImageUpload={handleImageUpload}
            isGenerating={isGenerating}
          />
        </motion.div>

        {/* Main Content - Video List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 w-full min-w-0"
        >
          <VideoList videos={videos} />
        </motion.div>
      </div>
    </div>
  );
};

