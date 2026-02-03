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
          <Route path="text-to-image" element={<ComingSoon />} />
          <Route path="text-to-video" element={<Dashboard />} />
          <Route path="text-to-animation" element={<ComingSoon />} />
          <Route path="text-to-music" element={<ComingSoon />} />
          <Route path="text-to-voice" element={<ComingSoon />} />
          <Route path="text-to-3d" element={<ComingSoon />} />
          <Route path="image-to-video" element={<ComingSoon />} />
          <Route path="audio-enhancement" element={<ComingSoon />} />
          <Route path="style-transfer" element={<ComingSoon />} />
          <Route path="image-upscale" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
