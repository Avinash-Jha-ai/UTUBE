import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit2 } from 'lucide-react';
import VideoCard from '../../video/components/VideoCard';
import { useAuth } from '../../auth/hooks/useAuth';
import UpdateChannelModal from '../components/UpdateChannelModal';
import UpdateVideoModal from '../../video/components/UpdateVideoModal';
import './ChannelPage.css';

const ChannelPage = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUpdateVideoModalOpen, setIsUpdateVideoModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const chanRes = await axios.get(`https://utube-b49v.onrender.com/api/channel/${handle}`);
        const channelData = chanRes.data.channel;
        setChannel(channelData);
        setSubscriberCount(channelData.subscriberCount || 0);
        
        const vidRes = await axios.get(`https://utube-b49v.onrender.com/api/content/channel/${channelData.id || channelData._id}`);
        setVideos(vidRes.data.videos);

        if (user) {
          const subRes = await axios.get(`https://utube-b49v.onrender.com/api/subscribe/check/${channelData.id || channelData._id}`);
          setIsSubscribed(subRes.data.subscribed);
        }

      } catch (error) {
        console.error("Error fetching channel data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, [handle, user]);

  const isOwner = user && channel && (user.id === channel.owner || user._id === channel.owner);

  const handleSubscribe = async () => {
    if (!user) return alert("Please login to subscribe");
    const channelId = channel.id || channel._id;
    try {
      if (isSubscribed) {
        await axios.delete(`https://utube-b49v.onrender.com/api/subscribe/${channelId}`);
        setIsSubscribed(false);
        setSubscriberCount(prev => Math.max(0, prev - 1));
      } else {
        await axios.post(`https://utube-b49v.onrender.com/api/subscribe/${channelId}`);
        setIsSubscribed(true);
        setSubscriberCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  const handleEditVideo = (video) => {
    setSelectedVideo(video);
    setIsUpdateVideoModalOpen(true);
  };


  const onUpdateVideo = (updatedVideo) => {
    setVideos(prev => prev.map(v => v._id === updatedVideo._id ? { ...v, ...updatedVideo } : v));
  };

  const onDeleteVideo = (videoId) => {
    setVideos(prev => prev.filter(v => v._id !== videoId));
  };

  if (loading) return <div className="channel-loading">Entering the Creator's Realm...</div>;
  if (!channel) return <div className="channel-error">Channel not found.</div>;

  return (
    <div className="channel-page">
      <div className="channel-banner glass-card">
        {channel.banner ? <img src={channel.banner} alt="Banner" /> : <div className="banner-placeholder premium-gradient"></div>}
      </div>

      <div className="channel-header-info">
        <div className="channel-main-info">
          <img src={channel.avatar || 'https://avatar.iran.liara.run/public'} alt="Avatar" className="channel-avatar-large" />
          <div className="channel-text-info">
            <div className="channel-title-row">
              <h1>{channel.name}</h1>
              {isOwner && (
                <button 
                  className="update-channel-btn"
                  onClick={() => setIsUpdateModalOpen(true)}
                >
                  <Edit2 size={16} />
                  Update Channel
                </button>
              )}
            </div>
            <p className="handle">@{channel.handle} • {(subscriberCount || 0).toLocaleString()} subscribers • {videos.length} videos</p>
            <p className="description">{channel.description || 'Welcome to my cinematic universe.'}</p>
            {!isOwner && (
              <button 
                className={`subscribe-btn premium-gradient ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribe}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="channel-tabs">
        <button className="tab active">Videos</button>
        <button className="tab">Playlists</button>
        <button className="tab">Community</button>
        <button className="tab">About</button>
      </div>

      <div className="channel-videos-grid">
        {videos.map((video) => (
          <VideoCard 
            key={video._id} 
            video={{...video, channel}} 
            onEdit={isOwner ? handleEditVideo : null}
          />
        ))}
      </div>

      {isUpdateModalOpen && (
        <UpdateChannelModal 
          channel={channel} 
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={(updatedChannel) => setChannel(updatedChannel)}
        />
      )}

      {isUpdateVideoModalOpen && selectedVideo && (
        <UpdateVideoModal 
          video={selectedVideo} 
          onClose={() => setIsUpdateVideoModalOpen(false)}
          onUpdate={onUpdateVideo}
          onDelete={onDeleteVideo}
        />
      )}
    </div>
  );
};

export default ChannelPage;
