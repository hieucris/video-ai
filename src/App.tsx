import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard, NotFound, ComingSoon } from '@/pages';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content-manager" element={<ComingSoon />} />
          <Route path="create-content" element={<ComingSoon />} />
          <Route path="ai-text-to-video" element={<Dashboard />} />
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
