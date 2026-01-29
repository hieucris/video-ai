import React, { useState, useRef } from 'react';
import { Upload, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { VIDEO_QUALITIES } from '@/constants';
import { validateImageFile, validatePrompt } from '@/utils/validation';
import type { AspectRatio, VideoQuality } from '@/types/video';

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
    <div className="w-full lg:max-w-xs bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Video Generator</h2>

      {/* Image Preview */}
      <div className="mb-4">
        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">{prompt || 'i2312312412124ad'}</span>
          )}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Nhập mô tả video..."
          aria-label="Video prompt"
        />
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleUploadClick}
        variant="outline"
        className="w-full mb-4 justify-center"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Image
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Aspect Ratio */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tỷ lệ khung hình</label>
        <div className="flex gap-2">
          <button
            onClick={() => setAspectRatio('9:16')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm transition-colors",
              aspectRatio === '9:16'
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            )}
            aria-label="9:16 aspect ratio"
            tabIndex={0}
          >
            <Smartphone className="h-4 w-4" />
            9:16
          </button>
          <button
            onClick={() => setAspectRatio('16:9')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm transition-colors",
              aspectRatio === '16:9'
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            )}
            aria-label="16:9 aspect ratio"
            tabIndex={0}
          >
            <Monitor className="h-4 w-4" />
            16:9
          </button>
        </div>
      </div>

      {/* Chat luong (Quality) */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Chất lượng</label>
        <Select
          value={quality}
          onChange={(e) => setQuality(e.target.value as VideoQuality)}
          options={VIDEO_QUALITIES}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-black text-white hover:bg-gray-800"
      >
        {isGenerating ? 'Đang tạo...' : 'Gen Video'}
      </Button>
    </div>
  );
};

