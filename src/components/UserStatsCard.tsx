import React from 'react';
import { Video, Image, Sparkles, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export const UserStatsCard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const stats = [
    {
      icon: Video,
      label: 'AI Video Today',
      current: user.total_video_ai_render_today,
      max: user.max_video_ai_per_day,
      left: user.total_video_ai_render_left_today,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50',
    },
    {
      icon: Sparkles,
      label: 'AI Render Today',
      current: user.total_ai_render_today,
      max: user.max_ai_video_per_day,
      left: user.total_ai_render_left_today,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Image,
      label: 'Render Video Today',
      current: user.total_render_today,
      max: user.max_render_video_per_day,
      left: user.total_render_left_today,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
    },
    {
      icon: TrendingUp,
      label: 'Posts Today',
      current: user.total_posts_today,
      max: user.max_per_day,
      left: user.total_posts_left_today,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const percentage = (stat.current / stat.max) * 100;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-br ${stat.bgColor} p-4`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{stat.left}</p>
                    <p className="text-xs text-gray-500">còn lại</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                    <p className="text-xs text-gray-500">
                      {stat.current}/{stat.max}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

