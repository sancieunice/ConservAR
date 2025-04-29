// Utility functions for audio handling

// Ambient nature sounds for different environments
export const NATURE_SOUNDS = {
  forest: "https://assets.mixkit.co/music/preview/mixkit-enchanted-forest-118.mp3",
  savanna: "https://freesound.org/data/previews/405/405639_4921277-lq.mp3",
  ocean: "https://freesound.org/data/previews/557/557808_7292160-lq.mp3",
  rainforest: "https://freesound.org/data/previews/322/322413_4548252-lq.mp3",
  wetlands: "https://freesound.org/data/previews/171/171104_2394244-lq.mp3"
};

// Sound effects for game interactions
export const SOUND_EFFECTS = {
  correct: "https://freesound.org/data/previews/571/571920_6384969-lq.mp3",
  incorrect: "https://freesound.org/data/previews/421/421002_7474351-lq.mp3",
  click: "https://freesound.org/data/previews/616/616092_11961552-lq.mp3",
  complete: "https://freesound.org/data/previews/319/319226_5303369-lq.mp3",
  notification: "https://freesound.org/data/previews/428/428641_9021651-lq.mp3"
};

// Preload audio files
export const preloadAudio = (urls: string[]): Promise<void> => {
  const promises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve();
      audio.onerror = reject;
      audio.src = url;
    });
  });

  return Promise.all(promises).then(() => {});
};

// Play a sound effect once
export const playSound = (url: string, volume = 0.5): void => {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch(e => console.error("Error playing sound:", e));
};

// Transition between audio tracks with crossfade
export const transitionAudio = (
  currentAudio: HTMLAudioElement | null,
  newUrl: string,
  fadeTime = 1000
): HTMLAudioElement => {
  // Create new audio element
  const newAudio = new Audio(newUrl);
  newAudio.loop = true;
  newAudio.volume = 0;
  
  // Start playing new audio
  newAudio.play().catch(e => console.error("Error playing audio:", e));
  
  // Crossfade if there's a current audio playing
  if (currentAudio && !currentAudio.paused) {
    const fadeInterval = 50;
    const steps = fadeTime / fadeInterval;
    let step = 0;
    
    const fade = setInterval(() => {
      step++;
      const ratio = step / steps;
      
      // Fade out current audio
      currentAudio.volume = Math.max(0, 1 - ratio);
      
      // Fade in new audio
      newAudio.volume = Math.min(1, ratio);
      
      if (step >= steps) {
        clearInterval(fade);
        currentAudio.pause();
        currentAudio.src = '';
      }
    }, fadeInterval);
  } else {
    // Just fade in new audio if no current audio
    const fadeInterval = 50;
    const steps = fadeTime / fadeInterval;
    let step = 0;
    
    const fade = setInterval(() => {
      step++;
      newAudio.volume = Math.min(1, step / steps);
      
      if (step >= steps) {
        clearInterval(fade);
      }
    }, fadeInterval);
  }
  
  return newAudio;
};
