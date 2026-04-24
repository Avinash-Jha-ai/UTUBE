import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Play, MoreVertical, Trash2, Shuffle } from 'lucide-react';
import './LibraryPages.css';

const WatchLaterPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWatchLater = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/library/watchlater');
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
    fetchWatchLater();
  }, []);

  const handleRemove = async (e, videoId) => {
    e.stopPropagation();
    try {
      const res = await axios.post(`http://localhost:3000/api/library/watchlater/${videoId}`);
      if (res.data.success) {
        setVideos(videos.filter(v => v._id !== videoId));
      }
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="library-loading">Loading Watch Later...</div>;

  return (
    <div className="library-premium-page">
      <div className="library-sidebar-panel glass-card">
        <div className="panel-thumbnail">
          {videos.length > 0 ? (
            <img src={videos[0].thumbnail} alt="Playlist Preview" />
          ) : (
            <div className="empty-thumbnail"><Clock size={48} /></div>
          )}
          <div className="play-all-overlay" onClick={() => videos.length > 0 && navigate(`/watch/${videos[0]._id}`)}>
            <Play fill="white" /> PLAY ALL
          </div>
        </div>
        
        <div className="panel-info">
          <h1>Watch Later</h1>
          <p className="panel-user">Your Saved Videos</p>
          <div className="panel-stats">
            <span>{videos.length} videos</span>
            <span>No views • Updated today</span>
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
            <Clock size={48} />
            <p>No videos saved for later yet.</p>
          </div>
        ) : (
          <div className="playlist-items">
            {videos.map((video, index) => (
              <div 
                key={video._id} 
                className="playlist-item" 
                onClick={(e) => {
                  if (!e.target.closest('a') && !e.target.closest('button')) navigate(`/watch/${video._id}`);
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
                <button className="item-remove-btn" onClick={(e) => handleRemove(e, video._id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchLaterPage;
