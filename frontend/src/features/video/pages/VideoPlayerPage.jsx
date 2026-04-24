import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Clock } from 'lucide-react';

import { useAuth } from '../../auth/hooks/useAuth';
import './VideoPlayerPage.css';

const CommentItem = ({ comment, user, videoId, onDelete }) => {
  const [likes, setLikes] = useState(comment.likes?.length || 0);
  const [dislikes, setDislikes] = useState(comment.dislikes?.length || 0);
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(user?.id || user?._id));
  const [isDisliked, setIsDisliked] = useState(comment.dislikes?.includes(user?.id || user?._id));
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = async () => {
    if (!user) return alert("Please login");
    try {
      const res = await axios.get(`https://utube-b49v.onrender.com/api/comment/like/${comment._id}`);
      if (res.data.success) {
        setIsLiked(res.data.liked);
        setLikes(res.data.likes);
        setIsDisliked(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleDislike = async () => {
    if (!user) return alert("Please login");
    try {
      const res = await axios.get(`https://utube-b49v.onrender.com/api/comment/dislike/${comment._id}`);
      if (res.data.success) {
        setIsDisliked(res.data.disliked);
        setDislikes(res.data.dislikes);
        setIsLiked(false);
      }
    } catch (error) { console.error(error); }
  };

  const fetchReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    try {
      const res = await axios.get(`https://utube-b49v.onrender.com/api/comment/replies/${comment._id}`);
      if (res.data.success) {
        setReplies(res.data.replies);
        setShowReplies(true);
      }
    } catch (error) { console.error(error); }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(`https://utube-b49v.onrender.com/api/comment/add/${videoId}`, {
        content: replyText,
        parentCommentId: comment._id
      });
      if (res.data.success) {
        setReplies([res.data.comment, ...replies]);
        setReplyText("");
        setShowReplyInput(false);
        setShowReplies(true);
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="comment-item-container">
      <div className="comment-item">
        <img src={comment.user?.avatar || 'https://avatar.iran.liara.run/public'} alt="User" className="comment-avatar" />
        <div className="comment-content">
          <div className="comment-header">
            <span className="comment-author">@{comment.user?.name}</span>
            <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="comment-text">{comment.content}</p>
          <div className="comment-actions">
            <div className="comment-like-group">
              <ThumbsUp 
                size={14} 
                onClick={handleLike} 
                className={isLiked ? 'active' : ''}
                fill={isLiked ? "currentColor" : "none"}
              /> 
              <span>{likes}</span>
            </div>
            <ThumbsDown 
              size={14} 
              onClick={handleDislike} 
              className={isDisliked ? 'active' : ''}
              fill={isDisliked ? "currentColor" : "none"}
            />
            <span className="reply-btn" onClick={() => setShowReplyInput(!showReplyInput)}>Reply</span>
            {user && (user.id === comment.user?._id || user._id === comment.user?._id) && (
              <span className="delete-btn" onClick={() => onDelete(comment._id)}>Delete</span>
            )}
          </div>

          {showReplyInput && (
            <form className="reply-form" onSubmit={handleReplySubmit}>
              <input 
                type="text" 
                placeholder="Add a reply..." 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
              />
              <div className="reply-form-actions">
                <button type="button" onClick={() => setShowReplyInput(false)}>Cancel</button>
                <button type="submit" disabled={!replyText.trim()}>Reply</button>
              </div>
            </form>
          )}

          <div className="replies-toggle" onClick={fetchReplies}>
            {showReplies ? 'Hide replies' : 'Show replies'}
          </div>

          {showReplies && (
            <div className="replies-list">
              {replies.map(reply => (
                <CommentItem 
                  key={reply._id} 
                  comment={reply} 
                  user={user} 
                  videoId={videoId}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VideoPlayerPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://utube-b49v.onrender.com/api/comment/video/${id}`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        await axios.get(`https://utube-b49v.onrender.com/api/content/view/${id}`);
        const response = await axios.get(`https://utube-b49v.onrender.com/api/content/video/${id}`);
        const videoData = response.data.video;
        setVideo(videoData);
        setLikesCount(videoData.likes?.length || 0);
        
        const recRes = await axios.get('https://utube-b49v.onrender.com/api/content/video/all');
        setRecommendedVideos(recRes.data.videos.filter(v => (v._id || v.id) !== id));

        if (user) {
          const userId = user.id || user._id;
          setIsLiked(videoData.likes?.includes(userId));
          setIsDisliked(videoData.dislikes?.includes(userId));
          
          if (videoData.channel?._id || videoData.channel?.id) {
            const subRes = await axios.get(`https://utube-b49v.onrender.com/api/subscribe/check/${videoData.channel._id || videoData.channel.id}`);
            setIsSubscribed(subRes.data.subscribed);
          }

          const wlRes = await axios.get(`https://utube-b49v.onrender.com/api/library/watchlater/check/${id}`);
          setIsWatchLater(wlRes.data.exists);
        }


        if (videoData.channel?._id || videoData.channel?.id) {
          const countRes = await axios.get(`https://utube-b49v.onrender.com/api/subscribe/count/${videoData.channel._id || videoData.channel.id}`);
          setSubscriberCount(countRes.data.count);
        }

        if (user) {
          await axios.post(`https://utube-b49v.onrender.com/api/library/history/${id}`);
        }

        fetchComments();

      } catch (error) {
        console.error("Error fetching video:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [id, user]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to comment");
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`https://utube-b49v.onrender.com/api/comment/add/${id}`, { content: newComment });
      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setNewComment("");
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`https://utube-b49v.onrender.com/api/comment/delete/${commentId}`);
      if (res.data.success) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) { console.error(error); }
  };

  const handleLike = async () => {
    if (!user) return alert("Please login to like");
    try {
      const res = await axios.get(`https://utube-b49v.onrender.com/api/content/like/${id}`);
      if (res.data.success) {
        setIsLiked(res.data.liked);
        setIsDisliked(false);
        setLikesCount(res.data.likesCount);
      }
    } catch (error) { console.error(error); }
  };

  const handleToggleWatchLater = async () => {
    if (!user) return alert("Please login");
    try {
      const res = await axios.post(`https://utube-b49v.onrender.com/api/library/watchlater/${id}`);
      if (res.data.success) {
        setIsWatchLater(res.data.added);
      }
    } catch (error) { console.error(error); }
  };

  const handleDislike = async () => {
    if (!user) return alert("Please login to dislike");

    try {
      const res = await axios.get(`https://utube-b49v.onrender.com/api/content/dislike/${id}`);
      if (res.data.success) {
        setIsDisliked(res.data.disliked);
        setIsLiked(false);
        setLikesCount(res.data.likesCount);
      }
    } catch (error) { console.error(error); }
  };

  const handleSubscribe = async () => {
    if (!user) return alert("Please login to subscribe");
    const channelId = video.channel?._id || video.channel?.id;
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
    } catch (error) { console.error(error); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) return <div className="player-loading">Loading Cinematic Experience...</div>;
  if (!video) return <div className="player-error">Video not found.</div>;

  return (
    <div className="video-player-page">
      <div className="player-left">
        <div className="main-player">
          <video controls autoPlay src={video.videoUrl} className="actual-video">
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-details">
          <h1 className="video-title-large">{video.title}</h1>
          <div className="video-actions-bar">
            <div className="channel-info">
              <Link to={`/channel/${video.channel?.handle || video.channel?._id || ''}`}>
                <img src={video.channel?.avatar || 'https://avatar.iran.liara.run/public'} alt="Avatar" className="large-avatar" />
              </Link>
              <div className="channel-text">
                <Link to={`/channel/${video.channel?.handle || video.channel?._id || ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3>{video.channel?.name || 'Utube Creator'}</h3>
                </Link>
                <p>{(subscriberCount || 0).toLocaleString()} subscribers</p>
              </div>
              <button className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`} onClick={handleSubscribe}>
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
            <div className="action-buttons">
              <div className="like-dislike-group pill-group">
                <button className={`action-btn-pill left ${isLiked ? 'active' : ''}`} onClick={handleLike}>
                  <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} /> {likesCount}
                </button>
                <div className="pill-divider"></div>
                <button className={`action-btn-pill right ${isDisliked ? 'active' : ''}`} onClick={handleDislike}>
                  <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
                </button>
              </div>
              <button 
                className={`action-btn-pill ${isWatchLater ? 'active' : ''}`} 
                onClick={handleToggleWatchLater}
              >
                <Clock size={18} fill={isWatchLater ? "currentColor" : "none"} /> 
                {isWatchLater ? 'Added' : 'Watch Later'}
              </button>
              <button className="action-btn-pill" onClick={handleShare}><Share2 size={18} /> Share</button>
              <button className="action-btn-pill circle"><MoreHorizontal size={18} /></button>
            </div>
          </div>
          <div className="video-description-box">
            <div className="desc-header">
              <span>{(video.views || 0).toLocaleString()} views</span>
              <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : 'Recently'}</span>
              <span className="hashtag">#Cinematic #Utube</span>
            </div>
            <p className="desc-text">{video.description || 'No description provided.'}</p>
          </div>

          <div className="comments-section">
            <h2 className="comments-count">{comments.length} Comments</h2>
            {user && (
              <form className="comment-form" onSubmit={handleAddComment}>
                <img src={user.avatar || 'https://avatar.iran.liara.run/public'} alt="User" className="comment-user-avatar" />
                <div className="comment-input-container">
                  <input type="text" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                  <div className="comment-form-actions">
                    <button type="button" onClick={() => setNewComment("")}>Cancel</button>
                    <button type="submit" disabled={!newComment.trim()}>Comment</button>
                  </div>
                </div>
              </form>
            )}
            <div className="comments-list">
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} user={user} videoId={id} onDelete={handleDeleteComment} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="player-right">
        <h3 className="up-next-title">Up Next</h3>
        <div className="recommendations-list">
          {recommendedVideos.map((rec) => (
            <div 
              key={rec._id} 
              className="small-video-card" 
              onClick={(e) => {
                if (!e.target.closest('a')) navigate(`/watch/${rec._id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="small-thumbnail glass-card">
                <img src={rec.thumbnail} alt={rec.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="small-info">
                <h4>{rec.title}</h4>
                <Link 
                  to={`/channel/${rec.channel?.handle || rec.channel?._id || ''}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <p>{rec.channel?.name}</p>
                </Link>
                <p>{(rec.views || 0).toLocaleString()} views • {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recently'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
