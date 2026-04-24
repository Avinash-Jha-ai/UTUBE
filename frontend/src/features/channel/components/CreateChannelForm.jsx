import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel, clearChannelError } from '../state/channelSlice';
import { User, AtSign, FileText, Camera, Image as ImageIcon, Sparkles } from 'lucide-react';
import './CreateChannelForm.css';

const CreateChannelForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.channel);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    description: '',
    avatar: null,
    banner: null
  });

  useEffect(() => {
    dispatch(clearChannelError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createChannel(formData));
  };

  return (
    <div className="create-channel-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="create-channel-card "
      >
        <div className="form-header">
          <Sparkles className="header-icon" />
          <h1>Initiate Your Channel</h1>
          <p>Define your brand in the Utube ecosystem</p>
        </div>

        <form onSubmit={handleSubmit} className="channel-form">
          <div className="media-uploads">
            <label className="banner-upload ">
              {formData.banner ? (
                <img src={URL.createObjectURL(formData.banner)} alt="Banner" className="banner-preview" />
              ) : (
                <div className="upload-placeholder">
                  <ImageIcon size={32} />
                  <span>Upload Cover Art</span>
                </div>
              )}
              <input type="file" hidden accept="image/*" onChange={(e) => setFormData({...formData, banner: e.target.files[0]})} />
            </label>

            <label className="avatar-upload-circle ">
              {formData.avatar ? (
                <img src={URL.createObjectURL(formData.avatar)} alt="Avatar" className="avatar-preview" />
              ) : (
                <div className="upload-placeholder">
                  <Camera size={24} />
                </div>
              )}
              <input type="file" hidden accept="image/*" onChange={(e) => setFormData({...formData, avatar: e.target.files[0]})} />
            </label>
          </div>

          <div className="form-inputs">
            <div className="input-field ">
              <User size={20} />
              <input 
                type="text" 
                placeholder="Channel Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="input-field ">
              <AtSign size={20} />
              <input 
                type="text" 
                placeholder="Unique Handle (e.g. utube_creator)" 
                value={formData.handle}
                onChange={(e) => setFormData({...formData, handle: e.target.value})}
                required
              />
            </div>

            <div className="input-field  textarea-field">
              <FileText size={20} />
              <textarea 
                placeholder="Channel Description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            </div>
          </div>

          {error && error.message !== 'channel not found' && (
            <p className="form-error">{error.message || 'Error creating channel'}</p>
          )}

          <button type="submit" className="create-btn premium-gradient" disabled={loading}>
            {loading ? 'Building Reality...' : 'Launch Channel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateChannelForm;
