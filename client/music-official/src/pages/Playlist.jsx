import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMusic } from '../contexts/MusicContext';
import axios from 'axios';
import { FaPlay, FaPlus, FaClock, FaEllipsisH } from 'react-icons/fa';
import './Playlist.css';

const Playlist = () => {
  const { id } = useParams();
  const { playSong } = useMusic();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`/api/music/playlists/${id}`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      setError('Failed to load playlist');
    }
    setLoading(false);
  };

  const handlePlayAll = () => {
    if (playlist?.songs?.length > 0) {
      playSong(playlist.songs[0], playlist.songs, 0);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="loading">Loading playlist...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!playlist) {
    return <div className="error">Playlist not found</div>;
  }

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <div className="playlist-cover-large">
          <img 
            src={playlist.coverArt || '/default-playlist.jpg'} 
            alt={playlist.name}
          />
        </div>
        <div className="playlist-info">
          <p className="playlist-type">PLAYLIST</p>
          <h1>{playlist.name}</h1>
          {playlist.description && <p className="playlist-description">{playlist.description}</p>}
          <div className="playlist-meta">
            <span className="owner">By {playlist.owner?.username || 'Unknown'}</span>
            <span>•</span>
            <span>{playlist.songs?.length || 0} songs</span>
          </div>
        </div>
      </div>

      <div className="playlist-actions">
        <button className="play-button" onClick={handlePlayAll}>
          <FaPlay />
        </button>
        <button className="more-actions">
          <FaEllipsisH />
        </button>
      </div>

      <div className="songs-table">
        <div className="table-header">
          <div className="header-number">#</div>
          <div className="header-title">Title</div>
          <div className="header-album">Album</div>
          <div className="header-duration">
            <FaClock />
          </div>
        </div>

        {playlist.songs?.length === 0 ? (
          <div className="empty-playlist">
            <FaPlus className="empty-icon" />
            <h3>This playlist is empty</h3>
            <p>Add some songs to get started</p>
          </div>
        ) : (
          playlist.songs?.map((song, index) => (
            <div 
              key={song._id} 
              className="song-row"
              onDoubleClick={() => playSong(song, playlist.songs, index)}
            >
              <div className="song-number">
                <span className="number">{index + 1}</span>
                <button 
                  className="play-cell-btn"
                  onClick={() => playSong(song, playlist.songs, index)}
                >
                  <FaPlay />
                </button>
              </div>
              <div className="song-info">
                <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                <div>
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                </div>
              </div>
              <div className="song-album">
                {song.album || 'Single'}
              </div>
              <div className="song-duration">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Playlist;