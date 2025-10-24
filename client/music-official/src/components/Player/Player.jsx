import React from 'react';
import { useMusic } from '../../contexts/MusicContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo } from 'react-icons/fa';
import './Player.css';

const Player = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    repeat,
    shuffle,
    togglePlay,
    nextSong,
    prevSong,
    setVolume,
    seek,
    setRepeat,
    setShuffle,
  } = useMusic();

  if (!currentSong) {
    return null;
  }

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width * 100;
    seek(percent);
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case 'one': return <FaRedo className="active" />;
      case 'all': return <FaRedo />;
      default: return <FaRedo />;
    }
  };

  return (
    <div className="player">
      <div className="player-info">
        <img 
          src={currentSong.coverArt || '/default-cover.jpg'} 
          alt={currentSong.title}
          className="player-cover"
        />
        <div className="player-details">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
        </div>
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button 
            className={`control-btn ${shuffle ? 'active' : ''}`}
            onClick={() => setShuffle(!shuffle)}
          >
            <FaRandom />
          </button>
          <button className="control-btn" onClick={prevSong}>
            <FaStepBackward />
          </button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="control-btn" onClick={nextSong}>
            <FaStepForward />
          </button>
          <button 
            className={`control-btn ${repeat !== 'none' ? 'active' : ''}`}
            onClick={() => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none')}
          >
            {getRepeatIcon()}
          </button>
        </div>

        <div className="progress-bar" onClick={handleProgressClick}>
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="player-volume">
        <FaVolumeUp />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default Player;