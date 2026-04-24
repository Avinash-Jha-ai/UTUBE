import React, { useEffect, useState } from 'react';
import { Home, TrendingUp, PlaySquare, Clock, ThumbsUp, Library, History, ChevronRight, Radio } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/hooks/useAuth';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user) {
        try {
          const response = await axios.get('https://utube-b49v.onrender.com/api/subscribe/me');
          if (response.data.success) {
            setSubscriptions(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
        }
      }
    };
    fetchSubscriptions();
  }, [user]);

  const menuItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/' },
    { icon: <History size={22} />, label: 'History', path: '/history' },
  ];

  return (
    <aside className={`sidebar ${!isOpen ? 'mini' : ''}`}>
      <div className="sidebar-section">
        {menuItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="sidebar-divider"></div>

      {isOpen && user && (
        <div className="subscriptions-section">
          <div className="section-header">
            <h3 className="section-title">Subscriptions</h3>
            <ChevronRight size={18} className="section-arrow" />
          </div>
          
          <div className="sub-list">
            {subscriptions?.map((sub, index) => {
              if (!sub.channel) return null;
              return (
                <div 
                  key={sub._id} 
                  className="sub-item"
                  onClick={() => navigate(`/channel/${sub.channel.handle}`)}
                >
                  <img 
                    src={sub.channel.avatar || 'https://avatar.iran.liara.run/public'} 
                    alt={sub.channel.name} 
                    className="sub-avatar"
                  />
                  <span className="sub-name">{sub.channel.name}</span>
                  {/* Visual indicators matching the screenshot */}
                  {index === 0 && <Radio size={16} className="live-icon" />}
                  {index > 0 && index < 4 && <span className="blue-dot"></span>}
                </div>
              );
            })}
          </div>

        </div>
      )}
      
      <div className="sidebar-divider"></div>
      
      {!isOpen ? null : <h3 className="section-title">Explore</h3>}
      
      <div className="sidebar-section">
        <NavLink to="/liked-videos" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <ThumbsUp size={22} /> <span>Liked Videos</span>
        </NavLink>
        <NavLink to="/watch-later" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Clock size={22} /> <span>Watch Later</span>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;

