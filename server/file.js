import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FaUpload, FaMusic, FaSpinner, FaCheck } from 'react-icons/fa';
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
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Amapiano', 'Reggae', 'Gqom'];
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
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/aac'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('Please select a valid audio file (MP3, WAV, OGG, AAC)');
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
    
    if (!user) {
      setMessage('Please log in to upload songs');
      return;
    }

    if (!selectedFile) {
      setMessage('Please select an audio file');
      return;
    }

    if (!formData.title || !formData.artist || !formData.genre) {
      setMessage('Please fill in all required fields (Title, Artist, Genre)');
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage('');
    setUploadSuccess(false);

    const submitData = new FormData();
    submitData.append('audio', selectedFile);
    submitData.append('title', formData.title);
    submitData.append('artist', formData.artist);
    submitData.append('album', formData.album);
    submitData.append('genre', formData.genre);
    submitData.append('mood', formData.mood);
    submitData.append('lyrics', formData.lyrics);
    submitData.append('releaseYear', formData.releaseYear.toString());

    try {
      const response = await axios.post('/api/music/upload', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      if (response.data.success) {
        setMessage('Song uploaded successfully!');
        setUploadSuccess(true);
        
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
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setUploadSuccess(false);
          setProgress(0);
        }, 3000);
      } else {
        setMessage(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else if (error.code === 'ECONNABORTED') {
        setMessage('Upload timeout. Please try again.');
      } else {
        setMessage('Upload failed. Please check your connection and try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
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
    setMessage('');
    setUploadSuccess(false);
    setProgress(0);
    const fileInput = document.getElementById('audio-file');
    if (fileInput) fileInput.value = '';
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
          <div className={`message ${uploadSuccess ? 'success' : 'error'}`}>
            {uploadSuccess ? <FaCheck className="message-icon" /> : null}
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
                disabled={uploading}
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
                disabled={uploading}
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
                disabled={uploading}
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
                disabled={uploading}
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
                disabled={uploading}
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
                disabled={uploading}
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
              disabled={uploading}
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
                disabled={uploading}
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
                    <span>Choose audio file (MP3, WAV, OGG, AAC)</span>
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

          <div className="form-actions">
            <button 
              type="submit" 
              className="upload-button"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <FaSpinner className="spinner" />
                  Uploading... ({progress}%)
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload Song
                </>
              )}
            </button>
            
            <button 
              type="button" 
              className="cancel-button"
              onClick={resetForm}
              disabled={uploading}
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;