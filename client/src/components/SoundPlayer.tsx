import { useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

// Nature sounds URLs from public CDNs
const AUDIO_URLS = {
  ambientNature: "https://assets.mixkit.co/music/preview/mixkit-enchanted-forest-118.mp3",
  birds: "https://freesound.org/data/previews/538/538774_2190357-lq.mp3",
  waterStream: "https://freesound.org/data/previews/529/529957_3156860-lq.mp3"
};

const SoundPlayer = () => {
  const { isPlaying, audioTrack, setAudioElement } = useAudio();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audioRef.current = audio;
      setAudioElement(audio);
    }

    // Set the current track
    if (audioRef.current) {
      audioRef.current.src = AUDIO_URLS[audioTrack as keyof typeof AUDIO_URLS] || AUDIO_URLS.ambientNature;
      
      // Play/pause based on state
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }

    // Clean up audio on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [isPlaying, audioTrack, setAudioElement]);

  return (
    <div className="fixed bottom-4 right-4 z-50 opacity-0">
      {/* Hidden div for audio player - actual audio is handled via refs */}
    </div>
  );
};

export default SoundPlayer;
