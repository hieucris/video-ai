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
          "flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-lg mx-2 my-1",
          isActive
            ? "bg-blue-100 text-blue-600 font-medium"
            : "text-gray-700 hover:bg-gray-100",
          depth > 0 && "ml-6"
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
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
    <aside className="w-64 bg-white min-h-screen flex flex-col fixed left-0 top-0 overflow-y-auto border-r border-gray-200">
      {/* Bảng xếp hạng - Yellow header */}
      <div className="bg-yellow-500 px-4 py-3 flex items-center gap-2">
        <Star className="h-5 w-5 text-white fill-white" />
        <span className="text-white font-semibold">Bảng xếp hạng</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-2">
        {MENU_GROUPS.map((group, index) => (
          <div key={index} className="mb-2">
            {group.title && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
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
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center break-all">
          Tool render video AI
        </div>
      </div>
    </aside>
  );
};

