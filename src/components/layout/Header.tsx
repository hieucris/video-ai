import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, User, LogOut, Settings, Crown, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Get user role display
  const getUserRole = () => {
    if (!user?.customer_role) return 'Free';
    const roles = Object.keys(user.customer_role);
    if (roles.length > 0) {
      return roles[0].toUpperCase().replace(/-/g, ' ');
    }
    return 'Free';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 h-16 fixed top-0 right-0 left-0 lg:left-64 z-10 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Menu toggle (mobile) */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden hover:bg-purple-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Video AI Generator
          </h1>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center gap-4">
          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <User className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hidden sm:flex items-center gap-2 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name || 'User'}
                  </p>
                  {/* <p className="text-xs text-purple-600 font-semibold">
                    {getUserRole()}
                  </p> */}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-violet-50">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-bold text-gray-800">
                        {user?.name || 'User'}
                      </p>
                      <span className="px-2 py-0.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        {getUserRole()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {user?.email || 'user@example.com'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                      <div className="flex items-center gap-1">
                        <Video className="h-3 w-3 text-purple-600" />
                        <span className="font-medium text-purple-600">
                          {user?.total_video_ai_render_left_today || 0}
                        </span>
                        <span>videos left</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        // Navigate to settings
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Cài đặt</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

