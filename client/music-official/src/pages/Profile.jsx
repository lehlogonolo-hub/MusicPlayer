import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaUser, FaEdit, FaSave, FaTimes, FaMusic, FaHistory, FaHeart, FaUpload } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    avatar: ''
  });
  const [stats, setStats] = useState({
    songsPlayed: 0,
    favoriteSongs: 0,
    playlistsCreated: 0,
    songsUploaded: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      // In a real app, you'd fetch this from your API
      setStats({
        songsPlayed: 124,
        favoriteSongs: 23,
        playlistsCreated: 5,
        songsUploaded: 8
      });

      setRecentActivity([
        { type: 'play', song: 'Blinding Lights', artist: 'The Weeknd', time: '2 hours ago' },
        { type: 'like', song: 'Save Your Tears', artist: 'The Weeknd', time: '1 day ago' },
        { type: 'create', playlist: 'Workout Mix', time: '2 days ago' },
        { type: 'upload', song: 'My New Track', time: '1 week ago' }
      ]);

      setProfileData({
        displayName: user.profile?.displayName || user.username,
        bio: user.profile?.bio || '',
        avatar: user.profile?.avatar || ''
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    try {
      // Update user profile
      updateUser({
        profile: profileData
      });
      
      setIsEditing(false);
      // In a real app, you'd make an API call to save the profile
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      displayName: user.profile?.displayName || user.username,
      bio: user.profile?.bio || '',
      avatar: user.profile?.avatar || ''
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="avatar-container">
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="avatar-placeholder">
                <FaUser />
              </div>
            )}
            {isEditing && (
              <label className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <FaEdit />
              </label>
            )}
          </div>
          <div className="profile-info">
            {isEditing ? (
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="edit-display-name"
                placeholder="Display Name"
              />
            ) : (
              <h1>{profileData.displayName}</h1>
            )}
            <p className="username">@{user.username}</p>
            <p className="email">{user.email}</p>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="edit-bio"
                placeholder="Tell us about yourself..."
                rows="3"
              />
            ) : (
              <p className="bio">{profileData.bio || 'No bio yet.'}</p>
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <div className="edit-actions">
              <button onClick={handleSaveProfile} className="save-btn">
                <FaSave /> Save
              </button>
              <button onClick={handleCancelEdit} className="cancel-btn">
                <FaTimes /> Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <FaHistory className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.songsPlayed}</h3>
            <p>Songs Played</p>
          </div>
        </div>
        <div className="stat-card">
          <FaHeart className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.favoriteSongs}</h3>
            <p>Favorites</p>
          </div>
        </div>
        <div className="stat-card">
          <FaMusic className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.playlistsCreated}</h3>
            <p>Playlists</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUpload className="stat-icon" />
          <div className="stat-info">
            <h3>{stats.songsUploaded}</h3>
            <p>Uploads</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Recent Activity
          </button>
          <button 
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
          <button 
            className={`tab ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            My Playlists
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview">
              <h3>Welcome back, {profileData.displayName}!</h3>
              <p>Here's your music journey so far:</p>
              <div className="overview-stats">
                <div className="overview-stat">
                  <span className="stat-label">Member since:</span>
                  <span className="stat-value">January 2024</span>
                </div>
                <div className="overview-stat">
                  <span className="stat-label">Favorite genre:</span>
                  <span className="stat-value">Pop</span>
                </div>
                <div className="overview-stat">
                  <span className="stat-label">Listening time:</span>
                  <span className="stat-value">42 hours</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-feed">
              <h3>Recent Activity</h3>
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'play' && <FaHistory />}
                    {activity.type === 'like' && <FaHeart />}
                    {activity.type === 'create' && <FaMusic />}
                    {activity.type === 'upload' && <FaUpload />}
                  </div>
                  <div className="activity-details">
                    <p>
                      {activity.type === 'play' && `Played "${activity.song}" by ${activity.artist}`}
                      {activity.type === 'like' && `Liked "${activity.song}" by ${activity.artist}`}
                      {activity.type === 'create' && `Created playlist "${activity.playlist}"`}
                      {activity.type === 'upload' && `Uploaded "${activity.song}"`}
                    </p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites">
              <h3>Favorite Songs</h3>
              <p>Your favorite songs will appear here.</p>
              {/* In a real app, you'd map through favorite songs */}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="playlists">
              <h3>Your Playlists</h3>
              <p>Your created playlists will appear here.</p>
              {/* In a real app, you'd map through user's playlists */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;