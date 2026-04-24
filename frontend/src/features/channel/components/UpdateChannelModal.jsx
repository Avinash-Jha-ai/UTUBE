import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, CheckCircle } from 'lucide-react';
import './UpdateChannelModal.css';

const UpdateChannelModal = ({ channel, onClose, onUpdate }) => {
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (avatar) formData.append('avatar', avatar);
    if (banner) formData.append('banner', banner);

    try {
      const response = await axios.post('http://localhost:3000/api/channel/update-channel', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdate(response.data.channel);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating channel:", error);
      alert(error.response?.data?.message || "Failed to update channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="update-modal glass-card">
        <div className="modal-header">
          <h2>Update Channel</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        {success ? (
          <div className="success-state">
            <CheckCircle size={64} className="success-icon" />
            <p>Channel Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label>Channel Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="file-inputs">
              <div className="file-group">
                <label>Avatar</label>
                <div className="file-dropzone">
                  <input 
                    type="file" 
                    onChange={(e) => setAvatar(e.target.files[0])}
                    accept="image/*"
                  />
                  <Upload size={20} />
                  <span>{avatar ? avatar.name : 'Change Avatar'}</span>
                </div>
              </div>

              <div className="file-group">
                <label>Banner</label>
                <div className="file-dropzone">
                  <input 
                    type="file" 
                    onChange={(e) => setBanner(e.target.files[0])}
                    accept="image/*"
                  />
                  <Upload size={20} />
                  <span>{banner ? banner.name : 'Change Banner'}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn premium-gradient" disabled={loading}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateChannelModal;
