import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../contexts/MusicContext';
import { FaPlay, FaHeart, FaPlus, FaGlobe, FaUser, FaFilter } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('all'); // all, api, user
  const { playSong } = useMusic();

  useEffect(() => {
    fetchHomeData();
  }, [sourceFilter]);

  const fetchHomeData = async () => {
    try {
      const [songsRes, recommendationsRes] = await Promise.all([
        axios.get(`/api/music/songs?limit=12&source=${sourceFilter}`),
        axios.get('/api/music/recommendations'),
      ]);

      const allSongs = songsRes.data.data.songs;
      setFeaturedSongs(allSongs.slice(0, 6));
      setNewReleases(allSongs.slice(6, 12));
      setRecommendations(recommendationsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  const handlePlaySong = (song, list, index) => {
    playSong(song, list, index);
  };

  const getSourceBadge = (source) => {
    const badges = {
      jamendo: { label: 'Jamendo', color: '#ff6b6b', icon: FaGlobe },
      deezer: { label: 'Deezer', color: '#4ecdc4', icon: FaGlobe },
      user: { label: 'User Upload', color: '#1db954', icon: FaUser },
      sample: { label: 'Sample', color: '#666', icon: FaGlobe }
    };
    
    const badge = badges[source] || { label: source, color: '#999', icon: FaGlobe };
    const Icon = badge.icon;
    
    return (
      <span className="source-badge" style={{ backgroundColor: badge.color }}>
        <Icon className="badge-icon" />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading music...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <h1>Discover New Music</h1>
        <p>Stream from multiple sources and share your own creations</p>
        
        <div className="source-filters">
          <button 
            className={`filter-btn ${sourceFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSourceFilter('all')}
          >
            <FaFilter /> All Sources
          </button>
          <button 
            className={`filter-btn ${sourceFilter === 'api' ? 'active' : ''}`}
            onClick={() => setSourceFilter('api')}
          >
            <FaGlobe /> Streaming
          </button>
          <button 
            className={`filter-btn ${sourceFilter === 'user' ? 'active' : ''}`}
            onClick={() => setSourceFilter('user')}
          >
            <FaUser /> Community
          </button>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Featured Songs</h2>
          <Link to="/search" className="see-all">See All</Link>
        </div>
        <div className="song-grid">
          {featuredSongs.map((song, index) => (
            <div key={song.id} className="song-card">
              <div className="song-cover">
                <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                <button 
                  className="play-btn"
                  onClick={() => handlePlaySong(song, featuredSongs, index)}
                >
                  <FaPlay />
                </button>
                {getSourceBadge(song.source)}
              </div>
              <div className="song-info">
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
                <span className="song-meta">
                  {song.genre} • {Math.floor(song.duration / 60)}:
                  {(song.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="song-actions">
                <button className="action-btn">
                  <FaHeart />
                </button>
                <button className="action-btn">
                  <FaPlus />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>New Releases</h2>
          <Link to="/search" className="see-all">See All</Link>
        </div>
        <div className="song-list">
          {newReleases.map((song, index) => (
            <div key={song.id} className="song-row">
              <div className="song-main">
                <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                <div>
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                  {getSourceBadge(song.source)}
                </div>
              </div>
              <div className="song-meta">
                <span>{song.genre}</span>
                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <button 
                className="play-btn-sm"
                onClick={() => handlePlaySong(song, newReleases, index)}
              >
                <FaPlay />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Recommended For You</h2>
        </div>
        <div className="song-grid">
          {recommendations.slice(0, 6).map((song, index) => (
            <div key={song.id} className="song-card">
              <div className="song-cover">
                <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                <button 
                  className="play-btn"
                  onClick={() => handlePlaySong(song, recommendations, index)}
                >
                  <FaPlay />
                </button>
                {getSourceBadge(song.source)}
              </div>
              <div className="song-info">
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
                <span className="song-mood">{song.mood}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="upload-cta">
        <div className="cta-content">
          <h3>Share Your Music</h3>
          <p>Upload your own tracks and join our community of music creators</p>
          <Link to="/upload" className="cta-button">
            <FaPlus /> Upload Your Song
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;