import React, { useState, useRef } from 'react';
import { Upload, Smartphone, Monitor, Image as ImageIcon, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { VIDEO_QUALITIES } from '@/constants';
import { validateImageFile, validatePrompt } from '@/utils/validation';
import type { AspectRatio, VideoQuality } from '@/types/video';
import { motion } from 'framer-motion';

interface VideoGeneratorProps {
  onGenerate: (params: {
    prompt: string;
    image: File | null;
    aspectRatio: AspectRatio;
    quality: VideoQuality;
  }) => void;
  isGenerating: boolean;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [quality, setQuality] = useState<VideoQuality>('1080p');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    onGenerate({
      prompt,
      image,
      aspectRatio,
      quality,
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-purple-100/50 overflow-hidden sticky top-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Video Generator</h2>
        </div>
      </div>

      <div className="p-6">
        {/* Image Preview */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh gốc
          </label>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-52 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group cursor-pointer"
            onClick={handleUploadClick}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Thay đổi ảnh</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-violet-600" />
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {prompt || 'Nhấn để tải ảnh lên'}
                </p>
                <p className="text-gray-400 text-xs">
                  PNG, JPG, WEBP (tối đa 10MB)
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Prompt Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả video
          </label>
          <div className="relative">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ví dụ: Một bình minh đẹp trên đồi núi..."
              aria-label="Video prompt"
              className="pr-10"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
          </div>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUploadClick}
          variant="outline"
          className="w-full mb-5 justify-center border-2 hover:border-purple-500 hover:bg-purple-50 transition-all"
        >
          <Upload className="mr-2 h-4 w-4" />
          Tải ảnh lên
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Aspect Ratio */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tỷ lệ khung hình
          </label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAspectRatio('9:16')}
              className={cn(
                "flex flex-col items-center justify-center gap-2 px-4 py-4 border-2 rounded-xl text-sm font-medium transition-all",
                aspectRatio === '9:16'
                  ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:shadow-md"
              )}
              aria-label="9:16 aspect ratio"
              tabIndex={0}
            >
              <Smartphone className="h-6 w-6" />
              <span>9:16</span>
              <span className="text-xs opacity-80">Mobile</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAspectRatio('16:9')}
              className={cn(
                "flex flex-col items-center justify-center gap-2 px-4 py-4 border-2 rounded-xl text-sm font-medium transition-all",
                aspectRatio === '16:9'
                  ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200"
                  : "bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:shadow-md"
              )}
              aria-label="16:9 aspect ratio"
              tabIndex={0}
            >
              <Monitor className="h-6 w-6" />
              <span>16:9</span>
              <span className="text-xs opacity-80">Desktop</span>
            </motion.button>
          </div>
        </div>

        {/* Quality */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chất lượng video
          </label>
          <Select
            value={quality}
            onChange={(e) => setQuality(e.target.value as VideoQuality)}
            options={VIDEO_QUALITIES}
          />
        </div>

        {/* Generate Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30 py-6 text-base font-semibold disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Đang tạo video...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Tạo Video AI
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

