import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type AudioTrack = 'ambientNature' | 'birds' | 'waterStream';

interface AudioContextType {
  isPlaying: boolean;
  audioTrack: AudioTrack;
  audioElement: HTMLAudioElement | null;
  togglePlay: () => void;
  changeTrack: (track: AudioTrack) => void;
  setAudioElement: (element: HTMLAudioElement) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioTrack, setAudioTrack] = useState<AudioTrack>('ambientNature');
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const changeTrack = useCallback((track: AudioTrack) => {
    setAudioTrack(track);
    // If track changes while playing, keep playing the new track
    if (isPlaying && audioElement) {
      // The actual source change is handled in the SoundPlayer effect
      audioElement.load();
      audioElement.play().catch(e => console.error("Error playing new track:", e));
    }
  }, [isPlaying, audioElement]);

  const value = {
    isPlaying,
    audioTrack,
    audioElement,
    togglePlay,
    changeTrack,
    setAudioElement
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
