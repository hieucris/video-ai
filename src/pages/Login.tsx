import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Video, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/auth.service';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({
        email,
        password,
      });

      if (response.success) {
        // Show success message
        setSuccess(true);
        
        // Get the page user was trying to access, or default to dashboard
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        
        // Redirect after a short delay for better UX
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 800);
      } else {
        setError(response.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        {/* Content */}
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
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo and Language Selector */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                AI Video
              </span>
            </div>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="vi">🇻🇳 Tiếng Việt</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
              <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800">Đăng nhập thành công!</p>
                      <p className="text-xs text-green-600 mt-0.5">Đang chuyển hướng...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email / Tên đăng nhập
                </label>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email hoặc tên đăng nhập"
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Login Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                      Đang đăng nhập...
                    </span>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#00A4EF" d="M0 0h11.377v11.372H0z"/>
                  <path fill="#FFB900" d="M12.623 0H24v11.372H12.623z"/>
                  <path fill="#F25022" d="M0 12.623h11.377V24H0z"/>
                  <path fill="#7FBA00" d="M12.623 12.623H24V24H12.623z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Microsoft</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </motion.button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">
                Đăng ký ngay
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© 2026 AI Video Generator. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="hover:text-purple-600">Điều khoản</a>
              <span>•</span>
              <a href="#" className="hover:text-purple-600">Bảo mật</a>
              <span>•</span>
              <a href="#" className="hover:text-purple-600">Hỗ trợ</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

