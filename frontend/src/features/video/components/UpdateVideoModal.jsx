import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, CheckCircle, Globe, Lock, Trash2 } from 'lucide-react';
import './UpdateVideoModal.css';

const UpdateVideoModal = ({ video, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [isPublic, setIsPublic] = useState(video.isPublic);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('isPublic', isPublic);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.post(`http://localhost:3000/api/content/update/${video._id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdate(response.data.video);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating video:", error);
      alert(error.response?.data?.message || "Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video? This action is irreversible.")) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/content/delete/${video._id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onDelete) onDelete(video._id);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert(error.response?.data?.message || "Failed to delete video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="update-video-modal glass-card">
        <div className="modal-header">
          <h2>Update Video Details</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        {success ? (
          <div className="success-state">
            <CheckCircle size={64} className="success-icon" />
            <p>Video Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label>Video Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title"
                required 
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your viewers about your video"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="file-group">
                <label>New Thumbnail (Optional)</label>
                <div className="file-dropzone">
                  <input 
                    type="file" 
                    onChange={(e) => setThumbnail(e.target.files[0])}
                    accept="image/*"
                  />
                  <Upload size={20} />
                  <span>{thumbnail ? thumbnail.name : 'Choose Image'}</span>
                </div>
              </div>

              <div className="visibility-group">
                <label>Visibility</label>
                <div className="visibility-toggle">
                  <button 
                    type="button" 
                    className={`toggle-btn ${isPublic ? 'active' : ''}`}
                    onClick={() => setIsPublic(true)}
                  >
                    <Globe size={16} /> Public
                  </button>
                  <button 
                    type="button" 
                    className={`toggle-btn ${!isPublic ? 'active' : ''}`}
                    onClick={() => setIsPublic(false)}
                  >
                    <Lock size={16} /> Private
                  </button>
                </div>
              </div>
            </div>

            <div className="button-group">
              <button type="button" className="delete-btn" onClick={handleDelete} disabled={loading}>
                <Trash2 size={18} />
              </button>
              <button type="submit" className="submit-btn premium-gradient" disabled={loading}>
                {loading ? 'Processing...' : 'Update Video'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateVideoModal;
