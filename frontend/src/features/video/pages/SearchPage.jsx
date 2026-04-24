import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import './SearchPage.css';

const SearchPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('search_query');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/content/search?query=${encodeURIComponent(query)}`);
        if (res.data.success) {
          setVideos(res.data.videos);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <div className="search-loading">Searching Utube...</div>;

  return (
    <div className="search-page">
      <h2 className="search-results-title">Results for "{query}"</h2>
      
      {videos.length === 0 ? (
        <div className="no-results">
          <h3>No videos found matching your search.</h3>
          <p>Try different keywords or check your spelling.</p>
        </div>
      ) : (
        <div className="search-results-list">
          {videos.map((video) => (
            <div 
              key={video._id} 
              className="search-video-item" 
              onClick={(e) => {
                if (!e.target.closest('a')) navigate(`/watch/${video._id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="search-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
              </div>
              <div className="search-info">
                <h3>{video.title}</h3>
                <p className="search-metadata">{(video.views || 0).toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                <Link 
                  to={`/channel/${video.channel?.handle || video.channel?._id || ''}`}
                  className="search-channel-info"
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
                >
                  <img src={video.channel?.avatar || 'https://avatar.iran.liara.run/public'} alt="Avatar" />
                  <span>{video.channel?.name}</span>
                </Link>
                <p className="search-description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
