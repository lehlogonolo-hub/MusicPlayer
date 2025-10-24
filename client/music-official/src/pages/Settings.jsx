import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import { 
  FaSave, 
  FaBell, 
  FaVolumeUp, 
  FaPalette, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaUser,
  FaLock,
  FaCog
} from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const { volume, setVolume } = useMusic();
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    // Account settings
    email: user?.email || '',
    username: user?.username || '',
    
    // Privacy settings
    privateMode: false,
    showListeningActivity: true,
    allowTracking: true,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    newReleases: true,
    playlistUpdates: false,
    
    // Audio settings
    audioQuality: 'high', // low, medium, high
    crossfade: false,
    crossfadeDuration: 5,
    normalizeVolume: true,
    
    // Appearance settings
    theme: 'light', // light, dark, auto
    language: 'en',
    reduceAnimations: false
  });
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };

  const handleSaveSettings = async () => {
    try {
      // In a real app, you'd make an API call to save settings
      console.log('Saving settings:', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, you'd make an API call to delete the account
      console.log('Account deletion requested');
      logout();
    }
  };

  const handleExportData = () => {
    // In a real app, you'd generate and download user data
    alert('Data export feature coming soon!');
  };

  const sections = [
    { id: 'account', label: 'Account', icon: FaUser },
    { id: 'privacy', label: 'Privacy', icon: FaLock },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'audio', label: 'Audio', icon: FaVolumeUp },
    { id: 'appearance', label: 'Appearance', icon: FaPalette }
  ];

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and settings</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon className="sidebar-icon" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <div className="settings-content">
          {activeSection === 'account' && (
            <div className="settings-section">
              <h2>Account Settings</h2>
              
              <div className="setting-group">
                <label className="setting-label">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                  className="setting-input"
                />
                <p className="setting-description">
                  Your email address is used for account recovery and notifications.
                </p>
              </div>

              <div className="setting-group">
                <label className="setting-label">Username</label>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => handleSettingChange('username', e.target.value)}
                  className="setting-input"
                />
                <p className="setting-description">
                  This is your public display name.
                </p>
              </div>

              <div className="setting-group">
                <h3>Data Management</h3>
                <div className="setting-actions">
                  <button onClick={handleExportData} className="action-btn secondary">
                    Export My Data
                  </button>
                  <button onClick={handleDeleteAccount} className="action-btn danger">
                    <FaTrash /> Delete Account
                  </button>
                </div>
                <p className="setting-description">
                  Export your data or permanently delete your account.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>
              
              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Private Session</label>
                    <p className="setting-description">
                      Listen anonymously by hiding your activity from others
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.privateMode}
                      onChange={(e) => handleSettingChange('privateMode', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Show Listening Activity</label>
                    <p className="setting-description">
                      Allow others to see what you're listening to
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.showListeningActivity}
                      onChange={(e) => handleSettingChange('showListeningActivity', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Data Collection</label>
                    <p className="setting-description">
                      Allow us to collect usage data to improve the service
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.allowTracking}
                      onChange={(e) => handleSettingChange('allowTracking', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              
              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Email Notifications</label>
                    <p className="setting-description">
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Push Notifications</label>
                    <p className="setting-description">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">New Releases</label>
                    <p className="setting-description">
                      Get notified about new releases from your favorite artists
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.newReleases}
                      onChange={(e) => handleSettingChange('newReleases', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Playlist Updates</label>
                    <p className="setting-description">
                      Notify when playlists you follow are updated
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.playlistUpdates}
                      onChange={(e) => handleSettingChange('playlistUpdates', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audio' && (
            <div className="settings-section">
              <h2>Audio Settings</h2>
              
              <div className="setting-group">
                <label className="setting-label">Volume Level</label>
                <div className="volume-control">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                  />
                  <span className="volume-value">{Math.round(volume * 100)}%</span>
                </div>
              </div>

              <div className="setting-group">
                <label className="setting-label">Audio Quality</label>
                <select
                  value={settings.audioQuality}
                  onChange={(e) => handleSettingChange('audioQuality', e.target.value)}
                  className="setting-select"
                >
                  <option value="low">Low (96 kbps)</option>
                  <option value="medium">Medium (160 kbps)</option>
                  <option value="high">High (320 kbps)</option>
                </select>
                <p className="setting-description">
                  Higher quality uses more data
                </p>
              </div>

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Crossfade</label>
                    <p className="setting-description">
                      Smooth transition between songs
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.crossfade}
                      onChange={(e) => handleSettingChange('crossfade', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              {settings.crossfade && (
                <div className="setting-group">
                  <label className="setting-label">Crossfade Duration</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={settings.crossfadeDuration}
                    onChange={(e) => handleSettingChange('crossfadeDuration', parseInt(e.target.value))}
                    className="setting-range"
                  />
                  <div className="range-labels">
                    <span>1s</span>
                    <span>{settings.crossfadeDuration}s</span>
                    <span>12s</span>
                  </div>
                </div>
              )}

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Normalize Volume</label>
                    <p className="setting-description">
                      Set consistent volume level across all songs
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.normalizeVolume}
                      onChange={(e) => handleSettingChange('normalizeVolume', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="settings-section">
              <h2>Appearance Settings</h2>
              
              <div className="setting-group">
                <label className="setting-label">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="setting-select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div className="setting-group">
                <label className="setting-label">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="setting-select"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div className="setting-group">
                <div className="toggle-setting">
                  <div className="toggle-info">
                    <label className="setting-label">Reduce Animations</label>
                    <p className="setting-description">
                      Minimize animations for better performance
                    </p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.reduceAnimations}
                      onChange={(e) => handleSettingChange('reduceAnimations', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button 
              onClick={handleSaveSettings}
              className={`save-settings-btn ${saved ? 'saved' : ''}`}
            >
              <FaSave />
              {saved ? 'Settings Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;