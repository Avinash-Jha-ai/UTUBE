import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './UploadPage.css';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', isPublic: true });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('video', file);
    if (thumbnail) data.append('thumbnail', thumbnail);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('isPublic', formData.isPublic);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/content/upload/video', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });
      setStatus('success');
    } catch (error) {
      console.error("Upload error:", error);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="upload-container glass-card"
      >
        <div className="upload-header">
          <h2>Upload Cinematic Content</h2>
          <button className="close-btn"><X size={24} /></button>
        </div>

        {!status ? (
          <form onSubmit={handleUpload} className="upload-form">
            {!file ? (
              <div className="drop-zone glass-card">
                <UploadIcon size={48} className="upload-icon" />
                <p>Drag and drop video files to upload</p>
                <label className="select-btn premium-gradient">
                  Select Files
                  <input type="file" accept="video/*" hidden onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>
            ) : (
              <div className="upload-details">
                <div className="file-preview glass-card">
                  <p>File: {file.name}</p>
                  <button onClick={() => setFile(null)}><X size={16} /></button>
                </div>

                <div className="input-group-v">
                  <label>Title</label>
                  <input 
                    type="text" 
                    placeholder="Add a title that describes your video"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div className="input-group-v">
                  <label>Description</label>
                  <textarea 
                    placeholder="Tell viewers about your video"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="input-group-v">
                  <label>Thumbnail</label>
                  <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
                </div>

                {uploading && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill premium-gradient" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>{progress}% Uploaded</span>
                  </div>
                )}

                <button type="submit" className="upload-submit-btn premium-gradient" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Publish Video'}
                </button>
              </div>
            )}
          </form>
        ) : (
          <div className="status-view">
            {status === 'success' ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="status-success">
                <CheckCircle size={64} color="#00ff00" />
                <h3>Upload Complete!</h3>
                <p>Your video is being processed and will be live soon.</p>
                <button onClick={() => window.location.reload()} className="select-btn premium-gradient">Upload Another</button>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="status-error">
                <AlertCircle size={64} color="#ff0000" />
                <h3>Upload Failed</h3>
                <p>Something went wrong. Please check your connection and try again.</p>
                <button onClick={() => setStatus(null)} className="select-btn premium-gradient">Try Again</button>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UploadPage;
