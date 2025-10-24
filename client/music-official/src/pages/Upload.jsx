import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaUpload, FaMusic, FaSpinner } from 'react-icons/fa';
import './Upload.css';

const Upload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    mood: '',
    lyrics: '',
    releaseYear: new Date().getFullYear(),
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country'];
  const moods = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'focused'];

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for audio files
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid audio file (MP3 or WAV)');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setMessage('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage('Please select an audio file');
      return;
    }

    if (!formData.title || !formData.artist || !formData.genre) {
      setMessage('Please fill in all required fields');
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage('');

    const submitData = new FormData();
    submitData.append('audio', selectedFile);
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    try {
      const response = await axios.post('/api/music/upload', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      setMessage('Song uploaded successfully!');
      // Reset form
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
        mood: '',
        lyrics: '',
        releaseYear: new Date().getFullYear(),
      });
      setSelectedFile(null);
      document.getElementById('audio-file').value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload song. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (!user) {
    return (
      <div className="upload-container">
        <div className="login-required">
          <FaMusic className="required-icon" />
          <h2>Login Required</h2>
          <p>Please log in to upload songs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <FaUpload className="upload-icon" />
          <h2>Upload New Song</h2>
          <p>Share your music with the world</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Song Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="artist">Artist *</label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="album">Album</label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="genre">Genre *</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Genre</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mood">Mood</label>
              <select
                id="mood"
                name="mood"
                value={formData.mood}
                onChange={handleInputChange}
              >
                <option value="">Select Mood</option>
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="releaseYear">Release Year</label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="lyrics">Lyrics</label>
            <textarea
              id="lyrics"
              name="lyrics"
              value={formData.lyrics}
              onChange={handleInputChange}
              rows="4"
              placeholder="Enter song lyrics (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="audio-file">Audio File *</label>
            <div className="file-upload">
              <input
                type="file"
                id="audio-file"
                accept="audio/*"
                onChange={handleFileSelect}
                required
              />
              <div className="file-info">
                {selectedFile ? (
                  <>
                    <FaMusic />
                    <span>{selectedFile.name}</span>
                    <small>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</small>
                  </>
                ) : (
                  <>
                    <FaUpload />
                    <span>Choose audio file (MP3, WAV)</span>
                    <small>Max 50MB</small>
                  </>
                )}
              </div>
            </div>
          </div>

          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>
          )}

          <button 
            type="submit" 
            className="upload-button"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <FaSpinner className="spinner" />
                Uploading...
              </>
            ) : (
              'Upload Song'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;