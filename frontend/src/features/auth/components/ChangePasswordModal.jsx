import React, { useState } from 'react';
import axios from 'axios';
import { X, Lock, CheckCircle } from 'lucide-react';
import './UpdateProfileModal.css';

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://utube-b49v.onrender.com/api/auth/update-password', {
        oldpassword: oldPassword,
        newpassword: newPassword
      }, { withCredentials: true });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="update-modal glass-card">
        <div className="modal-header">
          <h2>Change Password</h2>
          <button className="close-btn" onClick={onClose}><X /></button>
        </div>

        {success ? (
          <div className="success-state">
            <CheckCircle size={64} className="success-icon" />
            <p>Password Changed Successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
            </div>

            <button type="submit" className="submit-btn premium-gradient" disabled={loading}>
              <Lock size={18} style={{ marginRight: '8px' }} />
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
