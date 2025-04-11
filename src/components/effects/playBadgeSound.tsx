
export function playBadgeSound() {
  const audio = new Audio('/badge-unlock.mp3');
  audio.volume = 0.6;
  audio.play().catch(error => {
    console.warn("Audio playback failed:", error);
    // Most browsers require user interaction before playing audio
  });
}
