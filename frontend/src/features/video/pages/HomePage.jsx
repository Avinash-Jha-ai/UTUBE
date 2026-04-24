import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAllVideos } from '../state/videoSlice';
import VideoCard from '../components/VideoCard';
import './HomePage.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(fetchAllVideos());
  }, [dispatch]);

  return (
    <div className="home-page">

      {loading ? (
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-card "></div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="video-grid"
        >
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          ) : (
            <div className="no-videos">
              <h2>No cinematic masterpieces found yet.</h2>
              <p>Be the first to upload your vision!</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
