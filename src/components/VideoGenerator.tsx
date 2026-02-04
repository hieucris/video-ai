import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Smartphone, Monitor, Image as ImageIcon, Sparkles, Wand2, Loader2, Clock, Video, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { VIDEO_QUALITIES } from '@/constants';
import { validateImageFile, validatePrompt } from '@/utils/validation';
import type { AspectRatio, VideoQuality, VideoGenerationParams } from '@/types/video';
import { motion, AnimatePresence } from 'framer-motion';
import { TextArea } from './ui/text-aria';
import { generateScenes } from '@/services/ai-scene-generator.service';

type VideoMode = 'short' | 'long';

interface VideoGeneratorProps {
  onGenerate: (params: VideoGenerationParams) => Promise<void>;
  onImageUpload: (file: File) => Promise<number>;
  isGenerating: boolean;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  onGenerate,
  onImageUpload,
  isGenerating,
}) => {
  const [videoMode, setVideoMode] = useState<VideoMode>('short');
  const [prompt, setPrompt] = useState('');
  const [uploadedImageId, setUploadedImageId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [quality, setQuality] = useState<VideoQuality>('1080p');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [showSparkleTooltip, setShowSparkleTooltip] = useState(false);
  const [autoMerge, setAutoMerge] = useState(false);
  // const [outputCount, setOutputCount] = useState(1);
  const [sceneCount, setSceneCount] = useState<number>(2);
  const [generatedScenes, setGeneratedScenes] = useState<string[]>([]);
  const [isGeneratingScenes, setIsGeneratingScenes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setVideoMode('short');
    setPrompt('');
    setUploadedImageId(null);
    setImagePreview(null);
    setAspectRatio('16:9');
    setQuality('1080p');
    setAutoMerge(false);
    setSceneCount(2);
    setGeneratedScenes([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    console.log('✅ Form reset to initial values');
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server immediately
    setIsUploadingImage(true);
    try {
      console.log('📤 Starting upload for:', file.name);
      const imageId = await onImageUpload(file);
      setUploadedImageId(imageId);
      console.log('✅ Image uploaded, ID:', imageId);
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setUploadedImageId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    console.log('🗑️ Image removed');
  };

  // Handle generating scenes for long video
  const handleGenerateScenes = async () => {
    if (!prompt.trim()) {
      alert('Vui lòng nhập mô tả video trước');
      return;
    }

    setIsGeneratingScenes(true);
    try {
      console.log(`🎬 Generating ${sceneCount} scenes...`);
      const scenes = await generateScenes({
        prompt: prompt,
        sceneCount: sceneCount,
      });
      setGeneratedScenes(scenes);
      console.log('✅ Scenes generated successfully');
    } catch (error) {
      console.error('❌ Error generating scenes:', error);
      alert('Không thể tạo các cảnh. Vui lòng thử lại.');
    } finally {
      setIsGeneratingScenes(false);
    }
  };

  // Update scene at specific index
  const handleSceneChange = (index: number, value: string) => {
    const newScenes = [...generatedScenes];
    newScenes[index] = value;
    setGeneratedScenes(newScenes);
  };

  // Reset scenes when scene count changes
  useEffect(() => {
    if (generatedScenes.length > 0 && generatedScenes.length !== sceneCount) {
      setGeneratedScenes([]);
    }
  }, [sceneCount, generatedScenes.length]);

  const handleGenerate = async () => {
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const enableLong = videoMode === 'long';

    // For long videos, check if scenes are generated
    if (enableLong && generatedScenes.length === 0) {
      alert('Vui lòng tạo các cảnh trước khi tạo video');
      return;
    }

    try {
      await onGenerate({
        prompt,
        imageId: uploadedImageId,
        aspectRatio,
        quality,
        enableLong,
        autoMerge,
        outputCount: 1,
        sceneCount: enableLong ? sceneCount : null,
        scenes: enableLong ? generatedScenes : null,
      });

      // Reset form after successful generation
      resetForm();
    } catch (error) {
      // Error is already handled in the hook, so we don't need to do anything here
      console.error('Error in handleGenerate:', error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const enhancePromptLocally = (originalPrompt: string): string => {
    // Rule-based prompt enhancement when API is not available
    const enhancements = {
      lighting: ['ánh sáng tự nhiên', 'chiếu sáng đẹp', 'ánh sáng vàng ấm'],
      quality: ['chất lượng cao', 'chi tiết sắc nét', 'độ phân giải cao'],
      camera: ['góc quay chuyên nghiệp', 'chuyển động camera mượt mà', 'cận cảnh đẹp'],
      atmosphere: ['không khí sống động', 'bầu không khí đẹp', 'phong cảnh tuyệt đẹp'],
      color: ['màu sắc rực rỡ', 'tông màu hài hòa', 'bảng màu đẹp mắt'],
    };

    let enhanced = originalPrompt;

    // Add cinematic quality if not mentioned
    if (!enhanced.toLowerCase().includes('cinematic') &&
      !enhanced.toLowerCase().includes('chất lượng')) {
      enhanced += ', chất lượng điện ảnh cao';
    }

    // Add lighting details if not mentioned
    if (!enhanced.toLowerCase().includes('ánh sáng') &&
      !enhanced.toLowerCase().includes('lighting')) {
      const randomLighting = enhancements.lighting[Math.floor(Math.random() * enhancements.lighting.length)];
      enhanced += `, ${randomLighting}`;
    }

    // Add camera movement if not mentioned
    if (!enhanced.toLowerCase().includes('camera') &&
      !enhanced.toLowerCase().includes('góc quay')) {
      const randomCamera = enhancements.camera[Math.floor(Math.random() * enhancements.camera.length)];
      enhanced += `, ${randomCamera}`;
    }

    // Add color grading if not mentioned
    if (!enhanced.toLowerCase().includes('màu') &&
      !enhanced.toLowerCase().includes('color')) {
      const randomColor = enhancements.color[Math.floor(Math.random() * enhancements.color.length)];
      enhanced += `, ${randomColor}`;
    }

    // Add professional touch
    enhanced += ', phong cách chuyên nghiệp, chi tiết sắc nét';

    return enhanced;
  };

  const handleAIEnhancePrompt = async () => {
    if (!prompt.trim()) {
      alert('Vui lòng nhập mô tả video trước khi sử dụng AI gợi ý');
      return;
    }

    if (isEnhancingPrompt) return;

    const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

    // If no API key, use local enhancement
    if (!groqApiKey || groqApiKey === '') {
      setIsEnhancingPrompt(true);
      // Simulate API delay for better UX
      setTimeout(() => {
        const enhancedPrompt = enhancePromptLocally(prompt);
        setPrompt(enhancedPrompt);
        setIsEnhancingPrompt(false);
      }, 1000);
      return;
    }

    setIsEnhancingPrompt(true);
    try {
      // Call Groq API to enhance the prompt (FREE & FAST!)
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Fast and powerful model
          messages: [
            {
              role: 'system',
              content: 'Bạn là một chuyên gia viết prompt cho AI tạo video. Nhiệm vụ của bạn là cải thiện và tối ưu hóa prompt của người dùng để tạo ra video chất lượng cao hơn. Hãy viết lại prompt một cách chi tiết, rõ ràng, và sáng tạo hơn. Chỉ trả về prompt đã được cải thiện, không thêm giải thích hay ghi chú.',
            },
            {
              role: 'user',
              content: `Hãy cải thiện prompt này để tạo video AI tốt hơn: "${prompt}"`,
            },
          ],
          temperature: 0.8,
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API Error:', response.status, errorData);

        if (response.status === 401) {
          alert('⚠️ Groq API Key không hợp lệ. Sử dụng chế độ cải thiện cơ bản...');
          const enhancedPrompt = enhancePromptLocally(prompt);
          setPrompt(enhancedPrompt);
          return;
        }

        throw new Error(`Groq API Error: ${response.status}`);
      }

      const data = await response.json();
      const enhancedPrompt = data.choices[0]?.message?.content?.trim();

      if (enhancedPrompt) {
        setPrompt(enhancedPrompt);
      } else {
        // Fallback to local enhancement
        const localEnhanced = enhancePromptLocally(prompt);
        setPrompt(localEnhanced);
      }
    } catch (error) {
      console.error('AI Enhancement Error:', error);
      // Use local enhancement as fallback
      const enhancedPrompt = enhancePromptLocally(prompt);
      setPrompt(enhancedPrompt);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Shared components for both tabs
  const renderPromptSection = () => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Mô tả video
      </label>
      <div className="relative">
        <TextArea
          value={prompt}
          rows={4}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          placeholder="Ví dụ: Một bình minh đẹp trên đồi núi..."
          aria-label="Video prompt"
          className="pr-12"
          disabled={isEnhancingPrompt}
        />
        <motion.button
          type="button"
          onClick={handleAIEnhancePrompt}
          onMouseEnter={() => setShowSparkleTooltip(true)}
          onMouseLeave={() => setShowSparkleTooltip(false)}
          disabled={isEnhancingPrompt || !prompt.trim()}
          className={cn(
            "absolute right-3 top-3 p-2 rounded-lg transition-all",
            isEnhancingPrompt || !prompt.trim()
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-purple-50 active:scale-95"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="AI enhance prompt"
        >
          {isEnhancingPrompt ? (
            <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 text-purple-500" />
          )}
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showSparkleTooltip && !isEnhancingPrompt && prompt.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-10"
            >
              <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {import.meta.env.VITE_GROQ_API_KEY ? (
                  <>✨ Groq AI sẽ cải thiện prompt (FREE & FAST!)</>
                ) : (
                  <>✨ Cải thiện prompt (chế độ cơ bản)</>
                )}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderImageUploadSection = () => (
    <>
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
                className="w-full h-full object-contain"
              />
              {isUploadingImage ? (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 animate-spin" />
                    <p className="text-sm font-medium">Đang tải ảnh lên...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">Thay đổi ảnh</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleRemoveImage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all z-10"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </>
              )}
            </>
          ) : (
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-violet-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">
                {'Nhấn để tải ảnh lên'}
              </p>
              <p className="text-gray-400 text-xs">
                PNG, JPG, WEBP (tối đa 10MB)
              </p>
            </div>
          )}
        </motion.div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </>
  );

  const renderAspectRatioSection = () => (
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
  );

  // const renderOutputCountSection = () => (
  //   <div className="mb-6">
  //     <label className="block text-sm font-medium text-gray-700 mb-2">
  //       Số lượng video
  //     </label>
  //     <Select
  //       value={outputCount.toString()}
  //       onChange={(e) => setOutputCount(Number(e.target.value))}
  //       options={[
  //         { value: '1', label: '1 video' },
  //         { value: '2', label: '2 videos' },
  //         { value: '3', label: '3 videos' },
  //         { value: '4', label: '4 videos' },
  //         { value: '5', label: '5 videos' },
  //       ]}
  //     />
  //   </div>
  // );

  const renderQualitySection = () => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Chất lượng video
      </label>
      <Select
        value={quality}
        onChange={(e) => setQuality(e.target.value as VideoQuality)}
        options={VIDEO_QUALITIES}
      />
    </div>
  );

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-lg shadow-purple-100/50 overflow-hidden sticky top-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Video Generator</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setVideoMode('short')}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-all relative",
              videoMode === 'short'
                ? "text-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
            aria-label="Video ngắn tab"
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Video ngắn</span>
            </div>
            {videoMode === 'short' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setVideoMode('long')}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-all relative",
              videoMode === 'long'
                ? "text-purple-600 bg-purple-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
            aria-label="Video dài tab"
          >
            <div className="flex items-center justify-center gap-2">
              <Video className="h-4 w-4" />
              <span>Video dài</span>
            </div>
            {videoMode === 'long' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {videoMode === 'short' && (
            <motion.div
              key="short"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Video ngắn Tab Content */}
              {renderPromptSection()}
              {renderImageUploadSection()}
              {renderAspectRatioSection()}
              {/* {renderOutputCountSection()} */}
              {renderQualitySection()}
            </motion.div>
          )}

          {videoMode === 'long' && (
            <motion.div
              key="long"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Video dài Tab Content */}
              {renderPromptSection()}
              {renderImageUploadSection()}
              {renderAspectRatioSection()}

              {/* Scene Count */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng cảnh
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Select
                      value={sceneCount.toString()}
                      onChange={(e) => setSceneCount(Number(e.target.value))}
                      options={[
                        { value: '2', label: '2 cảnh' },
                        { value: '3', label: '3 cảnh' },
                        { value: '4', label: '4 cảnh' },
                        { value: '5', label: '5 cảnh' },
                        { value: '6', label: '6 cảnh' },
                        { value: '7', label: '7 cảnh' },
                        { value: '8', label: '8 cảnh' },
                        { value: '9', label: '9 cảnh' },
                        { value: '10', label: '10 cảnh' },
                      ]}
                    />
                  </div>
                  <Button
                    onClick={handleGenerateScenes}
                    disabled={isGeneratingScenes || !prompt.trim()}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 disabled:opacity-50"
                  >
                    {isGeneratingScenes ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Tạo cảnh
                      </>
                    )}
                  </Button>
                </div>
                {generatedScenes.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Nhấn "Tạo cảnh" để AI tự động tạo {sceneCount} cảnh dựa trên mô tả của bạn
                  </p>
                )}
              </div>

              {/* Scene Editing Area */}
              <AnimatePresence>
                {generatedScenes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Chi tiết các cảnh
                      </label>
                      <button
                        onClick={handleGenerateScenes}
                        disabled={isGeneratingScenes}
                        className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
                        aria-label="Regenerate scenes"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Tạo lại
                      </button>
                    </div>

                    {generatedScenes.map((scene, index) => (
                      <div key={index} className="space-y-2">
                        <label className="block text-xs font-medium text-gray-600">
                          Cảnh {index + 1}
                        </label>
                        <TextArea
                          value={scene}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            handleSceneChange(index, e.target.value)
                          }
                          rows={4}
                          className="text-sm"
                          placeholder={`Mô tả chi tiết cảnh ${index + 1}...`}
                          aria-label={`Scene ${index + 1} description`}
                        />
                      </div>
                    ))}

                    <p className="text-xs text-gray-500 italic">
                      💡 Bạn có thể chỉnh sửa nội dung các cảnh trước khi tạo video
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Auto Merge Checkbox */}
              <div className="mb-5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={autoMerge}
                      onChange={(e) => setAutoMerge(e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer transition-all"
                      aria-label="Auto merge videos"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      Tự động ghép nhiều video thành 1
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Khi tạo nhiều video, tự động ghép chúng thành một video hoàn chỉnh
                    </p>
                  </div>
                </label>
              </div>

              {/* {renderOutputCountSection()} */}
              {renderQualitySection()}
            </motion.div>
          )}
        </AnimatePresence>

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

