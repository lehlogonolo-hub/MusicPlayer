import React, { useState, useEffect } from 'react';
import { useMusic } from '../contexts/MusicContext';
import axios from 'axios';
import { FaPlay, FaSearch, FaFilter } from 'react-icons/fa';
import './Search.css';

const Search = () => {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    mood: '',
    sortBy: 'plays',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { playSong } = useMusic();

  useEffect(() => {
    if (searchTerm || filters.genre || filters.mood) {
      searchSongs();
    }
  }, [searchTerm, filters]);

  const searchSongs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.mood) params.append('mood', filters.mood);
      params.append('sortBy', filters.sortBy);
      params.append('order', filters.order);

      const response = await axios.get(`/api/music/songs?${params}`);
      setSongs(response.data.songs);
    } catch (error) {
      console.error('Error searching songs:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'];
  const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'focused'];

  return (
    <div className="search">
      <div className="search-header">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            value={filters.mood}
            onChange={(e) => handleFilterChange('mood', e.target.value)}
          >
            <option value="">All Moods</option>
            {moods.map(mood => (
              <option key={mood} value={mood}>
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="plays">Most Popular</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="releaseYear">Release Year</option>
          </select>

          <select
            value={filters.order}
            onChange={(e) => handleFilterChange('order', e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="loading">Searching...</div>
      ) : (
        <div className="search-results">
          {songs.map((song, index) => (
            <div key={song._id} className="search-result">
              <div className="result-info">
                <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                <div>
                  <h4>{song.title}</h4>
                  <p>{song.artist}</p>
                  <span className="song-details">
                    {song.genre} • {song.mood} • {Math.floor(song.duration / 60)}:
                    {(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              <button 
                className="play-btn"
                onClick={() => playSong(song, songs, index)}
              >
                <FaPlay />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;