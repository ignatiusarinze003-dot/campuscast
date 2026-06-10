// useAudio.js — manages audio player state
import { useState, useRef } from 'react';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changeVolume = (val) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const loadSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(false);
  };

  return {
    isPlaying,
    volume,
    currentSong,
    audioRef,
    play,
    pause,
    changeVolume,
    loadSong,
  };
}