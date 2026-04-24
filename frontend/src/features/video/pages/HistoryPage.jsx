import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Clock, History } from 'lucide-react';
import './LibraryPages.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/library/history');
      if (res.data.success) {
        setHistory(res.data.history);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    if (!window.confirm("Clear all watch history?")) return;
    try {
      const res = await axios.delete('http://localhost:3000/api/library/history');
      if (res.data.success) {
        setHistory([]);
      }
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="library-loading">Loading History...</div>;

  return (
    <div className="library-page">
      <div className="library-header">
        <div className="header-left">
          <History size={24} />
          <h1>Watch History</h1>
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClearHistory}>
            <Trash2 size={18} /> Clear all history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <p>This list has no videos.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div 
              key={item._id} 
              className="history-item" 
              onClick={(e) => {
                if (!e.target.closest('a')) navigate(`/watch/${item.video?._id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="history-thumbnail">
                <img src={item.video?.thumbnail} alt={item.video?.title} />
              </div>
              <div className="history-info">
                <h3>{item.video?.title}</h3>
                <Link 
                  to={`/channel/${item.video?.channel?.handle || item.video?.channel?._id || ''}`}
                  className="channel-name"
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block' }}
                >
                  {item.video?.channel?.name}
                </Link>
                <p className="video-stats">{(item.video?.views || 0).toLocaleString()} views</p>
                <p className="watched-at">Watched on: {new Date(item.watchedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
