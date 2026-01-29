import React from 'react';
import { Video } from 'lucide-react';
import { VideoGenerator } from '@/components/VideoGenerator';
import { VideoList } from '@/components/VideoList';
import { useVideoGeneration } from '@/hooks/useVideoGeneration';

export const Dashboard: React.FC = () => {
  const { videos, isGenerating, generateVideo } = useVideoGeneration();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
          <Video className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI - Text to Video</h1>
          <p className="text-sm text-gray-600">Tạo video từ ảnh và mô tả văn bản bằng AI</p>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Left Sidebar - Video Generator */}
        <div className="w-full lg:w-auto flex-shrink-0">
          <VideoGenerator
            onGenerate={generateVideo}
            isGenerating={isGenerating}
          />
        </div>

        {/* Main Content - Video List */}
        <div className="flex-1 w-full">
          <VideoList videos={videos} />
        </div>
      </div>
    </div>
  );
};

