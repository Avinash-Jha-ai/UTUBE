import React, { useState } from 'react';
import axios from 'axios';
import { X, Upload, CheckCircle, User } from 'lucide-react';
import './UpdateProfileModal.css';

const UpdateProfileModal = ({ user, onClose, onUpdate }) => {
  const [fullname, setFullname] = useState(user.fullname);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('fullname', fullname);
    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await axios.post('https://utube-b49v.onrender.com/api/auth/update-profile', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdate(response.data.user);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="update-modal glass-card">
        <div className="modal-header">
          <h2>Update Profile</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        {success ? (
          <div className="success-state">
            <CheckCircle size={64} className="success-icon" />
            <p>Profile Updated Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={fullname} 
                onChange={(e) => setFullname(e.target.value)}
                required 
              />
            </div>

            <div className="file-inputs" style={{ gridTemplateColumns: '1fr' }}>
              <div className="file-group">
                <label>Profile Picture</label>
                <div className="file-dropzone" style={{ height: '120px' }}>
                  <input 
                    type="file" 
                    onChange={(e) => setAvatar(e.target.files[0])}
                    accept="image/*"
                  />
                  <Upload size={24} />
                  <span>{avatar ? avatar.name : 'Choose new profile picture'}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn premium-gradient" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProfileModal;
