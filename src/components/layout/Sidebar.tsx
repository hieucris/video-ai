import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MENU_GROUPS } from '@/constants/menu';
import type { MenuItem } from '@/types/menu';

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  depth?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isActive, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const handleToggle = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <Link
        to={item.path}
        onClick={hasChildren ? (e) => { e.preventDefault(); handleToggle(); } : undefined}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-xl mx-2 my-0.5 group",
          isActive
            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30"
            : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-700",
          depth > 0 && "ml-6"
        )}
      >
        <Icon className={cn(
          "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
          isActive && "text-white"
        )} />
        <span className="flex-1">{item.label}</span>
        {hasChildren && (
          <span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </Link>

      {hasChildren && isOpen && (
        <div className="ml-4">
          {item.children!.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              isActive={false}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-lg min-h-screen flex flex-col fixed left-0 top-0 overflow-y-auto border-r border-gray-200/80 shadow-xl scrollbar-custom z-20">
      {/* Chức năng chính - Gradient header */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
          <Star className="h-6 w-6 text-white fill-white" />
        </div>
        <span className="text-white font-bold text-base">Chức năng chính</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 scrollbar-custom">
        {MENU_GROUPS.map((group, index) => (
          <div key={index} className="mb-4">
            {group.title && (
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {group.title}
              </div>
            )}
            {group.items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={location.pathname === item.path}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer - URL */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="text-xs text-gray-600 text-center font-medium">
          🎬 Tool render video AI
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">
          Powered by AI
        </div>
      </div>
    </aside>
  );
};

