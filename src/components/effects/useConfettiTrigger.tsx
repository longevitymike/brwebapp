
import { useEffect } from "react";
import confetti from "canvas-confetti";

export function useConfettiTrigger(trigger = false) {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [trigger]);
}
