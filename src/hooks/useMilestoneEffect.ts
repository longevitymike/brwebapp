import { useEffect } from "react";
import { Howl } from "howler";

// NOTE: The sound file path needs to be correct and the file must exist in the public folder.
// Currently '/sounds/streak-milestone.mp3' is missing.
const milestoneSound = new Howl({
  src: ["/sounds/streak-milestone.mp3"], // This path will likely fail
  volume: 0.5,
  html5: true, // Often helps with browser compatibility
  onloaderror: (id, err) => {
    console.error("Failed to load milestone sound:", err);
  },
  onplayerror: (id, err) => {
     console.error("Failed to play milestone sound:", err);
  }
});

export const useMilestoneEffect = (streakCount: number, milestone: number, onTrigger?: () => void) => {
  useEffect(() => {
    // Check if the current streak *exactly* matches a milestone we care about
    if (streakCount === milestone) {
      console.log(`Milestone ${milestone} reached! Attempting to play sound.`);
      milestoneSound.play();
      if (onTrigger) {
        console.log("Triggering milestone callback.");
        onTrigger();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakCount]); // Rerun only when streakCount changes
};