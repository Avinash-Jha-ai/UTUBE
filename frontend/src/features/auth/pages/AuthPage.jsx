import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register, loading, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login({ email: formData.email, password: formData.password });
    } else {
      await register(formData);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="pulse-1"></div>
        <div className="pulse-2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-card "
      >
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Enter your credentials to access Utube' : 'Join the cinematic revolution'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="avatar-upload-container"
                >
                  <label className="avatar-label ">
                    {formData.avatar ? (
                      <img src={URL.createObjectURL(formData.avatar)} alt="Preview" className="avatar-preview" />
                    ) : (
                      <div className="avatar-placeholder-v">
                        <User size={32} />
                        <span>Upload Photo</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      hidden 
                      onChange={(e) => setFormData({...formData, avatar: e.target.files[0]})}
                    />
                  </label>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="input-group "
                >
                  <User className="input-icon" size={20} />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="input-group ">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="input-group ">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          {error && <p className="auth-error">{error.message || 'An error occurred'}</p>}

          <button type="submit" className="auth-submit premium-gradient" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
