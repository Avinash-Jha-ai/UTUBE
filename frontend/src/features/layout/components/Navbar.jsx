import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Video, User, Menu, LogOut, Mic, Plus, Tv, Settings, KeyRound, MicOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';
import { updateUser } from '../../auth/state/authSlice';
import UpdateProfileModal from '../../auth/components/UpdateProfileModal';
import ChangePasswordModal from '../../auth/components/ChangePasswordModal';
import './Navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/results?search_query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is supported in Chrome and Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setIsListening(false);
          navigate(`/results?search_query=${encodeURIComponent(currentTranscript)}`);
        }
      }
      setSearchQuery(currentTranscript);
    };


    recognition.onerror = (event) => {
      setIsListening(false);
      console.error("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone access denied. Please enable it in settings.");
      }
    };

    recognition.onend = () => {
      setIsListening(true); // Visual indicator stays until result or error
      setTimeout(() => setIsListening(false), 1000);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(error);
      setIsListening(false);
    }
  };



  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <Link to="/" className="logo">
          <Tv size={28} color="#e50914" fill="#e50914" />
          <span className="logo-text">UTUBE</span>
        </Link>
      </div>

      <div className="nav-center">
        <form className="search-wrapper" onSubmit={handleSearch}>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <Search size={19} />
            </button>
          </div>
          <button 
            type="button" 
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceSearch}
          >
            {isListening ? <MicOff size={19} color="#e50914" /> : <Mic size={19} fill="white" />}
          </button>
        </form>
      </div>


      <div className="nav-right">
        <Link to="/upload" className="create-btn">
          <Plus size={18} />
          <span>Create</span>
        </Link>
        {user ? (
          <div className="user-profile-container">
            <button 
              className="user-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img src={user.avatar || 'https://avatar.iran.liara.run/public'} alt="Profile" className="user-avatar-img" />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="profile-dropdown"
                >
                  <div className="dropdown-header">
                    <img src={user.avatar || 'https://avatar.iran.liara.run/public'} alt="Avatar" className="dropdown-avatar" />
                    <div className="dropdown-user-details">
                      <p className="user-fullname">{user.fullname}</p>
                      <p className="user-handle">@{user.fullname.toLowerCase().replace(/\s/g, '')}</p>
                      <Link to="/my-channel" className="view-channel-link" onClick={() => setShowDropdown(false)}>
                        View your channel
                      </Link>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-actions">
                    <button 
                      className="dropdown-action-item" 
                      onClick={() => { setIsProfileModalOpen(true); setShowDropdown(false); }}
                    >
                      <Settings size={20} />
                      <span>Update Profile</span>
                    </button>
                    <button 
                      className="dropdown-action-item" 
                      onClick={() => { setIsPasswordModalOpen(true); setShowDropdown(false); }}
                    >
                      <KeyRound size={20} />
                      <span>Change Password</span>
                    </button>
                    <button className="dropdown-action-item signout-btn" onClick={() => { signout(); setShowDropdown(false); }}>
                      <LogOut size={20} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isProfileModalOpen && (
              <UpdateProfileModal 
                user={user}
                onClose={() => setIsProfileModalOpen(false)}
                onUpdate={(updatedData) => dispatch(updateUser(updatedData))}
              />
            )}

            {isPasswordModalOpen && (
              <ChangePasswordModal 
                onClose={() => setIsPasswordModalOpen(false)}
              />
            )}
          </div>
        ) : (
          <Link to="/auth" className="login-button premium-gradient">
            <User size={16} />
            <span>Join Utube</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
