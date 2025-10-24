import React, { createContext, useState, useContext, useRef, useCallback } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeat, setRepeat] = useState('none');
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  // Initialize audio element
  React.useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    
    const handleEnded = () => {
      nextSong();
    };
    
    const handleError = (error) => {
      console.error('Audio error:', error);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  const playSong = useCallback((song, songList = [], index = 0) => {
    if (songList.length > 0) {
      setQueue(songList);
      setCurrentIndex(index);
    }
    
    setCurrentSong(song);
    const audio = audioRef.current;
    
    if (audio) {
      audio.src = `http://localhost:5000${song.fileUrl}`;
      audio.volume = volume;
      
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Play failed:', error);
          setIsPlaying(false);
        });
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Play failed:', error);
          setIsPlaying(false);
        });
    }
  }, [currentSong, isPlaying]);

  const nextSong = useCallback(() => {
    if (queue.length === 0) {
      setIsPlaying(false);
      return;
    }

    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    if (nextIndex === currentIndex && repeat === 'none') {
      setIsPlaying(false);
      return;
    }

    if (repeat === 'one') {
      // Replay current song
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
      return;
    }

    setCurrentIndex(nextIndex);
    playSong(queue[nextIndex], queue, nextIndex);
  }, [queue, currentIndex, shuffle, repeat, playSong]);

  const prevSong = useCallback(() => {
    if (queue.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    setCurrentIndex(prevIndex);
    playSong(queue[prevIndex], queue, prevIndex);
  }, [queue, currentIndex, playSong]);

  const seek = useCallback((percentage) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const time = (percentage / 100) * audio.duration;
      audio.currentTime = time;
      setProgress(percentage);
    }
  }, []);

  const setVolumeHandler = useCallback((vol) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  const value = {
    currentSong,
    isPlaying,
    volume,
    progress,
    queue,
    repeat,
    shuffle,
    duration,
    currentTime,
    playSong,
    togglePlay,
    nextSong,
    prevSong,
    setVolume: setVolumeHandler,
    seek,
    setRepeat,
    setShuffle,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};