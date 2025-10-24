import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMusic } from '../contexts/MusicContext';
import { FaPlay, FaHeart, FaPlus } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredSongs, setFeaturedSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong } = useMusic();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [songsRes, recommendationsRes] = await Promise.all([
        axios.get('/api/music/songs?limit=10&sortBy=plays&order=desc'),
        axios.get('/api/music/recommendations'),
      ]);

      setFeaturedSongs(songsRes.data.songs.slice(0, 5));
      setNewReleases(songsRes.data.songs.slice(5, 10));
      setRecommendations(recommendationsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  const handlePlaySong = (song, list, index) => {
    playSong(song, list, index);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <h1>Discover New Music</h1>
        <p>Stream millions of songs, create playlists, and share with friends</p>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Featured Songs</h2>
          <Link to="/search" className="see-all">See All</Link>
        </div>
        <div className="song-grid">
          {featuredSongs.map((song, index) => (
            <div key={song._id} className="song-card">
              <div className="song-cover">
                <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                <button 
                  className="play-btn"
                  onClick={() => handlePlaySong(song, featuredSongs, index)}
                >
                  <FaPlay />
                </button>
              </div>
              <div className="song-info">
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
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
            <div key={song._id} className="song-card">
              <div className="song-cover">
                <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                <button 
                  className="play-btn"
                  onClick={() => handlePlaySong(song, recommendations, index)}
                >
                  <FaPlay />
                </button>
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
    </div>
  );
};

export default Home;