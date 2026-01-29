import React from 'react';
import { Video, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginIllustration: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="mb-8"
      >
        {/* Video AI Illustration */}
        <div className="relative">
          {/* Main device */}
          <div className="w-80 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl rounded-3xl border-4 border-white/20 shadow-2xl p-6 transform perspective-1000 rotate-y-12">
            {/* Screen content */}
            <div className="w-full h-full bg-white/10 rounded-2xl p-4 space-y-3">
              {/* Video preview */}
              <div className="w-full h-32 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Video className="h-12 w-12 text-white" />
              </div>
              
              {/* Progress bars */}
              <div className="space-y-2">
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-violet-400 to-purple-500"
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="h-3 bg-white/20 rounded-full w-3/4" />
                <div className="h-3 bg-white/20 rounded-full w-1/2" />
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-white text-xs">Quality</div>
                  <div className="text-white font-bold">1080p</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-white text-xs">Ratio</div>
                  <div className="text-white font-bold">16:9</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-white text-xs">AI</div>
                  <div className="text-white font-bold">✨</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -top-8 -right-8 w-24 h-24 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl flex items-center justify-center"
          >
            <Sparkles className="h-12 w-12 text-white" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
            className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-xl flex items-center justify-center"
          >
            <span className="text-2xl">🎬</span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center text-white"
      >
        <h1 className="text-4xl font-bold mb-4">AI Video Generator</h1>
        <p className="text-xl text-blue-100 mb-2">
          Tạo video từ ảnh và văn bản
        </p>
        <p className="text-lg text-blue-200">
          Nhanh chóng • Dễ dàng • Chuyên nghiệp
        </p>
      </motion.div>
    </div>
  );
};

