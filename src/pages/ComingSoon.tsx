import React from 'react';
import { Construction } from 'lucide-react';

export const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full">
        <Construction className="h-16 w-16 text-white" />
      </div>
      
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-800">
          Tính năng đang phát triển
        </h1>
        <p className="text-gray-600 text-lg max-w-md">
          Chúng tôi đang nỗ lực hoàn thiện tính năng này. 
          Vui lòng quay lại sau!
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mt-8">
        <span className="animate-pulse">●</span>
        <span>Đang trong quá trình phát triển...</span>
      </div>
    </div>
  );
};

