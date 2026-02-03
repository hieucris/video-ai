import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dashboard, NotFound, ComingSoon, Login } from '@/pages';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route - No Layout */}
        <Route path="/login" element={<Login />} />

        {/* Main App Routes - With Layout & Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="content-manager" element={<ComingSoon />} />
          <Route path="create-content" element={<ComingSoon />} />
          <Route path="text-to-video" element={<Dashboard />} />
          <Route path="video-editor" element={<ComingSoon />} />
          <Route path="scheduled-content" element={<ComingSoon />} />
          <Route path="ads-running" element={<ComingSoon />} />
          <Route path="performance" element={<ComingSoon />} />
          <Route path="douyin-manager" element={<ComingSoon />} />
          <Route path="tiktok-manager" element={<ComingSoon />} />
          <Route path="threads-manager" element={<ComingSoon />} />
          <Route path="youtube-manager" element={<ComingSoon />} />
          <Route path="instagram" element={<ComingSoon />} />
          <Route path="calendar" element={<ComingSoon />} />
          <Route path="special-reader" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
