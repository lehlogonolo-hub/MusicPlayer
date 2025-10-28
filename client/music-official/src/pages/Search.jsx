import React, { useState, useEffect, useCallback } from 'react';
import { useMusic } from '../contexts/MusicContext';
import axios from 'axios';
import { FaPlay, FaSearch, FaFilter, FaHeart, FaPlus, FaGlobe, FaUser } from 'react-icons/fa';
import './Search.css';

const Search = () => {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    mood: '',
    source: 'all',
    sortBy: 'popularity',
    order: 'desc'
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { playSong } = useMusic();

  const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'];
  const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'focused'];
  const sources = [
    { value: 'all', label: 'All Sources', icon: FaGlobe },
    { value: 'api', label: 'Streaming', icon: FaGlobe },
    { value: 'user', label: 'Community', icon: FaUser }
  ];

  // Debounced search
  const searchSongs = useCallback(async () => {
    if (!searchTerm && !filters.genre && !filters.mood) {
      setSongs([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.source) params.append('source', filters.source);
      params.append('sortBy', filters.sortBy);
      params.append('order', filters.order);

      const response = await axios.get(`/api/music/songs?${params}`);
      setSongs(response.data.data.songs);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching songs:', error);
      setSongs([]);
    }
    setLoading(false);
  }, [searchTerm, filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSongs();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [searchSongs]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      mood: '',
      source: 'all',
      sortBy: 'popularity',
      order: 'desc'
    });
    setSearchTerm('');
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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
          Filters {Object.values(filters).filter(v => v !== '' && v !== 'all').length > 0 ? `(${Object.values(filters).filter(v => v !== '' && v !== 'all').length})` : ''}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">
              Clear All
            </button>
          </div>
          
          <div className="filters-grid">
            <div className="filter-group">
              <label>Source</label>
              <div className="source-filters">
                {sources.map(source => {
                  const Icon = source.icon;
                  return (
                    <button
                      key={source.value}
                      className={`source-filter ${filters.source === source.value ? 'active' : ''}`}
                      onClick={() => handleFilterChange('source', source.value)}
                    >
                      <Icon />
                      {source.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="filter-group">
              <label>Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Mood</label>
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
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popularity">Popularity</option>
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select
                value={filters.order}
                onChange={(e) => handleFilterChange('order', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="search-results">
        {loading ? (
          <div className="loading">Searching...</div>
        ) : (
          <>
            {hasSearched && (
              <div className="results-header">
                <h3>
                  {songs.length} result{songs.length !== 1 ? 's' : ''} found
                  {searchTerm && ` for "${searchTerm}"`}
                </h3>
              </div>
            )}

            {!hasSearched ? (
              <div className="search-placeholder">
                <FaSearch className="placeholder-icon" />
                <h3>Discover Music</h3>
                <p>Search for songs, artists, or use filters to find exactly what you're looking for.</p>
                <div className="search-tips">
                  <h4>Search Tips:</h4>
                  <ul>
                    <li>Search by song title, artist name, or album</li>
                    <li>Use filters to narrow down by genre, mood, or source</li>
                    <li>Try different sorting options</li>
                  </ul>
                </div>
              </div>
            ) : songs.length === 0 ? (
              <div className="no-results">
                <FaSearch className="no-results-icon" />
                <h3>No results found</h3>
                <p>Try adjusting your search terms or filters.</p>
                <button onClick={clearFilters} className="clear-search">
                  Clear Search & Filters
                </button>
              </div>
            ) : (
              <div className="songs-grid">
                {songs.map((song, index) => (
                  <div key={song.id} className="song-card">
                    <div className="song-cover">
                      <img src={song.coverArt || '/default-cover.jpg'} alt={song.title} />
                      <button 
                        className="play-btn"
                        onClick={() => playSong(song, songs, index)}
                      >
                        <FaPlay />
                      </button>
                      {getSourceBadge(song.source)}
                    </div>
                    <div className="song-info">
                      <h4>{song.title}</h4>
                      <p>{song.artist}</p>
                      <div className="song-meta">
                        <span>{song.genre}</span>
                        <span>{formatDuration(song.duration)}</span>
                      </div>
                      {song.mood && (
                        <span className="song-mood">{song.mood}</span>
                      )}
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;