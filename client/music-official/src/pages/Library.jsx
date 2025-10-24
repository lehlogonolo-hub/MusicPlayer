import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import axios from 'axios';
import { FaPlay, FaPlus, FaHeart, FaHistory } from 'react-icons/fa';
import './Library.css';

const Library = () => {
  const { user } = useAuth();
  const { playSong } = useMusic();
  const [playlists, setPlaylists] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('playlists');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLibraryData();
    }
  }, [user]);

  const fetchLibraryData = async () => {
    try {
      // In a real app, you'd have API endpoints for these
      const [playlistsRes, favoritesRes, historyRes] = await Promise.all([
        axios.get('/api/music/playlists/user'),
        axios.get('/api/music/songs/favorites'),
        axios.get('/api/music/history'),
      ]);

      setPlaylists(playlistsRes.data);
      setFavoriteSongs(favoritesRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      console.error('Error fetching library data:', error);
      // For demo purposes, we'll set empty arrays
      setPlaylists([]);
      setFavoriteSongs([]);
      setHistory([]);
    }
    setLoading(false);
  };

  const createNewPlaylist = async () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      try {
        const response = await axios.post('/api/music/playlists', {
          name,
          description: '',
          isPublic: true,
        });
        setPlaylists(prev => [...prev, response.data]);
      } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading your library...</div>;
  }

  return (
    <div className="library">
      <div className="library-header">
        <h1>Your Library</h1>
        <button className="create-playlist-btn" onClick={createNewPlaylist}>
          <FaPlus />
          New Playlist
        </button>
      </div>

      <div className="library-tabs">
        <button 
          className={`tab ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </button>
        <button 
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Listening History
        </button>
      </div>

      <div className="library-content">
        {activeTab === 'playlists' && (
          <div className="playlists-grid">
            {playlists.length === 0 ? (
              <div className="empty-state">
                <FaPlus className="empty-icon" />
                <h3>No playlists yet</h3>
                <p>Create your first playlist to get started</p>
                <button onClick={createNewPlaylist} className="create-btn">
                  Create Playlist
                </button>
              </div>
            ) : (
              playlists.map(playlist => (
                <div key={playlist._id} className="playlist-card">
                  <div className="playlist-cover">
                    <img 
                      src={playlist.coverArt || '/default-playlist.jpg'} 
                      alt={playlist.name}
                    />
                    <button className="play-btn">
                      <FaPlay />
                    </button>
                  </div>
                  <div className="playlist-info">
                    <h4>{playlist.name}</h4>
                    <p>{playlist.songs?.length || 0} songs</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="songs-list">
            {favoriteSongs.length === 0 ? (
              <div className="empty-state">
                <FaHeart className="empty-icon" />
                <h3>No favorite songs</h3>
                <p>Start liking songs to see them here</p>
              </div>
            ) : (
              favoriteSongs.map((song, index) => (
                <div key={song._id} className="song-row">
                  <div className="song-main">
                    <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                    <div>
                      <h4>{song.title}</h4>
                      <p>{song.artist}</p>
                    </div>
                  </div>
                  <div className="song-meta">
                    <span>{song.genre}</span>
                    <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                  <button 
                    className="play-btn-sm"
                    onClick={() => playSong(song, favoriteSongs, index)}
                  >
                    <FaPlay />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="songs-list">
            {history.length === 0 ? (
              <div className="empty-state">
                <FaHistory className="empty-icon" />
                <h3>No listening history</h3>
                <p>Your recently played songs will appear here</p>
              </div>
            ) : (
              history.map((item, index) => (
                <div key={item._id} className="song-row">
                  <div className="song-main">
                    <img src={item.song.coverArt || '/default-cover.jpg'} alt={item.song.title} />
                    <div>
                      <h4>{item.song.title}</h4>
                      <p>{item.song.artist}</p>
                      <small>Played {new Date(item.playedAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <button 
                    className="play-btn-sm"
                    onClick={() => playSong(item.song, history.map(h => h.song), index)}
                  >
                    <FaPlay />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;