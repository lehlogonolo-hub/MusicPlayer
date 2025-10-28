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
    songsUploaded: 0,
    listeningTime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [uploadedSongs, setUploadedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`/api/users/${user.id}/profile`);
      const data = response.data.data;
      
      setStats(data.user.stats);
      setRecentActivity(data.recentActivity || []);
      setFavoriteSongs(data.favoriteSongs || []);
      setUploadedSongs(data.uploadedSongs || []);
      
      setProfileData({
        displayName: data.user.profile.displayName || user.username,
        bio: data.user.profile.bio || '',
        avatar: data.user.profile.avatar || ''
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Fallback to user data from context
      setStats(user.stats || {
        songsPlayed: 0,
        favoriteSongs: 0,
        playlistsCreated: 0,
        songsUploaded: 0,
        listeningTime: 0
      });
      
      setProfileData({
        displayName: user.profile?.displayName || user.username,
        bio: user.profile?.bio || '',
        avatar: user.profile?.avatar || ''
      });
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`/api/users/${user.id}/profile`, profileData);
      
      // Update user context
      updateUser({
        profile: profileData,
        stats: response.data.data.user.stats
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
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

  const formatListeningTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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
        <div className="stat-card">
          <FaHistory className="stat-icon" />
          <div className="stat-info">
            <h3>{formatListeningTime(stats.listeningTime)}</h3>
            <p>Listening Time</p>
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
            Favorites ({favoriteSongs.length})
          </button>
          <button 
            className={`tab ${activeTab === 'uploads' ? 'active' : ''}`}
            onClick={() => setActiveTab('uploads')}
          >
            My Uploads ({uploadedSongs.length})
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
                  <span className="stat-value">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-label">Favorite genre:</span>
                  <span className="stat-value">
                    {user.preferences?.genres?.[0] || 'Not set'}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-label">Total listening time:</span>
                  <span className="stat-value">
                    {formatListeningTime(stats.listeningTime)}
                  </span>
                </div>
                <div className="overview-stat">
                  <span className="stat-label">Songs discovered:</span>
                  <span className="stat-value">{stats.songsPlayed}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-feed">
              <h3>Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <div className="empty-state">
                  <p>No recent activity yet. Start listening to music!</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <FaHistory />
                    </div>
                    <div className="activity-details">
                      <p>Played "{activity.songTitle}" by {activity.artist}</p>
                      <span className="activity-time">
                        {new Date(activity.playedAt).toLocaleDateString()} at{' '}
                        {new Date(activity.playedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites">
              <h3>Favorite Songs ({favoriteSongs.length})</h3>
              {favoriteSongs.length === 0 ? (
                <div className="empty-state">
                  <FaHeart className="empty-icon" />
                  <p>No favorite songs yet. Start liking songs to see them here!</p>
                </div>
              ) : (
                <div className="songs-list">
                  {favoriteSongs.map((fav, index) => (
                    <div key={index} className="song-row">
                      <div className="song-main">
                        <div className="song-cover-small">
                          <FaMusic />
                        </div>
                        <div>
                          <h4>{fav.songTitle}</h4>
                          <p>{fav.artist}</p>
                          <small>Added {new Date(fav.addedAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'uploads' && (
            <div className="uploads">
              <h3>My Uploads ({uploadedSongs.length})</h3>
              {uploadedSongs.length === 0 ? (
                <div className="empty-state">
                  <FaUpload className="empty-icon" />
                  <p>No uploads yet. Share your first song with the community!</p>
                </div>
              ) : (
                <div className="songs-list">
                  {uploadedSongs.map((upload, index) => (
                    <div key={index} className="song-row">
                      <div className="song-main">
                        <div className="song-cover-small">
                          <FaMusic />
                        </div>
                        <div>
                          <h4>{upload.title}</h4>
                          <p>{upload.artist}</p>
                          <small>Uploaded {new Date(upload.uploadedAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <div className="song-actions">
                        <span className="upload-badge">Your Upload</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;