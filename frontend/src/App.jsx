import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './features/layout/components/Navbar';
import Sidebar from './features/layout/components/Sidebar';
import AuthPage from './features/auth/pages/AuthPage';
import HomePage from './features/video/pages/HomePage';
import VideoPlayerPage from './features/video/pages/VideoPlayerPage';
import ChannelPage from './features/channel/pages/ChannelPage';
import MyChannelPage from './features/channel/pages/MyChannelPage';
import UploadPage from './features/video/pages/UploadPage';
import HistoryPage from './features/video/pages/HistoryPage';
import WatchLaterPage from './features/video/pages/WatchLaterPage';
import LikedVideosPage from './features/video/pages/LikedVideosPage';
import SearchPage from './features/video/pages/SearchPage';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="main-layout">
          <Sidebar isOpen={isSidebarOpen} />
          <main className={`content-area ${!isSidebarOpen ? 'mini' : ''}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/watch/:id" element={<VideoPlayerPage />} />
              <Route path="/channel/:handle" element={<ChannelPage />} />
              <Route path="/my-channel" element={<MyChannelPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/watch-later" element={<WatchLaterPage />} />
              <Route path="/liked-videos" element={<LikedVideosPage />} />
              <Route path="/results" element={<SearchPage />} />


            </Routes>
          </main>
        </div>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
