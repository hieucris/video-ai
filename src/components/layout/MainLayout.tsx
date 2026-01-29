import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-violet-50/50">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleMenuToggle}
        />
      )}

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header onMenuToggle={handleMenuToggle} />

        {/* Page content */}
        <main className="pt-16 min-h-screen">
          <div className="p-6 scrollbar-custom">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

