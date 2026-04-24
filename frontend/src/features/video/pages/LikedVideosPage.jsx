import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ThumbsUp, Play, Shuffle } from 'lucide-react';
import './LibraryPages.css';

const LikedVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLiked = async () => {
    try {
      const res = await axios.get('https://utube-b49v.onrender.com/api/library/liked');
      if (res.data.success) {
        setVideos(res.data.videos);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiked();
  }, []);

  if (loading) return <div className="library-loading">Loading Liked Videos...</div>;

  return (
    <div className="library-premium-page">
      <div className="library-sidebar-panel glass-card liked-gradient">
        <div className="panel-thumbnail">
          {videos.length > 0 ? (
            <img src={videos[0].thumbnail} alt="Playlist Preview" />
          ) : (
            <div className="empty-thumbnail"><ThumbsUp size={48} /></div>
          )}
          <div className="play-all-overlay" onClick={() => videos.length > 0 && navigate(`/watch/${videos[0]._id}`)}>
            <Play fill="white" /> PLAY ALL
          </div>
        </div>
        
        <div className="panel-info">
          <h1>Liked Videos</h1>
          <p className="panel-user">Your Favorite Content</p>
          <div className="panel-stats">
            <span>{videos.length} videos</span>
            <span>Updated today</span>
          </div>
          
          <div className="panel-actions">
            <button className="panel-btn primary" onClick={() => videos.length > 0 && navigate(`/watch/${videos[0]._id}`)}>
              <Play size={18} fill="black" /> Play all
            </button>
            <button className="panel-btn secondary">
              <Shuffle size={18} /> Shuffle
            </button>
          </div>
        </div>
      </div>

      <div className="library-content-list">
        {videos.length === 0 ? (
          <div className="empty-state">
            <ThumbsUp size={48} />
            <p>No liked videos yet.</p>
          </div>
        ) : (
          <div className="playlist-items">
            {videos.map((video, index) => (
              <div 
                key={video._id} 
                className="playlist-item" 
                onClick={(e) => {
                  if (!e.target.closest('a')) navigate(`/watch/${video._id}`);
                }}
                style={{ cursor: 'pointer' }}
              >
                <span className="item-index">{index + 1}</span>
                <div className="item-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                </div>
                <div className="item-info">
                  <h3>{video.title}</h3>
                  <p>
                    <Link 
                      to={`/channel/${video.channel?.handle || video.channel?._id || ''}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {video.channel?.name}
                    </Link>
                    {' • '}
                    {(video.views || 0).toLocaleString()} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedVideosPage;
