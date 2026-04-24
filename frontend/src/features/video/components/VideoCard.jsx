import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3 } from 'lucide-react';
import './VideoCard.css';

const VideoCard = ({ video, onEdit }) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    navigate(`/watch/${video._id}`);
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="video-card"
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="thumbnail-container">
        <img src={video.thumbnail || 'https://picsum.photos/seed/utube/320/180'} alt={video.title} />
      </div>
      <div className="video-info">
        <Link 
          to={`/channel/${video.channel?.handle || video.channel?._id || ''}`} 
          className="channel-avatar"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={video.channel?.avatar || 'https://avatar.iran.liara.run/public'} alt="Channel" />
        </Link>
        <div className="text-info">
          <h3 className="video-title">{video.title}</h3>
          <Link 
            to={`/channel/${video.channel?.handle || video.channel?._id || ''}`} 
            className="channel-name"
            style={{ textDecoration: 'none', display: 'inline-block' }}
            onClick={(e) => e.stopPropagation()}
          >
            {video.channel?.name || 'Utube Creator'}
          </Link>
          <p className="video-metadata">{(video.views || 0).toLocaleString()} views • {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : '2 days ago'}</p>
        </div>
      </div>
      
      {onEdit && (
        <button 
          className="edit-video-overlay-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit(video);
          }}
        >
          <Edit3 size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default VideoCard;
